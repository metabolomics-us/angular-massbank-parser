/**
 * Created by Gert on 6/16/2014.
 */
describe('MassbankService test', function () {
	describe('when I call massbankService.convert', function () {
		beforeEach(module('wohlgemuth.massbank.parser'));
		
		it('should return one spectra for the given test file with 1 spectra in it', inject(function (gwMassbankService) {
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

			var result = null;
			gwMassbankService.convertWithCallback(data, function(x) {result = x;});

			expect('3-Hydroxypicolinic acid' in result.names);
			expect('HPA' in result.names);
			expect(result.meta);
		}));

		it('should return one spectra for the given test file with 1 spectra in it', inject(function (gwMassbankService) {
			var data =
				"ACCESSION: FU000020\n"+
				"RECORD_TITLE: 6-Man4GlcNAc-II; LC-ESI-QQ; MS2; CE:30V; Amide\n"+
				"DATE: 2011.05.06 (Created 2009.02.18)\n"+
				"AUTHORS: Matsuura F, Ohta M, Kittaka M, Faculty of Life Science and Biotechnology, Fukuyama University\n"+
				"LICENSE: CC BY-SA\n"+
				"CH$NAME: 6-Man4GlcNAc-II\n"+
				"CH$NAME: Man-alpha-1-2Man-alpha-1-3Man-alpha-1-6Man-beta-1-5GlcNAc\n"+
				"CH$COMPOUND_CLASS: Natural Product; Oligosaccharide; N-linked glycan; High-mannose type\n"+
				"CH$FORMULA: C32H55NO26\n"+
				"CH$EXACT_MASS: 869.30123\n"+
				"CH$SMILES: OC(C4O)C(OC(C4OC(O5)C(O)C(C(O)C(CO)5)O)OC(C1O)C(C(CO)OC1OCC(O2)C(O)C(C(O)C(OC(C3O)C(OC(C3NC(C)=O)O)CO)2)O)O)CO\n"+
				"CH$IUPAC: InChI=1/C32H55NO26/c1-7(38)33-13-18(43)25(11(5-37)52-28(13)50)57-31-23(48)20(45)16(41)12(56-31)6-51-29-24(49)26(17(42)10(4-36)53-29)58-32-27(21(46)15(40)9(3-35)55-32)59-30-22(47)19(44)14(39)8(2-34)54-30/h8-32,34-37,39-50H,2-6H2,1H3,(H,33,38)/t8-,9-,10-,11-,12-,13-,14-,15-,16-,17-,18-,19+,20+,21+,22+,23+,24+,25-,26+,27+,28-,29+,30-,31+,32-/m1/s1/f/h33H\n"+
				"CH$LINK: CHEMSPIDER 24606100\n"+
				"CH$LINK: KEGG G06977\n"+
				"CH$LINK: OligosaccharideDataBase man 540900\n"+
				"CH$LINK: OligosaccharideDataBase2D map2 ODS=0.55 Amide=4.62\n"+
				"AC$INSTRUMENT: 2695 HPLC Quadro Micro API, Waters\n"+
				"AC$INSTRUMENT_TYPE: LC-ESI-QQ\n"+
				"AC$MASS_SPECTROMETRY: MS_TYPE MS2\n"+
				"AC$MASS_SPECTROMETRY: ION_MODE POSITIVE\n"+
				"AC$MASS_SPECTROMETRY: COLLISION_ENERGY 30.0 V\n"+
				"AC$MASS_SPECTROMETRY: DATAFORMAT Centroid\n"+
				"AC$MASS_SPECTROMETRY: DESOLVATION_GAS_FLOW 897 L/Hr\n"+
				"AC$MASS_SPECTROMETRY: DESOLVATION_TEMPERATURE 399 C\n"+
				"AC$MASS_SPECTROMETRY: FRAGMENTATION_METHOD LOW-ENERGY CID\n"+
				"AC$MASS_SPECTROMETRY: IONIZATION ESI\n"+
				"AC$MASS_SPECTROMETRY: SCANNING 1 amu/sec (m/z = 20-2040)\n"+
				"AC$MASS_SPECTROMETRY: SOURCE_TEMPERATURE 101C\n"+
				"AC$CHROMATOGRAPHY: COLUMN_NAME TSK-GEL Amide-80 2.0 mm X 250 mm (TOSOH)\n"+
				"AC$CHROMATOGRAPHY: COLUMN_TEMPERATURE 40 C\n"+
				"AC$CHROMATOGRAPHY: FLOW_GRADIENT 74/26 at 0 min, 50/50 at 60 min.\n"+
				"AC$CHROMATOGRAPHY: FLOW_RATE 0.2 ml/min\n"+
				"AC$CHROMATOGRAPHY: RETENTION_TIME 14.817 min\n"+
				"AC$CHROMATOGRAPHY: SAMPLING_CONE 43.10 V\n"+
				"AC$CHROMATOGRAPHY: SOLVENT CH3CN/H2O\n"+
				"MS$FOCUSED_ION: DERIVATIVE_FORM C41H66N2O27\n"+
				"MS$FOCUSED_ION: DERIVATIVE_MASS 1018.38529\n"+
				"MS$FOCUSED_ION: DERIVATIVE_TYPE ABEE (p-Aminobenzoic acid ethyl ester)\n"+
				"MS$FOCUSED_ION: PRECURSOR_M/Z 1019.30\n"+
				"MS$FOCUSED_ION: PRECURSOR_TYPE [M+H]+\n"+
				"PK$NUM_PEAK: 16\n"+
				"PK$PEAK: m/z int. rel.int.\n"+
				"  325.0 1.311e3 71\n"+
				"  370.5 6.947e3 376\n"+
				"  371.2 1.442e4 780\n"+
				"  372.1 2.190e3 118\n"+
				"  486.5 7.160e2 39\n"+
				"  487.3 8.940e2 48\n"+
				"  532.1 5.211e3 282\n"+
				"  533.0 1.848e4 999\n"+
				"  533.7 5.393e3 292\n"+
				"  534.4 1.241e3 67\n"+
				"  694.1 1.324e3 72\n"+
				"  694.9 1.866e3 101\n"+
				"  695.8 1.932e3 104\n"+
				"  856.0 6.540e2 35\n"+
				"  856.9 5.820e2 31\n"+
				"  1019.4 1.615e3 87\n"+
				"//";

			var result = null;
			gwMassbankService.convertWithCallback(data, function(x) {result = x;});

			expect('6-Man4GlcNAc-II' in result.names);
			expect('Man-alpha-1-2Man-alpha-1-3Man-alpha-1-6Man-beta-1-5GlcNAc' in result.names);
			expect(result.meta);
		}));
	})
});