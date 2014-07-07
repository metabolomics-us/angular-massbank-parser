'use strict';

angular.module('massbank.parser', []).
    service('massbankService', function () {
        // reference to our service
        var self = this;

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

            // Builds our metadata object
            while((match = regexAttr.exec(data)) != null) {
                if(match[1] === 'PEAK' || match[1] === 'NUM_PEAK')
                    continue;

                else if(match[1] === 'NAME')
                    spectrum.names.push(trim(match[2]));
                
                else if(match[1] === 'ANNOTATION') {
                    meta['annotation'] = [];

                    // Parse anotation entries
                    while((match = regexAnnotation.exec(data)) != null)
                        meta['annotation'].push({value: trim(match[1]) +" "+ trim(match[2])});
                }

                else {
                    if(match[1] == 'LINK' || match[1] === 'MASS_SPECTROMETRY' ||
                            match[1] === 'CHROMATOGRAPHY' || match[1] == 'FOCUSED_ION'||
                            match[1] == 'DATA_PROESSING')
                        match = regexSubtags.exec(match[2]);

                    // Add metadata as an array
                    var key = match[1].toLowerCase();
                    if(!(key in meta))
                        meta[key] = [];
                    meta[key].push(match[2]);
                }
            }

            // Add metadata to spectrum object
            Object.keys(meta).forEach(function(key) {
                spectrum.meta.push({name: key, value: meta[key]});
            });


            // Builds the spectrum
            var regexSpectra = /\s\s(\d+\.?\d*)\s(\d+\.?\d*)\s\d+\s/g;
            match = regexSpectra.exec(data);

            var ions = []
            var accurateMass = false;

            while((match = regexSpectra.exec(data)) != null) {
                if(match[1].indexOf('.') > -1 && match[1].split())
                ions.push(match[1] +':'+ match[2]);
            }

            // Join ions to create spectrum string
            spectrum.spectrum = ions.join(' ');


            // Make sure we have at least a spectrum and name before returning the spectrum
            if(ions.length && spectrum.names.length)
                callback(spectrum);
        };

        /**
         * converts the given data to an array of spectra objects and it's just a convinience method
         * @param data
         * @returns {*}
         */
        this.convertToArray = function(data) {
            if (angular.isDefined(data)) {
                var result = [];

                this.convertWithCallback(data, function(spectra) {
                    result.push(spectra);
                });

                return result;
            } else
                return [];
        };

        /**
         * reads the given file and try's to convert the data from it to spectra, the callback method is going to take care of the details
         * @param file
         * @param callback
         */
        this.convertFromFile = function (file, callback) {
            // If it's an arry, recrusive approach
            if (angular.isArray(file)) {
                for (var i = 0; i < file.length; i++) {
                    self.convertFromFile(file[i], callback);
                }
            }

            // Otherwise just convert it
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    self.convertWithCallback(data, callback);
                };

                reader.readAsText(file);
            }
        }
    });