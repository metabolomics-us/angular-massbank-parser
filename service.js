'use strict';

angular.module('wohlgemuth.massbank.parser', []).
    service('gwMassbankService', function ($log, $filter) {
        // reference to our service

        /**
         * Converts the data using a callback
         * Follows the MassBank Record Format v2.09
         * http://www.massbank.jp/manuals/MassBankRecord_en.pdf
         * @param data
         * @param callback
         */
        this.convertWithCallback = function (data, callback) {
            // Trim white spaces
            var trim = function (str) {
                return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            };


            function addMetaData(value, category, spectrum) {
                if (category != null) {
                    category = trim(category);
                }

                var sub = /(\w+[\/]*\w)\s(.+)/;

                var match = sub.exec(value);

                if(match == null) {
                    return;
                }

                // Add metadata as an array
                var key = trim(match[1].toLowerCase());

                //switch categories
                if (category == 'FOCUSED_ION') {
                    category = 'MASS_SPECTROMETRY'
                }

                //let's cutoff the units
                if (key == 'retention_time') {

                    var reg = /([0-9]+\.?[0-9]+).*min.*/;

                    if (reg.test(match[2])) {
                        spectrum.meta.push({name: (key), value: trim(reg.exec(match[2])[1]), category: (category)});
                    }
                    else {
                        spectrum.meta.push({name: (key), value: trim(match[2]), category: (category)});
                    }
                }
                //make sure this is a double or ignore it
                if (key == 'precursor_m/z') {
                    var reg = /([0-9]+\.?[0-9]+)/g;

                    var getIt = reg.exec(match[2]);

                    while (getIt != null) {
                        spectrum.meta.push({name: ('precursor m/z'), value: trim(getIt[1]), category: (category)});

                        getIt = reg.exec(match[2])
                    }
                }
                //just deal with it
                else {
                    spectrum.meta.push({name: (key), value: trim(match[2]), category: (category)});
                }
            }

            // Initial spectrum
            var spectrum = {meta: [], names: []};

            var meta = {};

            // Regular expression for getting the attributes
            var regexAttr = /\s*(\w+):\s(.+)\s/g;

            // Regular expression for getting the annotations
            // Get entire annotation: /(\s\s(?:\d+\.?\d*)(?:\s\d+)?\s+[^\s\d]+.+)/g
            var regexAnnotation = /\s\s(\d+\.?\d*)(?:\s\d+)?\s+.*(\[.+\][\+\-]?(?:\(.+\))?).*/g;

            // Regular expression for getting subtags and values
            var regexSubtags = /(\w+)\s(.+)/;

            // Regex matches
            var match;

            var buf = data.toString('utf8');

            // Builds our metadata object
            while ((match = regexAttr.exec(buf)) != null) {

                if (match[1] === 'PEAK' || match[1] === 'NUM_PEAK' || match[1] === 'SMILES' || match[1] === 'FORMULA' || match[1] === 'RECORD_TITLE' || match[1] === 'DATE') {
                    //skip
                }
                else if (match[1] === 'NAME') {
                    spectrum.names.push(trim(match[2]));
                }
                else if (match[1] === 'ANNOTATION') {
                    // Parse annotation entries
                    while ((match = regexAnnotation.exec(data)) != null) {
                        spectrum.meta.push({category: "annotation", name: trim(match[2]), value: trim(match[1])});
                    }
                }
                else if (match[1] == 'IUPAC') {
                    spectrum.inchi = trim(match[2]);
                }
                else {
                    if (match[1] == 'LINK') {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] === 'MASS_SPECTROMETRY') {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] === 'CHROMATOGRAPHY') {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] == 'FOCUSED_ION') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] == 'DATA_PROESSING') {
                        addMetaData(match[2], match[1], spectrum);
                    }

                    else {
                        spectrum.meta.push({name: trim(match[1]), value: trim(match[2])});
                    }
                }
            }

            // Add metadata to spectrum object
            Object.keys(meta).forEach(function (key) {

                var current = meta[key];

                for (var x in current) {
                    spectrum.meta.push({name: key, value: current[x]});
                }
            });


            // Builds the spectrum
            // Floating point/scientific notation regex:
            //     (?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?
            // from: http://stackoverflow.com/a/658662/406772
            var regexSpectra = /\s\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s\d+\b/g;

            /**
             * is this an accurate mass
             * @type {RegExp}
             */
            var regExAccurateMass = /([0-9]*\.?[0-9]{3,})/;

            var ions = [];
            var accurateMass = true;

            while ((match = regexSpectra.exec(buf)) != null) {
                // Convert scientific notation
                if (match[1].toLowerCase().indexOf('e') > -1) {
                    match[1] = parseFloat(match[1]).toString();
                }
                if (match[2].toLowerCase().indexOf('e') > -1) {
                    match[2] = parseFloat(match[2]).toString();
                }

                ions.push(match[1] + ':' + match[2]);

                // Used to determine if this is an accurate mass spectra or not
                if (!regExAccurateMass.test(match[1])) {
                    spectrum.accurate = false;
                }
            }

            // Join ions to create spectrum string
            spectrum.spectrum = ions.join(' ');


            // Make sure we have at least a spectrum and name before returning the spectrum
            if (ions.length && spectrum.names.length) {
                callback(spectrum);
            }
            else {
                $log.warn("was no able to find valid spectra for record:\n\n" + data + "\n\n build object was:\n\n" + $filter('json')(spectrum));
            }
        };

        this.convertFromData = function (data, callback) {
            return this.convertWithCallback(data, callback);
        }
    });