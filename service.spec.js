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

		
		it('should parse data from Osaka MCHRI', inject(function (gwMassbankService) {
			readFile('MCH00001.txt', gwMassbankService, function(data) {
				expect(data.names.indexOf('Disialoganglioside GD1a')).toBeGreaterThan(-1);
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