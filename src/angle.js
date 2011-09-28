/*jslint vars: true, white: true */
/*global Geo */

(function () {

/**
 * Parses string representing degrees/minutes/seconds into numeric degrees
 *
 * This is very flexible on formats, allowing signed decimal degrees, or
 * deg - min - sec optionally suffixed by compass direction (NSEW). A variety of
 * separators are accepted (eg 3º 37' 09"W) or fixed - width format without
 * separators (eg 0033709W). Seconds and minutes may be omitted.
 * (Note minimal validation is done).
 *
 * @param   {String|Number} dmsStr: Degrees or deg/min/sec in variety of formats
 * @returns {Number} Degrees as decimal number
 * @throws  {TypeError} dmsStr is an object, perhaps DOM object without .value?
 */
  function parseDMS(dmsStr) {
    var deg, dms = [], i, dmsx, dstr, d = 0, m = 0, s = 0, match;
    if (typeof dmsStr === 'object') {
      throw new TypeError('Geo.parseDMS - dmsStr is [DOM?] object');
    }

    // check for signed decimal degrees without NSEW, if so return it directly
    if (typeof dmsStr === 'number' && isFinite(dmsStr)) {
      return Number(dmsStr);
    }

    // trim off extra white space before and after.
    dmsStr = String(dmsStr).trim();

    // strip off any sign or compass dir'n & split out separate d/m/s
    dmsx = dmsStr.replace(/^-/, '').replace(/[NSEWnsew]$/, '').
      split(/[^0-9.,]+/);

    // eliminate any empty elements from dmsx
    for (i = 0; i < dmsx.length; i += 1) {
      dstr = dmsx[i];
      if (dstr !== '') {
        dms.push(dstr);
      }
    }

    // and convert to decimal degrees...
    switch (dms.length) {
    case 3:  // interpret 3 - part result as d/m/s
      d = Number(dms[0]);
      m = Number(dms[1]);
      s = Number(dms[2]);
      break;
    case 2:  // interpret 2 - part result as d/m
      d = Number(dms[0]);
      m = Number(dms[1]);
      break;
    case 1:  // just d (possibly decimal) or non - separated dddmmss
      dstr = dms[0];
      // check for fixed - width unseparated format eg 0033709W
      match = /^(\d{2,3})(\d{2})(\d{2})$/.exec(dstr);
      if (match) {
        d = Number(match[1]);
        m = Number(match[2]);
        s = Number(match[3]);
      } else {
        match = /^(\d{2,3})(\d{2})$/.exec(dstr);
        if (match) {
          d = Number(match[1]);
          m = Number(match[2]);
        } else {
          d = Number(dstr);
        }
      }
      break;
    default:
      return NaN;
    }
    deg = d + m / 60 + s / 3600;
    if (/^-/.test(dmsStr)) {
      deg = -deg; // take '-' as -ve
    }
    if (/[WSws]$/.test(dmsStr)) {
      deg = -deg; // take west and south as -ve
    }
    return deg;
  };

  function Angle (degrees) {
    if (typeof degrees === 'string') {
      degrees = parseDMS(degrees);
    }
    if (typeof degrees !== 'number') {
      degrees = Number(degrees);
    }
    if (isNaN(degrees)) {
      this.radians = 0;
    } else {
      this.radians = degrees * Math.PI / 180;
    }
  }

  Angle.parseDMS = parseDMS;
  Geo.Angle = Angle;

  /**
   * Convert decimal degrees to deg/min/sec format
   *  - degree, prime, double - prime symbols are added, but sign is discarded,
   *  though no compass direction is added
   *
   * @private
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for
   *                               dms, 2 for dm, 4 for d
   * @returns {String} deg formatted as deg/min/secs according to specified format
   * @throws  {TypeError} deg is an object, perhaps DOM object without .value?
   */

  Geo.toDMS = function (deg, format, dp) {
    var d, m, s, sec, dms, min;
    if (typeof deg === 'object') {
      throw new TypeError('Geo.toDMS - deg is [DOM?] object');
    }
    if (isNaN(deg)) {
      return 'NaN';  // give up here if we can't make a number from deg
    }

    // default values
    if (typeof format === 'undefined') {
      format = 'dms';
    }

    if (typeof dp === 'undefined') {
      switch (format) {
      case 'd': dp = 4; break;
      case 'dm': dp = 2; break;
      case 'dms': dp = 0; break;
      default: format = 'dms'; dp = 0;  // be forgiving on invalid format
      }
    }

    deg = Math.abs(deg);  // (unsigned result ready for appending compass dir'n)

    switch (format) {
    case 'd':
      d = deg.toFixed(dp);     // round degrees
      if (d < 100) { d = '0' + d; }  // pad with leading zeros
      if (d < 10) { d = '0' + d; }
      dms = d + '\u00B0';      // add º symbol
      break;
    case 'dm':
      min = (deg * 60).toFixed(dp);  // convert degrees to minutes & round
      d = Math.floor(min / 60);    // get component deg/min
      m = (min % 60).toFixed(dp);  // pad with trailing zeros
      if (d < 100) { d = '0' + d; }         // pad with leading zeros
      if (d < 10) { d = '0' + d; }
      if (m < 10) { m = '0' + m; }
      dms = d + '\u00B0' + m + '\u2032';  // add º, ' symbols
      break;
    case 'dms':
      sec = (deg * 3600).toFixed(dp);  // convert degrees to seconds & round
      d = Math.floor(sec / 3600);    // get component deg/min/sec
      m = Math.floor(sec / 60) % 60;
      s = (sec % 60).toFixed(dp);    // pad with trailing zeros
      if (d < 100) { d = '0' + d; }           // pad with leading zeros
      if (d < 10) { d = '0' + d; }
      if (m < 10) { m = '0' + m; }
      if (s < 10) { s = '0' + s; }
      dms = d + '\u00B0' + m + '\u2032' + s + '\u2033';  // add º, ', " symbols
      break;
    }

    return dms;
  };

  /**
   * Convert numeric degrees to deg/min/sec latitude (suffixed with N/S)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for
   *                               dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toLat = function (deg, format, dp) {
    var lat = Geo.toDMS(deg, format, dp);
    return lat === '' ? '' : lat.slice(1) + (deg < 0 ? 'S' : 'N');
    // knock off initial '0' for lat!
  };

  /**
   * Convert numeric degrees to deg/min/sec longitude (suffixed with E/W)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for
   *                               dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toLon = function (deg, format, dp) {
    var lon = Geo.toDMS(deg, format, dp);
    return lon === '' ? '' : lon + (deg < 0 ? 'W' : 'E');
  };

  /**
   * Convert numeric degrees to deg/min/sec as a bearing (0º..360º)
   *
   * @param   {Number} deg: Degrees
   * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
   * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for
   *                               dms, 2 for dm, 4 for d
   * @returns {String} Deg/min/seconds
   */
  Geo.toBrng = function (deg, format, dp) {
    deg = Number(deg) % 360;
    // normalise -ve values to 180º..360º
    if (deg < 0) { deg = deg + 360; }
    var brng =  Geo.toDMS(deg, format, dp);
    // just in case rounding took us up to 360º!
    return brng.replace('360', '000');
  };


  Angle.prototype.degrees = function () {
    return this.radians * 180 / Math.PI;
  };

}());


