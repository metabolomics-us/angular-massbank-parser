export default class GwMassBankService {
    private static $inject;
    private $log;
    private $filter;
    constructor($log: any, $filter: any);
    /**
     * Converts the data using a callback
     * Follows the MassBank Record Format v2.09
     * http://www.massbank.jp/manuals/MassBankRecord_en.pdf
     * @param data
     * @param callback
     */
    convertWithCallback: (data: any, callback: any) => void;
    /**
     * converts the data using a callback
     * @param data
     * @param callback
     */
    convertFromData: (data: any, callback: any) => void;
    /**
     * counts the number of mass spectra in this library file
     * @param data
     * @returns {number}
     */
    countSpectra: (data: any) => number;
}
