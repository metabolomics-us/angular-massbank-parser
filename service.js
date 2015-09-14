'use strict';

angular.module('wohlgemuth.massbank.parser', []).
    service('gwMassbankService', function ($log, $filter) {
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

                if (match == null) {
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

            // Regular expression for getting the attributes
            var regexAttr = /\s*(\S+):\s(.+)\s/g;

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
                if (match[1] === 'PK$PEAK' || match[1] === 'PK$NUM_PEAK' || match[1] === 'CH$SMILES' || match[1] === 'CH$FORMULA' || match[1] === 'RECORD_TITLE' || match[1] === 'DATE') {
                    //skip
                }
                else if (match[1] === 'CH$NAME') {
                    spectrum.names.push(trim(match[2]));
                }
                else if (match[1] === 'PK$ANNOTATION') {
                    // Parse annotation entries
                    while ((match = regexAnnotation.exec(data)) != null) {
                        spectrum.meta.push({category: "annotation", name: trim(match[2]), value: trim(match[1])});
                    }
                }
                else if (match[1] == 'CH$IUPAC') {
                    spectrum.inchi = trim(match[2]);
                }
                else if (match[1] == 'COMMENT') {
                    spectrum.comments = trim(match[2]);
                }
                else {
                    if (match[1].indexOf('LINK') > -1) {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] === 'AC$MASS_SPECTROMETRY') {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] === 'AC$CHROMATOGRAPHY') {
                        addMetaData(match[2], match[1], spectrum);
                    } else if (match[1] == 'MS$FOCUSED_ION') {
                        addMetaData(match[2], match[1], spectrum);
                    }
                    else if (match[1] == 'MS$DATA_PROESSING') {
                        addMetaData(match[2], match[1], spectrum);
                    }

                    else {
                        spectrum.meta.push({name: trim(match[1]), value: trim(match[2])});
                    }
                }
            }

            var reg = /^(?:[a-zA-Z\s])*\$(.*)$/i;

            for (var i = 0; i < spectrum.meta.length; i++) {
                var object = spectrum.meta[i];

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
            var regexSpectra = /\s\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s(\d+)\b/g;

            /**
             * is this an accurate mass
             * @type {RegExp}
             */
            var regExAccurateMass = /([0-9]*\.?[0-9]{3,})/;

            var ions = [];

            var isAbsolute = false;

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
            for (var i = 0; i < ions.length; i++) {
                if (isAbsolute) {
                    ions[i] = ions[i][0] +':'+ ions[i][1];
                } else {
                    ions[i] = ions[i][0] +':'+ ions[i][2];
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

        /**
         * converts the data using a callback
         * @param data
         * @param callback
         */
        this.convertFromData = function (data, callback) {
            return this.convertWithCallback(data, callback);
        };

        /**
         * counts the number of mass spectra in this library file
         * @param data
         * @returns {number}
         */
        this.countSpectra = function(data) {
            var count = 0;
            var pos = -1;

            while((pos = data.indexOf('PK$NUM_PEAK', pos + 1)) != -1) {
                count++;
            }

            // Massbank record files are only valid if they have a single spectrum
            return (count <= 1 ? count : 0);
        }
    });