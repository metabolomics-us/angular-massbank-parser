/**
 * Created by Gert on 6/16/2014.
 */
describe('MassbankService test', function () {
	describe('when I call massbankService.convert', function () {
		beforeEach(module('wohlgemuth.massbank.parser'));

		/**
		 * Read data from massbank record files and return via callback
		 */
		var readFile = function(filename, gwMassbankService, callback) {
			var fileReader = new XMLHttpRequest();

			// For some reason, karma places all served data in /base/
			fileReader.open('GET', '/base/test_data/'+ filename, false);

			fileReader.onreadystatechange = function() {
				gwMassbankService.convertWithCallback(fileReader.responseText, callback);
			};

			fileReader.send();
		};


		/*
		 * Tests for each massbank source
		 */

		it('should parse data from Boise State University', inject(function (gwMassbankService) {
			readFile('BSU00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Veratramine')).toBeGreaterThan(-1);
				expect(data.names.indexOf('(3beta,23R)-14,15,16,17-Tetradehydroveratraman-3,23-diol')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Chubu University', inject(function (gwMassbankService) {
			readFile('UT000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('11,12-EET')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Eawag', inject(function (gwMassbankService) {
			readFile('EA000401.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Metamitron-desamino')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from FIOCRUZ', inject(function (gwMassbankService) {
			readFile('FIO00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Ajmalicine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from University of Occupational and Environmental Health', inject(function (gwMassbankService) {
			readFile('JP000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('1-NITROPYRENE')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Fukuyama University', inject(function (gwMassbankService) {
			readFile('FU000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('3-Man2GlcNAc')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from GL Sciences Inc.', inject(function (gwMassbankService) {
			readFile('GLS00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('alpha-MethylBenzylamine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Institute of Plant Biochemistry', inject(function (gwMassbankService) {
			readFile('PB000122.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Naringenin')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from JEOL Ltd.', inject(function (gwMassbankService) {
			readFile('JEL00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('ACTH fragment 18-39')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Kazusa DNA Research Institute', inject(function (gwMassbankService) {
			readFile('KZ000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('o-Phenanthroline')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Kyoto University', inject(function (gwMassbankService) {
			readFile('CA000002.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Alloxanthin')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from MPI for Chemical Ecology', inject(function (gwMassbankService) {
			readFile('CE000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Erythromycin')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Metabolon Inc.', inject(function (gwMassbankService) {
			readFile('MT000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('2-Linoleoyl-glycerol')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from NAIST', inject(function (gwMassbankService) {
			readFile('KNA00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('D-2-Aminobutyrate')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Nihon University', inject(function (gwMassbankService) {
			readFile('NU000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Allolithocholic Acid Methyl ester')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Osaka MCHRI', inject(function (gwMassbankService) {
			readFile('MCH00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Disialoganglioside GD1a')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Osaka University', inject(function (gwMassbankService) {
			readFile('OUF00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('1,3-Propanediamine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from PFOS', inject(function (gwMassbankService) {
			readFile('FFF00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Cholesterol')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from RIKEN', inject(function (gwMassbankService) {
			readFile('PR010001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('1,3-Diaminopropane')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Tottori University', inject(function (gwMassbankService) {
			readFile('TT000113.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Vitexicarpin')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from UFZ', inject(function (gwMassbankService) {
			readFile('UF000101.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Phenazine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from University of Occupational and Environmental Health', inject(function (gwMassbankService) {
			readFile('UO000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('archaetidylserine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from University of Connecticut', inject(function (gwMassbankService) {
			readFile('CO000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('4_Aminoantipyrine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from University of Toyama', inject(function (gwMassbankService) {
			readFile('TY000001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Gynosaponin C')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));
		
		it('should parse data from Washington State University', inject(function (gwMassbankService) {
			readFile('BML00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Cytisine')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));



		/*
		 * Tests to verify that specific bugs have been fixed
		 */

		it('should not have a matching exception', inject(function (gwMassbankService) {
			readFile('UF000108.txt', gwMassbankService, function(data) {
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();
			});
		}));

		it('should parse annotations', inject(function (gwMassbankService) {
			readFile('UT002536.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Phosphatidylcholine alkenyl 16:0-16:0')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();

				var annotations = data.meta.filter(function(x) { return ('category' in x) && x.category == 'annotation'; });
				expect(annotations.length).toBeGreaterThan(0);
			});
		}));

		it('should parse scientific notation', inject(function (gwMassbankService) {
			readFile('FU000020.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('6-Man4GlcNAc-II')).toBeGreaterThan(-1);
				expect(data.names.indexOf('Man-alpha-1-2Man-alpha-1-3Man-alpha-1-6Man-beta-1-5GlcNAc')).toBeGreaterThan(-1);
				expect(data.meta.length).toBeGreaterThan(0);
				expect(data.spectrum).toBeDefined();

				expect(data.spectrum).toMatch(/^((\d+\.?\d*):(\d+\.?\d*)\s?)+$/);
			});
		}));
	})
});