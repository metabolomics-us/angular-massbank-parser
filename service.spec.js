/**
 * Created by Gert on 6/16/2014.
 */
describe('MassbankService test', function () {

	describe('when I call gwMspService.convert', function () {
		beforeEach(module('massbank.parser'));


		it('should return an empty array if no data is given', inject(function (gwMspService) {

			expect(gwMspService.convertToArray()).toEqual([]);
		}));

		it('should return one spectra for the given test file with 1 spectra in it', inject(function (gwMspService) {

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

			var result = gwMspService.convertToArray(data);

			expect(result.length).toEqual(1);

			console.log(result[0].name);
			expect(result[0].name).toEqual('glutamate');
			expect(result[0].meta);
		}));

		it('should return 3 spectra for the given object with 3 defined spectra', inject(function (gwMspService) {
			var data =
				"Name: 1,3-diaminopropane_RI 546361" +
				"Synon: ##chromatogram=060112bylcs11 \n" +
				"CASNO: 109762 \n" +
				"ID: 1361 \n" +
				"Comment: fiehn \n" +
				"Num peaks: 86 \n" +
				"85   24;  86  922;  87   90;  88   41;  89    4; \n" +
				"97    1;  98   22;  99   17; 100  454; 101   73; \n" +
				"102   61; 103   17; 104    4; 105    1; 110    1; \n" +
				"111    1; 112   30; 113   32; 114   59; 115   34; \n" +
				"116   72; 117   65; 118   13; 119    4; 125    1; \n" +
				"126    9; 127    5; 128   99; 129   37; 130  320; \n" +
				"131   85; 132   45; 133    7; 134    2; 140    1; \n" +
				"141    1; 142    7; 143    4; 144   24; 145    7; \n" +
				"146   65; 147   10; 148    4; 156    7; 157    3; \n" +
				"158   34; 159    6; 160  395; 161   69; 162   31; \n" +
				"163    3; 170   20; 171   12; 172  571; 173  109; \n" +
				"174  999; 175  177; 176   78; 177    9; 178    1; \n" +
				"184    3; 185    9; 186  172; 187   37; 188   31; \n" +
				"189    6; 190    4; 191    1; 192    1; 199    2; \n" +
				"200    5; 201  338; 202   74; 203   31; 204    5; \n" +
				"205    1; 215    1; 217    1; 218    1; 243    1; \n" +
				"259   18; 260    5; 261    2; 273    1; 287    1; \n" +
				"347    1; \n" +
				"\n" +
				"Name: 2-deoxyuridine_RI 8308728 \n" +
				"Synon: ##chromatogram=051108bylcs20 \n" +
				"CASNO: 951780 \n" +
				"ID: 1362 \n" +
				"Comment: fiehn \n" +
				"Num peaks: 122 \n" +
				"85   25;  86    6;  87   15;  88    5;  89   27; \n" +
				"90    3;  91    4;  92    2;  93    2;  94    4; \n" +
				"95   14;  96   37;  97   11;  98    7;  99   59; \n" +
				"100   18; 101  105; 102   13; 103  999; 104   95; \n" +
				"105   45; 106    3; 107    1; 108    9; 109    3; \n" +
				"110    1; 111   25; 112   21; 113   33; 114    6; \n" +
				"115   21; 116   14; 117  184; 118   19; 119   13; \n" +
				"120    2; 121    1; 122    2; 123    1; 124    6; \n" +
				"125   11; 126    7; 127   23; 128    5; 129  134; \n" +
				"130   16; 131   31; 132    3; 133   62; 134    8; \n" +
				"135    6; 136    3; 137    1; 138    1; 139    2; \n" +
				"140    2; 141    6; 142   11; 143   25; 144    3; \n" +
				"145   67; 146    7; 147   80; 148   12; 149   11; \n" +
				"150    3; 151    6; 152    1; 153    1; 154    2; \n" +
				"155   77; 156   11; 157   31; 158    4; 159    3; \n" +
				"163    2; 167    1; 168    3; 169   66; 170   47; \n" +
				"171  189; 172   29; 173   12; 174    2; 175    2; \n" +
				"177    2; 183    2; 184    9; 185    6; 186    1; \n" +
				"187    1; 189   16; 190    2; 191    2; 192    4; \n" +
				"193    1; 195    5; 196    2; 197    1; 204    1; \n" +
				"211   14; 212    2; 215    1; 217   13; 218    2; \n" +
				"219    2; 229    2; 231    1; 239    1; 240    1; \n" +
				"242    2; 243    1; 245    4; 246    1; 249    2; \n" +
				"261   24; 262    5; 263    2; 264    1; 267    3; \n" +
				"282    1; 327    1; \n" +
				"\n" +
				"Name: cytosin_RI 486112 \n" +
				"Synon: ##chromatogram=060118bylcs10 \n" +
				"CASNO: 71307 \n" +
				"ID: 1363 \n" +
				"Comment: fiehn \n" +
				"Num peaks: 135 \n" +
				"85   62;  86  126;  88   13;  89    4;  90    1; \n" +
				"91   14;  92    6;  93   11;  94   22;  95   83; \n" +
				"96   32;  97   74;  98  999;  99  170; 100  539; \n" +
				"101  115; 102   39; 103   16; 104    4; 105   29; \n" +
				"106    3; 107    2; 108    3; 109   23; 110   20; \n" +
				"111   21; 112   43; 113  105; 114   80; 115   31; \n" +
				"116   37; 117   17; 118    5; 119    2; 120   13; \n" +
				"121    2; 122    2; 123   36; 124   26; 125  257; \n" +
				"126   41; 127   31; 128   11; 129    4; 130  132; \n" +
				"131   66; 132   37; 133   18; 134    5; 135    1; \n" +
				"136    6; 137    3; 138   12; 139   18; 140   22; \n" +
				"141   14; 142    7; 143    3; 144    2; 145    1; \n" +
				"146  115; 147  234; 148   44; 149   18; 150   51; \n" +
				"151    8; 152   30; 153    7; 154    9; 155   17; \n" +
				"156   39; 157   27; 158   11; 159    3; 160    1; \n" +
				"164    3; 165    1; 166   12; 167   13; 168   83; \n" +
				"169   14; 170  447; 171   91; 172   44; 173    8; \n" +
				"174    2; 180    3; 181    7; 182   59; 183   18; \n" +
				"184   17; 185    3; 186    2; 194    2; 195    2; \n" +
				"196    2; 197   38; 198   12; 199    6; 200    2; \n" +
				"208    1; 209    1; 210    9; 211    4; 212    3; \n" +
				"213   10; 214    2; 215    1; 222    1; 224   26; \n" +
				"225    6; 226    3; 227    1; 237    2; 238  149; \n" +
				"239   41; 240  710; 241  154; 242   63; 243    9; \n" +
				"244    2; 245    1; 246    1; 247    1; 248    1; \n" +
				"249    1; 250    1; 252    1; 253    4; 254  776; \n" +
				"255  349; 256  111; 257   27; 258    4; 259    1; \n";

			var result = gwMspService.convertToArray(data);

			console.log(result);
			expect(result.length).toEqual(3);
			expect(result[0].name).toEqual('1,3-diaminopropane');
			expect(result[1].name).toEqual('2-deoxyuridine');
			expect(result[2].name).toEqual('cytosin');


		}))
	})

});