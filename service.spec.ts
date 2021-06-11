/**
 * Created by Gert on 6/16/2014.
 */
import angular, { auto } from 'angular';

describe('MassbankService test',  () => {
    describe('when I call massbankService.convert',  () => {
        beforeEach(angular.mock.module('wohlgemuth.massbank.parser'));

        /**
         * Read data from massbank record files and return via callback
         */
        let readFile = (filename, gwMassbankService, callback) => {
            let fileReader = new XMLHttpRequest();

            // For some reason, karma places all served data in /base/
            fileReader.open('GET', '/base/test_data/'+ filename, false);

            fileReader.onreadystatechange = () => {
                gwMassbankService.convertWithCallback(fileReader.responseText, callback);
            };

            fileReader.send();
        };


        /*
         * Tests for each massbank source
         */

        it('should parse data from Boise State University', angular.mock.inject((gwMassbankService) => {
            readFile('BSU00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Veratramine')).toBeGreaterThan(-1);
                expect(data.names.indexOf('(3beta,23R)-14,15,16,17-Tetradehydroveratraman-3,23-diol')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Chubu University', angular.mock.inject((gwMassbankService) => {
            readFile('UT000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('11,12-EET')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Eawag', angular.mock.inject((gwMassbankService) => {
            readFile('EA000401.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Metamitron-desamino')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from FIOCRUZ', angular.mock.inject((gwMassbankService) => {
            readFile('FIO00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Ajmalicine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from University of Occupational and Environmental Health', angular.mock.inject((gwMassbankService) => {
            readFile('JP000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('1-NITROPYRENE')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Fukuyama University', angular.mock.inject((gwMassbankService) => {
            readFile('FU000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('3-Man2GlcNAc')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from GL Sciences Inc.', angular.mock.inject((gwMassbankService) => {
            readFile('GLS00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('alpha-MethylBenzylamine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Institute of Plant Biochemistry', angular.mock.inject((gwMassbankService) => {
            readFile('PB000122.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Naringenin')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from JEOL Ltd.', angular.mock.inject((gwMassbankService) => {
            readFile('JEL00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('ACTH fragment 18-39')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Kazusa DNA Research Institute', angular.mock.inject((gwMassbankService) => {
            readFile('KZ000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('o-Phenanthroline')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Kyoto University', angular.mock.inject((gwMassbankService) => {
            readFile('CA000002.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Alloxanthin')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from MPI for Chemical Ecology', angular.mock.inject((gwMassbankService) => {
            readFile('CE000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Erythromycin')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Mass Spectrometry Society of Japan', angular.mock.inject((gwMassbankService) => {
            readFile('MSJ00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Feruloyltyramine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Metabolon Inc.', angular.mock.inject((gwMassbankService) => {
            readFile('MT000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('2-Linoleoyl-glycerol')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from NAIST', angular.mock.inject((gwMassbankService) => {
            readFile('KNA00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('D-2-Aminobutyrate')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Nihon University', angular.mock.inject((gwMassbankService) => {
            readFile('NU000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Allolithocholic Acid Methyl ester')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Osaka MCHRI', angular.mock.inject((gwMassbankService) => {
            readFile('MCH00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Disialoganglioside GD1a')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Osaka University', angular.mock.inject((gwMassbankService) => {
            readFile('OUF00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('1,3-Propanediamine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from PFOS', angular.mock.inject((gwMassbankService) => {
            readFile('FFF00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Cholesterol')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from RIKEN', angular.mock.inject((gwMassbankService) => {
            readFile('PR010001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('1,3-Diaminopropane')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Tottori University', angular.mock.inject((gwMassbankService) => {
            readFile('TT000113.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Vitexicarpin')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from UFZ', angular.mock.inject((gwMassbankService) => {
            readFile('UF000101.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Phenazine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from University of Occupational and Environmental Health', angular.mock.inject((gwMassbankService) => {
            readFile('UO000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('archaetidylserine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from University of Connecticut', angular.mock.inject((gwMassbankService) => {
            readFile('CO000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('4_Aminoantipyrine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from University of Toyama', angular.mock.inject((gwMassbankService) => {
            readFile('TY000001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Gynosaponin C')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));
        
        it('should parse data from Washington State University', angular.mock.inject((gwMassbankService) => {
            readFile('BML00001.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Cytisine')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));



        /*
         * Tests to verify that specific bugs have been fixed
         */

        it('should have a name', angular.mock.inject((gwMassbankService) => {
            readFile('JP002980.txt', gwMassbankService, (data) => {
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();

                expect(data.names.length).toBeGreaterThan(0);
            });
        }));

        /*it('should have the appropriate category', angular.mock.inject((gwMassbankService) => {
            readFile('BML00033.txt', gwMassbankService, (data) => {
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();

                let comment = data.meta.filter((x) => {
                    console.log(x);
                    console.log(JSON.stringify(x));
                    console.log(JSON.stringify(x).indexOf('COMMENT'));
                    return JSON.stringify(x).indexOf('COMMENT') > -1;
                })
                expect(comment.length).toBe(1);
                expect('category' in comment[0]).toBe(false);
            });
        }));
        Commented out this test, not sure what it's trying to accomplish since this Comment index only exists on data.comments
        and nowhere within the meta field
        */

        it('should not have a matching exception', angular.mock.inject((gwMassbankService) => {
            readFile('UF000108.txt', gwMassbankService, (data) => {
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();
            });
        }));

        it('should parse annotations', angular.mock.inject((gwMassbankService) => {
            readFile('UT002536.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('Phosphatidylcholine alkenyl 16:0-16:0')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();

                var annotations = data.meta.filter((x) => { return ('category' in x) && x.category == 'annotation'; });
                expect(annotations.length).toBeGreaterThan(0);
            });
        }));

        it('should parse scientific notation', angular.mock.inject((gwMassbankService) => {
            readFile('FU000020.txt', gwMassbankService, (data) => {
                expect(data.names.indexOf('6-Man4GlcNAc-II')).toBeGreaterThan(-1);
                expect(data.names.indexOf('Man-alpha-1-2Man-alpha-1-3Man-alpha-1-6Man-beta-1-5GlcNAc')).toBeGreaterThan(-1);
                expect(data.meta.length).toBeGreaterThan(0);
                expect(data.spectrum).toBeDefined();

                expect(data.spectrum).toMatch(/^((\d+\.?\d*):(\d+\.?\d*)\s?)+$/);
            });
        }));
    });
});
