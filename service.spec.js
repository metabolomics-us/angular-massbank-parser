/**
 * Created by Gert on 6/16/2014.
 */
describe('MassbankService test', function () {
	describe('when I call massbankService.convert', function () {
		beforeEach(module('wohlgemuth.massbank.parser'));
		
		it('should parse data from Osaka MCHRI', inject(function (gwMassbankService) {
			var fileReader = new XMLHttpRequest();
			fileReader.open('GET', '/base/test_data/MCH00001.txt', false);
			fileReader.onreadystatechange = function() {
				var result = null;
				gwMassbankService.convertWithCallback(
					fileReader.responseText,
					function(result) {
						expect(result.names.indexOf('Disialoganglioside GD1a')).toBeGreaterThan(-1);
						expect(result.meta.length).toBeGreaterThan(0);
						expect(result.spectrum).toBeDefined();
					}
				);
			};
			fileReader.send();
		}));



		it('should parse annotations', inject(function (gwMassbankService) {
			var fileReader = new XMLHttpRequest();
			fileReader.open('GET', '/base/test_data/UT002536.txt', false);
			fileReader.onreadystatechange = function() {
				var result = null;
				gwMassbankService.convertWithCallback(
					fileReader.responseText,
					function(result) {
						expect(result.names.indexOf('Phosphatidylcholine alkenyl 16:0-16:0')).toBeGreaterThan(-1);
						expect(result.meta.length).toBeGreaterThan(0);
						expect(result.spectrum).toBeDefined();

						var annotations = result.meta.filter(function(x) { return ('category' in x) && x.category == 'annotation'; });
						expect(annotations.length).toBeGreaterThan(0);
					}
				);
			};
			fileReader.send();
		}));

		it('should parse scientific notation', inject(function (gwMassbankService) {
			var fileReader = new XMLHttpRequest();
			fileReader.open('GET', '/base/test_data/FU000020.txt', false);
			fileReader.onreadystatechange = function() {
				gwMassbankService.convertWithCallback(
					fileReader.responseText,
					function(result) {
						expect(result.names.indexOf('6-Man4GlcNAc-II')).toBeGreaterThan(-1);
						expect(result.names.indexOf('Man-alpha-1-2Man-alpha-1-3Man-alpha-1-6Man-beta-1-5GlcNAc')).toBeGreaterThan(-1);
						expect(result.meta.length).toBeGreaterThan(0);
						expect(result.spectrum).toBeDefined();

						expect(result.spectrum).toMatch(/^((\d+\.?\d*):(\d+\.?\d*)\s?)+$/);
					}
				);
			};
			fileReader.send();
		}));
	})
});