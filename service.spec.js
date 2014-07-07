/**
 * Created by Gert on 6/16/2014.
 */
describe('MassbankService test', function () {
	describe('when I call massbankService.convert', function () {
		beforeEach(module('massbank.parser'));


		it('should return an empty array if no data is given', inject(function (massbankService) {
			expect(massbankService.convertToArray()).toEqual([]);
		}));

		it('should return one spectra for the given test file with 1 spectra in it', inject(function (massbankService) {

			var data =
				"ACCESSION: MCH00011\n"+
				"RECORD_TITLE: 3-Hydroxypicolinic acid; MALDI-TOF; MS; Pos\n"+
				"DATE: 2011.05.11 (Created 2010.10.06)\n"+
				"AUTHORS: Wada Y, Osaka Medical Center for Maternal and Child Health\n"+
				"LICENSE: CC BY-SA\n"+
				"COMMENT: Profile spectrum of this record is given as a JPEG file.\n"+
				"COMMENT: [Profile] MCH00011.jpg\n"+
				"CH$NAME: 3-Hydroxypicolinic acid\n"+
				"CH$NAME: HPA\n"+
				"CH$COMPOUND_CLASS: Non-Natural Product\n"+
				"CH$FORMULA: C6H5NO3\n"+
				"CH$EXACT_MASS: 139.02694\n"+
				"CH$SMILES: OC(=O)c(n1)c(O)ccc1\n"+
				"CH$IUPAC: InChI=1S/C6H5NO3/c8-4-2-1-3-7-5(4)6(9)10/h1-3,8H,(H,9,10)\n"+
				"AC$INSTRUMENT: Voyager DE-PRO, Applied Biosystems\n"+
				"AC$INSTRUMENT_TYPE: MALDI-TOF\n"+
				"AC$MASS_SPECTROMETRY: MS_TYPE MS\n"+
				"AC$MASS_SPECTROMETRY: ION_MODE POSITIVE\n"+
				"AC$MASS_SPECTROMETRY: LASER UV 337 nm nitrogen lazer, 20 Hz, 10 nsec\n"+
				"AC$MASS_SPECTROMETRY: SAMPLE_DRIPPING saturated\n"+
				"AC$CHROMATOGRAPHY: SOLVENT 50% acetonitrile\n"+
				"PK$ANNOTATION: m/z ion\n"+
				"  279.06 [2M+H]+\n"+
				"  235.08 [2M+H-CO2]+\n"+
				"  189.07 [2M-H-2CO2]+\n"+
				"  140.03 [M+H]+\n"+
				"  96.03 [M+H-CO2]+\n"+
				"PK$NUM_PEAK: 45\n"+
				"PK$PEAK: m/z int. rel.int.\n"+
				"  28.045878 2778 58\n"+
				"  39.068303 3032 64\n"+
				"  39.158162 2209 46\n"+
				"  41.095535 1182 25\n"+
				"  52.077305 1392 29\n"+
				"  54.071885 1343 28\n"+
				"  66.122635 1193 25\n"+
				"  78.093368 1711 36\n"+
				"  94.085812 7826 164\n"+
				"  94.180481 3417 72\n"+
				"  94.297835 1015 21\n"+
				"  96.028096 43387 910\n"+
				"  96.119134 25360 532\n"+
				"  97.034549 3570 75\n"+
				"  122.077371 5939 125\n"+
				"  122.18124 985 21\n"+
				"  123.504211 2266 48\n"+
				"  140.030702 47607 999\n"+
				"  140.1195 9670 203\n"+
				"  141.037818 4117 86\n"+
				"  162.026142 4576 96\n"+
				"  184.029187 1148 24\n"+
				"  189.072202 18218 382\n"+
				"  190.081251 3697 78\n"+
				"  191.090535 2102 44\n"+
				"  217.094751 2754 58\n"+
				"  218.310509 2114 44\n"+
				"  233.072279 12496 262\n"+
				"  234.07775 10050 211\n"+
				"  235.078981 39917 838\n"+
				"  236.084972 6317 133\n"+
				"  237.08854 1422 30\n"+
				"  261.075531 1425 30\n"+
				"  279.06116 4570 96\n"+
				"  282.121419 1355 28\n"+
				"  283.128133 969 20\n"+
				"  284.130046 2572 54\n"+
				"  288.337855 2014 42\n"+
				"  301.076328 1306 27\n"+
				"  316.38401 1524 32\n"+
				"  327.126319 1147 24\n"+
				"  328.115663 4109 86\n"+
				"  329.13529 957 20\n"+
				"  372.108967 1578 33\n"+
				"  484.103183 1215 25\n"+
				"//\n";

			var result = massbankService.convertToArray(data);

			expect(result.length === 1);
			expect('3-Hydroxypicolinic acid' in result[0].names);
			expect('HPA' in result[0].names);
			expect(result[0].meta);
		}));
	})
});