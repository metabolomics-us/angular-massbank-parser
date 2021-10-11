import { Inject, Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import * as i0 from "@angular/core";
import * as i1 from "ngx-logger";
export class MassbankParserLibService {
    constructor(logger) {
        this.logger = logger;
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
                this.logger.warn("was no able to find valid spectra for record:\n\n" + data + "\n\n build object was:\n\n" + JSON.stringify(spectrum));
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
    }
}
MassbankParserLibService.ɵfac = function MassbankParserLibService_Factory(t) { return new (t || MassbankParserLibService)(i0.ɵɵinject(NGXLogger)); };
MassbankParserLibService.ɵprov = i0.ɵɵdefineInjectable({ token: MassbankParserLibService, factory: MassbankParserLibService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MassbankParserLibService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.NGXLogger, decorators: [{
                type: Inject,
                args: [NGXLogger]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc2JhbmstcGFyc2VyLWxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL25vbGFuL0RldmVsb3BtZW50L21vbmEtc2VydmljZXMvYW5ndWxhci1tYXNzYmFuay1wYXJzZXIvcHJvamVjdHMvbWFzc2JhbmstcGFyc2VyLWxpYi9zcmMvIiwic291cmNlcyI6WyJsaWIvbWFzc2JhbmstcGFyc2VyLWxpYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7OztBQUt0QyxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DLFlBQXVDLE1BQWlCO1FBQWpCLFdBQU0sR0FBTixNQUFNLENBQVc7UUFFeEQ7Ozs7OztXQU1HO1FBQ0gsd0JBQW1CLEdBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDeEMsb0JBQW9CO1lBQ3BCLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUM7WUFHRixTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVE7Z0JBQzVDLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtvQkFDcEIsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDM0I7Z0JBRUQsSUFBSSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7Z0JBRS9CLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTVCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtvQkFDakIsT0FBTztpQkFDUjtnQkFFRCwyQkFBMkI7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QU07YUFDbkI7O3NCQUdjLE1BQU07dUJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HWExvZ2dlcn0gZnJvbSBcIm5neC1sb2dnZXJcIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTWFzc2JhbmtQYXJzZXJMaWJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KE5HWExvZ2dlcikgcHJpdmF0ZSBsb2dnZXI6IE5HWExvZ2dlcikgeyB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBkYXRhIHVzaW5nIGEgY2FsbGJhY2tcbiAgICogRm9sbG93cyB0aGUgTWFzc0JhbmsgUmVjb3JkIEZvcm1hdCB2Mi4wOVxuICAgKiBodHRwOi8vd3d3Lm1hc3NiYW5rLmpwL21hbnVhbHMvTWFzc0JhbmtSZWNvcmRfZW4ucGRmXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKi9cbiAgY29udmVydFdpdGhDYWxsYmFjayA9ICAoZGF0YSwgY2FsbGJhY2spID0+IHtcbiAgICAvLyBUcmltIHdoaXRlIHNwYWNlc1xuICAgIGxldCB0cmltID0gKHN0cikgPT4ge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBhZGRNZXRhRGF0YSh2YWx1ZSwgY2F0ZWdvcnksIHNwZWN0cnVtKXtcbiAgICAgIGlmIChjYXRlZ29yeSAhPSBudWxsKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gdHJpbShjYXRlZ29yeSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzdWIgPSAvKFxcdytbXFwvXSpcXHcpXFxzKC4rKS87XG5cbiAgICAgIGxldCBtYXRjaCA9IHN1Yi5leGVjKHZhbHVlKTtcblxuICAgICAgaWYgKG1hdGNoID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgbWV0YWRhdGEgYXMgYW4gYXJyYXlcbiAgICAgIGxldCBrZXkgPSB0cmltKG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAvL3N3aXRjaCBjYXRlZ29yaWVzXG4gICAgICBpZiAoY2F0ZWdvcnkgPT0gJ0ZPQ1VTRURfSU9OJykge1xuICAgICAgICBjYXRlZ29yeSA9ICdNQVNTX1NQRUNUUk9NRVRSWSdcbiAgICAgIH1cblxuICAgICAgLy9sZXQncyBjdXRvZmYgdGhlIHVuaXRzXG4gICAgICBpZiAoa2V5ID09ICdyZXRlbnRpb25fdGltZScpIHtcbiAgICAgICAgbGV0IHJlZyA9IC8oWzAtOV0rXFwuP1swLTldKykuKm1pbi4qLztcblxuICAgICAgICBpZiAocmVnLnRlc3QobWF0Y2hbMl0pKSB7XG4gICAgICAgICAgc3BlY3RydW0ubWV0YS5wdXNoKHtuYW1lOiAoa2V5KSwgdmFsdWU6IHRyaW0ocmVnLmV4ZWMobWF0Y2hbMl0pWzFdKSwgY2F0ZWdvcnk6IChjYXRlZ29yeSl9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGVjdHJ1bS5tZXRhLnB1c2goe25hbWU6IChrZXkpLCB2YWx1ZTogdHJpbShtYXRjaFsyXSksIGNhdGVnb3J5OiAoY2F0ZWdvcnkpfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9tYWtlIHN1cmUgdGhpcyBpcyBhIGRvdWJsZSBvciBpZ25vcmUgaXRcbiAgICAgIGlmIChrZXkgPT0gJ3ByZWN1cnNvcl9tL3onKSB7XG4gICAgICAgIGxldCByZWcgPSAvKFswLTldK1xcLj9bMC05XSspL2c7XG5cbiAgICAgICAgbGV0IGdldEl0ID0gcmVnLmV4ZWMobWF0Y2hbMl0pO1xuXG4gICAgICAgIHdoaWxlIChnZXRJdCAhPSBudWxsKSB7XG4gICAgICAgICAgc3BlY3RydW0ubWV0YS5wdXNoKHtuYW1lOiAoJ3ByZWN1cnNvciBtL3onKSwgdmFsdWU6IHRyaW0oZ2V0SXRbMV0pLCBjYXRlZ29yeTogKGNhdGVnb3J5KX0pO1xuXG4gICAgICAgICAgZ2V0SXQgPSByZWcuZXhlYyhtYXRjaFsyXSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2p1c3QgZGVhbCB3aXRoIGl0XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3BlY3RydW0ubWV0YS5wdXNoKHtuYW1lOiAoa2V5KSwgdmFsdWU6IHRyaW0obWF0Y2hbMl0pLCBjYXRlZ29yeTogKGNhdGVnb3J5KX0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJbml0aWFsIHNwZWN0cnVtXG4gICAgbGV0IHNwZWN0cnVtID0ge25hbWVzOiBbXSwgbWV0YTogW10sIGluY2hpOiAnJywgY29tbWVudHM6ICcnLCBhY2N1cmF0ZTogdHJ1ZSwgc3BlY3RydW06ICcnfTtcblxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgZ2V0dGluZyB0aGUgYXR0cmlidXRlc1xuICAgIGxldCByZWdleEF0dHIgPSAvXFxzKihcXFMrKTpcXHMoLispXFxzL2c7XG5cbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGdldHRpbmcgdGhlIGFubm90YXRpb25zXG4gICAgLy8gR2V0IGVudGlyZSBhbm5vdGF0aW9uOiAvKFxcc1xccyg/OlxcZCtcXC4/XFxkKikoPzpcXHNcXGQrKT9cXHMrW15cXHNcXGRdKy4rKS9nXG4gICAgbGV0IHJlZ2V4QW5ub3RhdGlvbiA9IC9cXHNcXHMoXFxkK1xcLj9cXGQqKSg/Olxcc1xcZCspP1xccysuKihcXFsuK1xcXVtcXCtcXC1dPyg/OlxcKC4rXFwpKT8pLiovZztcblxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgZ2V0dGluZyBzdWJ0YWdzIGFuZCB2YWx1ZXNcbiAgICBsZXQgcmVnZXhTdWJ0YWdzID0gLyhcXHcrKVxccyguKykvO1xuXG4gICAgLy8gUmVnZXggbWF0Y2hlc1xuICAgIGxldCBtYXRjaDtcblxuICAgIGxldCBidWYgPSBkYXRhLnRvU3RyaW5nKCd1dGY4Jyk7XG5cbiAgICAvLyBCdWlsZHMgb3VyIG1ldGFkYXRhIG9iamVjdFxuICAgIHdoaWxlICgobWF0Y2ggPSByZWdleEF0dHIuZXhlYyhidWYpKSAhPSBudWxsKSB7XG4gICAgICBpZiAobWF0Y2hbMV0gPT09ICdQSyRQRUFLJyB8fCBtYXRjaFsxXSA9PT0gJ1BLJE5VTV9QRUFLJyB8fCBtYXRjaFsxXSA9PT0gJ0NIJFNNSUxFUycgfHwgbWF0Y2hbMV0gPT09ICdDSCRGT1JNVUxBJyB8fCBtYXRjaFsxXSA9PT0gJ1JFQ09SRF9USVRMRScgfHwgbWF0Y2hbMV0gPT09ICdEQVRFJykge1xuICAgICAgICAvL3NraXBcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG1hdGNoWzFdID09PSAnQ0gkTkFNRScpIHtcbiAgICAgICAgc3BlY3RydW0ubmFtZXMucHVzaCh0cmltKG1hdGNoWzJdKSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtYXRjaFsxXSA9PT0gJ1BLJEFOTk9UQVRJT04nKSB7XG4gICAgICAgIC8vIFBhcnNlIGFubm90YXRpb24gZW50cmllc1xuICAgICAgICB3aGlsZSAoKG1hdGNoID0gcmVnZXhBbm5vdGF0aW9uLmV4ZWMoZGF0YSkpICE9IG51bGwpIHtcbiAgICAgICAgICBzcGVjdHJ1bS5tZXRhLnB1c2goe2NhdGVnb3J5OiBcImFubm90YXRpb25cIiwgbmFtZTogdHJpbShtYXRjaFsyXSksIHZhbHVlOiB0cmltKG1hdGNoWzFdKX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtYXRjaFsxXSA9PSAnQ0gkSVVQQUMnIHx8IG1hdGNoWzFdID09ICdDSCRJTkNISScpIHtcbiAgICAgICAgbWF0Y2hbMl0gPSB0cmltKG1hdGNoWzJdKTtcblxuICAgICAgICBpZiAobWF0Y2hbMl0uaW5kZXhPZignSW5DaEk9JykgPiAtMSkge1xuICAgICAgICAgIC8vIExvb2sgZm9yIHNlY29uZCBpbnN0YW5jZSBvZiAnSW5DaEk9J1xuICAgICAgICAgIGxldCBpZHggPSBtYXRjaFsyXS5pbmRleE9mKCdJbkNoST0nKTtcbiAgICAgICAgICBpZHggPSBtYXRjaFsyXS5pbmRleE9mKCdJbkNoST0nLCBpZHggKyAxKTtcblxuICAgICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgICAgc3BlY3RydW0uaW5jaGkgPSB0cmltKG1hdGNoWzJdLnN1YnN0cmluZyhpZHgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BlY3RydW0uaW5jaGkgPSBtYXRjaFsyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BlY3RydW0ubmFtZXMucHVzaChtYXRjaFsyXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAobWF0Y2hbMV0gPT0gJ0NPTU1FTlQnKSB7XG4gICAgICAgIHNwZWN0cnVtLmNvbW1lbnRzID0gdHJpbShtYXRjaFsyXSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKG1hdGNoWzFdLmluZGV4T2YoJ0xJTksnKSA+IC0xKSB7XG4gICAgICAgICAgYWRkTWV0YURhdGEobWF0Y2hbMl0sIG1hdGNoWzFdLCBzcGVjdHJ1bSk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hbMV0gPT09ICdBQyRNQVNTX1NQRUNUUk9NRVRSWScpIHtcbiAgICAgICAgICBhZGRNZXRhRGF0YShtYXRjaFsyXSwgbWF0Y2hbMV0sIHNwZWN0cnVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaFsxXSA9PT0gJ0FDJENIUk9NQVRPR1JBUEhZJykge1xuICAgICAgICAgIGFkZE1ldGFEYXRhKG1hdGNoWzJdLCBtYXRjaFsxXSwgc3BlY3RydW0pO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoWzFdID09ICdNUyRGT0NVU0VEX0lPTicpIHtcbiAgICAgICAgICBhZGRNZXRhRGF0YShtYXRjaFsyXSwgbWF0Y2hbMV0sIHNwZWN0cnVtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSA9PSAnTVMkREFUQV9QUk9FU1NJTkcnKSB7XG4gICAgICAgICAgYWRkTWV0YURhdGEobWF0Y2hbMl0sIG1hdGNoWzFdLCBzcGVjdHJ1bSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGVjdHJ1bS5tZXRhLnB1c2goe25hbWU6IHRyaW0obWF0Y2hbMV0pLCB2YWx1ZTogdHJpbShtYXRjaFsyXSl9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZWcgPSAvXig/OlthLXpBLVpcXHNdKSpcXCQoLiopJC9pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjdHJ1bS5tZXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgb2JqZWN0ID0gc3BlY3RydW0ubWV0YVtpXTtcblxuICAgICAgaWYgKHJlZy50ZXN0KG9iamVjdC5uYW1lKSkge1xuICAgICAgICBvYmplY3QubmFtZSA9IHJlZy5leGVjKG9iamVjdC5uYW1lKVsxXTtcbiAgICAgIH1cblxuXG4gICAgICBpZiAob2JqZWN0LmNhdGVnb3J5ICE9IG51bGwgJiYgcmVnLnRlc3Qob2JqZWN0LmNhdGVnb3J5KSkge1xuICAgICAgICBvYmplY3QuY2F0ZWdvcnkgPSByZWcuZXhlYyhvYmplY3QuY2F0ZWdvcnkpWzFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJ1aWxkcyB0aGUgc3BlY3RydW1cbiAgICAvLyBGbG9hdGluZyBwb2ludC9zY2llbnRpZmljIG5vdGF0aW9uIHJlZ2V4OlxuICAgIC8vICAgICAoPzowfFsxLTldXFxkKikoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspP1xuICAgIC8vIGZyb206IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY1ODY2Mi80MDY3NzJcbiAgICBsZXQgcmVnZXhTcGVjdHJhID0gL1xcc1xccygoPzowfFsxLTldXFxkKikoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPylcXHMoKD86MHxbMS05XVxcZCopKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pXFxzKFxcZCspXFxiL2c7XG5cbiAgICAvKipcbiAgICAgKiBpcyB0aGlzIGFuIGFjY3VyYXRlIG1hc3NcbiAgICAgKiBAdHlwZSB7UmVnRXhwfVxuICAgICAqL1xuICAgIGxldCByZWdFeEFjY3VyYXRlTWFzcyA9IC8oWzAtOV0qXFwuP1swLTldezMsfSkvO1xuXG4gICAgbGV0IGlvbnMgPSBbXTtcblxuICAgIGxldCBpc0Fic29sdXRlID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gcmVnZXhTcGVjdHJhLmV4ZWMoYnVmKSkgIT0gbnVsbCkge1xuICAgICAgLy8gQ29udmVydCBzY2llbnRpZmljIG5vdGF0aW9uXG4gICAgICBpZiAobWF0Y2hbMV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKCdlJykgPiAtMSkge1xuICAgICAgICBtYXRjaFsxXSA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hbMl0udG9Mb3dlckNhc2UoKS5pbmRleE9mKCdlJykgPiAtMSkge1xuICAgICAgICBtYXRjaFsyXSA9IHBhcnNlRmxvYXQobWF0Y2hbMl0pLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hbM10udG9Mb3dlckNhc2UoKS5pbmRleE9mKCdlJykgPiAtMSkge1xuICAgICAgICBtYXRjaFszXSA9IHBhcnNlRmxvYXQobWF0Y2hbM10pLnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXRjaFsyXSA+IDApIHtcbiAgICAgICAgaXNBYnNvbHV0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlvbnMucHVzaChbbWF0Y2hbMV0sIG1hdGNoWzJdLCBtYXRjaFszXV0pO1xuXG4gICAgICAvLyBVc2VkIHRvIGRldGVybWluZSBpZiB0aGlzIGlzIGFuIGFjY3VyYXRlIG1hc3Mgc3BlY3RyYSBvciBub3RcbiAgICAgIGlmICghcmVnRXhBY2N1cmF0ZU1hc3MudGVzdChtYXRjaFsxXSkpIHtcbiAgICAgICAgc3BlY3RydW0uYWNjdXJhdGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIGludGVuc2l0aWVzIHdpdGggYWJzb2x1dGUgb3IgcmVsYXRpdmUgaW50ZW5zaXRpZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICAgIGlvbnNbaV0gPSBpb25zW2ldWzBdICsgJzonICsgaW9uc1tpXVsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlvbnNbaV0gPSBpb25zW2ldWzBdICsgJzonICsgaW9uc1tpXVsyXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBKb2luIGlvbnMgdG8gY3JlYXRlIHNwZWN0cnVtIHN0cmluZ1xuICAgIHNwZWN0cnVtLnNwZWN0cnVtID0gaW9ucy5qb2luKCcgJyk7XG5cblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGF0IGxlYXN0IGEgc3BlY3RydW0gYW5kIG5hbWUgYmVmb3JlIHJldHVybmluZyB0aGUgc3BlY3RydW1cbiAgICBpZiAoaW9ucy5sZW5ndGggJiYgc3BlY3RydW0ubmFtZXMubGVuZ3RoKSB7XG4gICAgICBjYWxsYmFjayhzcGVjdHJ1bSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5sb2dnZXIud2FybihcIndhcyBubyBhYmxlIHRvIGZpbmQgdmFsaWQgc3BlY3RyYSBmb3IgcmVjb3JkOlxcblxcblwiICsgZGF0YSArIFwiXFxuXFxuIGJ1aWxkIG9iamVjdCB3YXM6XFxuXFxuXCIgKyBKU09OLnN0cmluZ2lmeShzcGVjdHJ1bSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogY29udmVydHMgdGhlIGRhdGEgdXNpbmcgYSBjYWxsYmFja1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICovXG4gIGNvbnZlcnRGcm9tRGF0YSA9ICAoZGF0YSwgY2FsbGJhY2spID0+IHtcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0V2l0aENhbGxiYWNrKGRhdGEsIGNhbGxiYWNrKTtcbiAgfTtcblxuICAvKipcbiAgICogY291bnRzIHRoZSBudW1iZXIgb2YgbWFzcyBzcGVjdHJhIGluIHRoaXMgbGlicmFyeSBmaWxlXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBjb3VudFNwZWN0cmEgPSAgKGRhdGEpID0+IHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGxldCBwb3MgPSAtMTtcblxuICAgIHdoaWxlICgocG9zID0gZGF0YS5pbmRleE9mKCdQSyROVU1fUEVBSycsIHBvcyArIDEpKSAhPSAtMSkge1xuICAgICAgY291bnQrKztcbiAgICB9XG5cbiAgICAvLyBNYXNzYmFuayByZWNvcmQgZmlsZXMgYXJlIG9ubHkgdmFsaWQgaWYgdGhleSBoYXZlIGEgc2luZ2xlIHNwZWN0cnVtXG4gICAgcmV0dXJuIChjb3VudCA8PSAxID8gY291bnQgOiAwKTtcbiAgfVxufVxuIl19