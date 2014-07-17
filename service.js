'use strict';

angular.module('wohlgemuth.massbank.parser', []).
    service('gwMassbankService', function ($log,$filter) {
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


            function addMetaData(data, category, spectrum) {
                var sub = /(\w+[\/]*\w)\s(.+)/;

                match = sub.exec(match[2]);

                // Add metadata as an array
                var key = match[1].toLowerCase();

                spectrum.meta.push({name: trim(key), value: trim(match[2]), category: trim(category)});
            }

            // Initial spectrum
            var spectrum = {meta: [], names: []};


            var meta = {};


            // Regular expression for getting the attributes
            var regexAttr = /\s*(\w+):\s(.+)\s/g;

            // Regular expression for getting the annotations
            var regexAnnotation = /\s\s(\d+\.?\d*)\s(\[[+\-\w]+\][+\-])\s/g;

            // Regular expression for getting subtags and values
            var regexSubtags = /(\w+)\s(.+)/;

            // Regex matches
            var match;

            var buf = data.toString('utf8');

            // Builds our metadata object
            while ((match = regexAttr.exec(buf)) != null) {

                if (match[1] === 'PEAK' || match[1] === 'NUM_PEAK' || match[1] === 'SMILES' || match[1] === 'FORMULA' || match[1] === 'RECORD_TITLE') {
                    //skip
                }
                else if (match[1] === 'NAME') {
                    spectrum.names.push(trim(match[2]));
                }
                else if (match[1] === 'ANNOTATION') {
                    meta['annotation'] = [];

                    // Parse anotation entries
                    while ((match = regexAnnotation.exec(data)) != null)
                        meta['annotation'].push({value: trim(match[1]) + " " + trim(match[2])});
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
            var regexSpectra = /\s\s(\d+\.?\d*)\s(\d+\.?\d*)\s\d+\s/g;
            var ions = [];
            var accurateMass = false;

            while ((match = regexSpectra.exec(buf)) != null) {
                ions.push(match[1] + ':' + match[2]);

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
         * converts the given data to an array of spectra objects and it's just a convinience method
         * @param data
         * @returns {*}
         */
        this.convertToArray = function (data) {
            if (angular.isDefined(data)) {
                var result = [];

                this.convertWithCallback(data, function (spectra) {
                    result.push(spectra);
                });

                return result;
            } else
                return [];
        };

        this.convertFromData = function (data, callback) {
            return this.convertWithCallback(data, callback);
        }
    });