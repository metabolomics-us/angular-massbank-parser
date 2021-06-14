"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const angular = __importStar(require("angular"));
class GwMassBankService {
    constructor($log, $filter) {
        /**
         * Converts the data using a callback
         * Follows the MassBank Record Format v2.09
         * http://www.massbank.jp/manuals/MassBankRecord_en.pdf
         * @param data
         * @param callback
         */
        this.convertWithCallback = (data, callback) => {
            // Trim white spaces
            let trim = (str) => {
                return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            };
            function addMetaData(value, category, spectrum) {
                if (category != null) {
                    category = trim(category);
                }
                let sub = /(\w+[\/]*\w)\s(.+)/;
                let match = sub.exec(value);
                if (match == null) {
                    return;
                }
                // Add metadata as an array
                let key = trim(match[1].toLowerCase());
                //switch categories
                if (category == 'FOCUSED_ION') {
                    category = 'MASS_SPECTROMETRY';
                }
                //let's cutoff the units
                if (key == 'retention_time') {
                    let reg = /([0-9]+\.?[0-9]+).*min.*/;
                    if (reg.test(match[2])) {
                        spectrum.meta.push({ name: (key), value: trim(reg.exec(match[2])[1]), category: (category) });
                    }
                    else {
                        spectrum.meta.push({ name: (key), value: trim(match[2]), category: (category) });
                    }
                }
                //make sure this is a double or ignore it
                if (key == 'precursor_m/z') {
                    let reg = /([0-9]+\.?[0-9]+)/g;
                    let getIt = reg.exec(match[2]);
                    while (getIt != null) {
                        spectrum.meta.push({ name: ('precursor m/z'), value: trim(getIt[1]), category: (category) });
                        getIt = reg.exec(match[2]);
                    }
                }
                //just deal with it
                else {
                    spectrum.meta.push({ name: (key), value: trim(match[2]), category: (category) });
                }
            }
            // Initial spectrum
            let spectrum = { names: [], meta: [], inchi: '', comments: '', accurate: true, spectrum: '' };
            // Regular expression for getting the attributes
            let regexAttr = /\s*(\S+):\s(.+)\s/g;
            // Regular expression for getting the annotations
            // Get entire annotation: /(\s\s(?:\d+\.?\d*)(?:\s\d+)?\s+[^\s\d]+.+)/g
            let regexAnnotation = /\s\s(\d+\.?\d*)(?:\s\d+)?\s+.*(\[.+\][\+\-]?(?:\(.+\))?).*/g;
            // Regular expression for getting subtags and values
            let regexSubtags = /(\w+)\s(.+)/;
            // Regex matches
            let match;
            let buf = data.toString('utf8');
            // Builds our metadata object
            while ((match = regexAttr.exec(buf)) != null) {
                if (match[1] === 'PK$PEAK' || match[1] === 'PK$NUM_PEAK' || match[1] === 'CH$SMILES' || match[1] === 'CH$FORMULA' || match[1] === 'RECORD_TITLE' || match[1] === 'DATE') {
                    //skip
                }
                else if (match[1] === 'CH$NAME') {
                    spectrum.names.push(trim(match[2]));
                }
                else if (match[1] === 'PK$ANNOTATION') {
                    // Parse annotation entries
                    while ((match = regexAnnotation.exec(data)) != null) {
                        spectrum.meta.push({ category: "annotation", name: trim(match[2]), value: trim(match[1]) });
                    }
                }
                else if (match[1] == 'CH$IUPAC' || match[1] == 'CH$INCHI') {
                    match[2] = trim(match[2]);
                    if (match[2].indexOf('InChI=') > -1) {
                        // Look for second instance of 'InChI='
                        let idx = match[2].indexOf('InChI=');
                        idx = match[2].indexOf('InChI=', idx + 1);
                        if (idx > -1) {
                            spectrum.inchi = trim(match[2].substring(idx));
                        }
                        else {
                            spectrum.inchi = match[2];
                        }
                    }
                    else {
                        spectrum.names.push(match[2]);
                    }
                }
                else if (match[1] == 'COMMENT') {
                    spectrum.comments = trim(match[2]);
                }
                else {
                    if (match[1].indexOf('LINK') > -1) {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] === 'AC$MASS_SPECTROMETRY') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] === 'AC$CHROMATOGRAPHY') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] == 'MS$FOCUSED_ION') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] == 'MS$DATA_PROESSING') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else {
                        spectrum.meta.push({ name: trim(match[1]), value: trim(match[2]) });
                    }
                }
            }
            let reg = /^(?:[a-zA-Z\s])*\$(.*)$/i;
            for (let i = 0; i < spectrum.meta.length; i++) {
                let object = spectrum.meta[i];
                if (reg.test(object.name)) {
                    object.name = reg.exec(object.name)[1];
                }
                if (object.category != null && reg.test(object.category)) {
                    object.category = reg.exec(object.category)[1];
                }
            }
            // Builds the spectrum
            // Floating point/scientific notation regex:
            //     (?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?
            // from: http://stackoverflow.com/a/658662/406772
            let regexSpectra = /\s\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s(\d+)\b/g;
            /**
             * is this an accurate mass
             * @type {RegExp}
             */
            let regExAccurateMass = /([0-9]*\.?[0-9]{3,})/;
            let ions = [];
            let isAbsolute = false;
            while ((match = regexSpectra.exec(buf)) != null) {
                // Convert scientific notation
                if (match[1].toLowerCase().indexOf('e') > -1) {
                    match[1] = parseFloat(match[1]).toString();
                }
                if (match[2].toLowerCase().indexOf('e') > -1) {
                    match[2] = parseFloat(match[2]).toString();
                }
                if (match[3].toLowerCase().indexOf('e') > -1) {
                    match[3] = parseFloat(match[3]).toString();
                }
                if (match[2] > 0) {
                    isAbsolute = true;
                }
                ions.push([match[1], match[2], match[3]]);
                // Used to determine if this is an accurate mass spectra or not
                if (!regExAccurateMass.test(match[1])) {
                    spectrum.accurate = false;
                }
            }
            // Replace intensities with absolute or relative intensities
            for (let i = 0; i < ions.length; i++) {
                if (isAbsolute) {
                    ions[i] = ions[i][0] + ':' + ions[i][1];
                }
                else {
                    ions[i] = ions[i][0] + ':' + ions[i][2];
                }
            }
            // Join ions to create spectrum string
            spectrum.spectrum = ions.join(' ');
            // Make sure we have at least a spectrum and name before returning the spectrum
            if (ions.length && spectrum.names.length) {
                callback(spectrum);
            }
            else {
                this.$log.warn("was no able to find valid spectra for record:\n\n" + data + "\n\n build object was:\n\n" + this.$filter('json')(spectrum));
            }
        };
        /**
         * converts the data using a callback
         * @param data
         * @param callback
         */
        this.convertFromData = (data, callback) => {
            return this.convertWithCallback(data, callback);
        };
        /**
         * counts the number of mass spectra in this library file
         * @param data
         * @returns {number}
         */
        this.countSpectra = (data) => {
            let count = 0;
            let pos = -1;
            while ((pos = data.indexOf('PK$NUM_PEAK', pos + 1)) != -1) {
                count++;
            }
            // Massbank record files are only valid if they have a single spectrum
            return (count <= 1 ? count : 0);
        };
        this.$log = $log;
        this.$filter = $filter;
    }
}
exports.default = GwMassBankService;
GwMassBankService.$inject = ['$log', '$filter'];
angular.module('wohlgemuth.massbank.parser', [])
    .service('gwMassbankService', GwMassBankService);
