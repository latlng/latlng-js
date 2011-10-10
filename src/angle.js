/*jslint vars: true, white: true */

var Geo;
if (Geo === undefined) { Geo = {}; }

(function () {
  // dms format functions.
  var Angle = {}, formats, PI = Math.PI, PI2 = PI * 2, PIhalf = PI / 2;

  function round(value, dp) {
    return Number(value.toFixed(dp));
  }

  function toDeg(radians) {
    return round(radians * 180 / Math.PI, 12);
  }

  function toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function parseDMS(dmsStr) {
    var deg, dms = [], i, dmsx, dstr, d = 0, m = 0, s = 0, match;
    // check for signed decimal degrees without NSEW, if so return it directly
    if (typeof dmsStr === 'number') { return dmsStr; }

    dmsStr = String(dmsStr).trim(); // remove extra whitespace
    dmsx = dmsStr.split(/[^0-9.,]+/); // split out numbers
    for (i = 0; i < dmsx.length; i += 1) { // eliminate empty elements
      dstr = dmsx[i];
      if (dstr !== '') { dms.push(dstr); }
    }
    switch (dms.length) { // determine how to interpret dmsStr
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
    deg = d + m / 60 + s / 3600; // convert to decimal degrees
    if (/^-/.test(dmsStr)) { deg = -deg; } // take '-' as -ve
    if (/[WSws]$/.test(dmsStr)) { deg = -deg; } // take west and south as -ve
    return deg;
  }

  Angle.rad = function (arg) { // ensure radian units. 
    if (typeof arg === 'number') {
      return arg; // already a number, assume radians.
    } else {
      return toRad(parseDMS(arg)); // not a number, assume degrees in a string
    }
  };

  Angle.deg = function (degrees) { // units are degrees, convert to radians
    if (typeof degrees === 'string') { // convert degree string
      degrees = parseDMS(degrees);
    }
    if (typeof degrees !== 'number') {
      degrees = Number(degrees);
    }
    return toRad(degrees);
  };


  function toDMS(rad, style, dp, format) {
    var a, b, deg = toDeg(rad);
    // give up here if we can't make a number from deg
    if (isNaN(deg)) { return 'NaN';  }
    format = format || formats.dms;
    // format is a callback
    switch (style) {
    case 'd':
      if (dp === undefined) { dp = 4; }
      b = round(deg, dp) % 360;
      a = Math.abs(b);
      return format(b < 0, dp, a);
    case 'dm':
      if (dp === undefined) { dp = 2; }
      b = round(deg * 60, dp) % (60 * 360);
      a = Math.abs(b);
      return format(b < 0, dp, a / 60, a % 60);
    default: // 'style'
      if (dp === undefined) { dp = 0; }
      b = round(deg * 3600, dp) % (3600 * 360);
      a = Math.abs(b);
      return format(b < 0, dp, a / 3600, a / 60 % 60, a % 60);
    }
  }

  formats = (function () { // formats callbacks for toDMS
    function dms(neg, dp, d, m, s) {
      var string;
      if ( m === undefined ) {
        string = d.toFixed(dp) + '\u00B0';
      } else {
        string = Math.floor(d) + '\u00B0';
        if ( s === undefined ) {
          string += m.toFixed(dp) + '\u2032';
        } else {
          string += Math.floor(m) + '\u2032' + s.toFixed(dp) + '\u2033';
        }
      }
      return string;
    }
    function signed(neg, dp, d, m, s) {
      return ( neg ? '-' : '' ) + dms(neg, dp, d, m, s);
    }
    function lat(neg, dp, d, m, s) {
      return dms(neg, dp, d, m, s) + ( neg ? 'S' : 'N' );
    }
    function lon(neg, dp, d, m, s) {
      return dms(neg, dp, d, m, s) + ( neg ? 'W' : 'E' );
    }
    return { dms: dms, signed: signed, lat: lat, lon: lon };
  }());

  function toLat(rad, style, dp) { // normalize radians to -PI/2º..PI/2º
    rad = Number(rad) % PI2;
    if(rad > PI) { rad = PI - rad; }
    if(rad < -PI) { rad = -(PI + rad); }
    if(rad > PIhalf) { rad = -(rad - PIhalf) + PIhalf; }
    if(rad < -PIhalf) { rad = -(rad + PIhalf) - PIhalf; }
    return toDMS(rad, style, dp, formats.lat);
  }

  function toLon(rad, style, dp) { // normalize radians to -PIº..PIº
    rad = Number(rad) % PI2;
    if(rad > PI) { rad = rad - PI2; }
    if(rad < -PI) { rad = rad + PI2; }
    return toDMS(rad, style, dp, formats.lon);
  }

  function toBrng(rad, style, dp) { // normalise radians to 0º..PI2º
    rad = Number(rad) % PI2;
    if (rad < 0) { rad = rad + PI2; }
    return toDMS(rad, style, dp, formats.dms);
  }

  // make functions available as class methods.
  Angle.round = round;
  Angle.toDeg = toDeg;
  Angle.toRad = toRad;
  Angle.parseDMS = parseDMS;
  Angle.toDMS = toDMS;
  Angle.toDMS.formats = formats;
  Angle.toDMS.format = formats.dms;
  Angle.toLat = toLat;
  Angle.toLat.format = formats.lat;
  Angle.toLon = toLon;
  Angle.toLon.format = formats.lon;
  Angle.toBrng = toBrng;
  Angle.toBrng.format = formats.dms;
  Geo.Angle = Angle;
}());


