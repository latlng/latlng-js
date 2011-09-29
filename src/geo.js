/*
*  Geodesy representation conversion functions (c) Chris Veness 2002 - 2010
*   - www.movable - type.co.uk/scripts/latlong.html
*
*  Sample usage:
*    var lat = Geo.parseDMS('51° 28′ 40.12″ N');
*    var lon = Geo.parseDMS('000° 00′ 05.31″ W');
*    var p1 = new LatLon(lat, lon);
*/

var Geo;  // Geo namespace, representing static class
if (Geo === undefined) { Geo = {}; }

/* ----------------------------------------------- */

// ---- extend Number object with methods for converting degrees/radians

/** Converts numeric degrees to radians
*/
if (typeof (Number.prototype.toRad) === 'undefined') {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  };
}

/** Converts radians to numeric (signed) degrees
*/
if (typeof (Number.prototype.toDeg) === 'undefined') {
  Number.prototype.toDeg = function () {
    return this * 180 / Math.PI;
  };
}

/**
 * Formats the significant digits of a number, using only fixed-point notation
 * (no exponential)
 *
 * @param   {Number} precision Number of significant digits to appear in the
 * returned string.
 * @return {String} A string representation of number which contains precision
 * significant digits.
*/
if (typeof (Number.prototype.toPrecisionFixed) === 'undefined') {
  /*jslint plusplus: true */
  Number.prototype.toPrecisionFixed = function (precision) {
    var l, n, numb, sign, scale;
    if (isNaN(this)) { return 'NaN'; }
    numb = this < 0 ? -this : this;  // can't take log of -ve number...
    sign = this < 0 ? '-' : '';

    // can't take log of zero, just format with precision zeros
    if (numb === 0) {
      n = '0.';
      while (precision--) { n += '0'; }
      return n;
    }

    // no of digits before decimal
    scale = Math.ceil(Math.log(numb) * Math.LOG10E);
    n = String(Math.round(numb * Math.pow(10, precision - scale)));
    if (scale > 0) {  // add trailing zeros & insert decimal as required
      l = scale - n.length;
      while (l-- > 0) { n = n + '0'; }
      if (scale < n.length) {
        n = n.slice(0, scale) + '.' + n.slice(scale);
      }
    } else { // prefix decimal and leading zeros if required
      while (scale++ < 0) { n = '0' + n; }
      n = '0.' + n;
    }
    return sign + n;
  };
}

/** Trims whitespace from string
 * (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript)
*/
if (typeof (String.prototype.trim) === 'undefined') {
  String.prototype.trim = function () {
    return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
}


/* ----------------------------------------------- */
