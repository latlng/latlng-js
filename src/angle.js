/*jslint vars: true, white: true */

var Geo;
if (Geo === undefined) { Geo = {}; }

(function () {
  // dms format functions.
  var formats;

  function round(value, dp) {
    var x = Math.pow(10, dp);
    return Math.round(value * x) / x;
  }

  function roundTo(value, x) {
    if (x === undefined || x <= 0) { x = 1; }
    return Math.round(value / x) * x;
  }

  function toDegrees(radians) {
    return Math.round((radians * 180 / Math.PI) * 10e11) / 10e11;
  }

  function toRadians(degrees) {
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

  function toDMS(deg, style, dp, format) {
    var a, b;
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

  function toLat(deg, style, dp) { // normalize degrees to -90º..90º
    deg = Number(deg) % 360;
    if(deg > 180) { deg = 180 - deg; }
    if(deg < -180) { deg = -(180 + deg); }
    if(deg > 90) { deg = -(deg - 90) + 90; }
    if(deg < -90) { deg = -(deg + 90) - 90; }
    return toDMS(deg, style, dp, formats.lat);
  }

  function toLon(deg, style, dp) { // normalize degrees to -180º..180º
    deg = Number(deg) % 360;
    if(deg > 180) { deg = deg - 360; }
    if(deg < -180) { deg = deg + 360; }
    return toDMS(deg, style, dp, formats.lon);
  }

  function toBrng(deg, style, dp) { // normalise degrees to 0º..360º
    deg = Number(deg) % 360;
    if (deg < 0) { deg = deg + 360; }
    return toDMS(deg, style, dp);
  }

  function Angle (radians) {
    if (typeof radians === 'number') {
      this.r = radians;
    } else if (typeof radians === 'string') {
      this.r = Number(radians);
    } else {
      this.r = NaN;
    }
  }

  Angle.fromDegrees = function (degrees) {
    if (typeof degrees === 'string') {
      degrees = parseDMS(degrees);
    }
    if (typeof degrees !== 'number') {
      degrees = Number(degrees);
    }
    if (isNaN(degrees)) {
      return new Angle(NaN);
    } else {
      return new Angle(toRadians(degrees));
    }
  };

  Angle.rad = function (arg) {
    var rad, deg;
    if (typeof arg === 'number') {
      return arg;
    } else if (typeof arg === 'string') {
      return toRadians(parseDMS(arg));
    } else if (typeof arg === 'object') {
      if (arg instanceof Angle) {
        return arg.r;
      }
    }
    return NaN;
  }

  Angle.prototype.radians = function () {
    return this.r;
  };
  Angle.prototype.rad = Angle.prototype.radians;

  Angle.prototype.degrees = function () {
    return toDegrees(this.r);
  };
  Angle.prototype.deg = Angle.prototype.degrees;

  Angle.prototype.valueOf = function () {
    return this.r;
  };

  Angle.prototype.toString = function () {
    return toDMS(this.degrees());
  };

  Angle.prototype.toDMS = function (style, dp, format) {
    return toDMS(this.degrees(), style, dp, format);
  };

  Angle.prototype.toLat = function (style, dp) {
    return toLat(this.degrees(), style, dp);
  };

  Angle.prototype.toLon = function (style, dp) {
    return toLon(this.degrees(), style, dp);
  };

  Angle.prototype.toBrng = function (style, dp) {
    return toBrng(this.degrees(), style, dp);
  };


  // make functions available as class methods.
  Angle.round = round;
  Angle.roundTo = roundTo;
  Angle.toDegrees = toDegrees;
  Angle.toRadians = toRadians;
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
  Angle.Angle  = Angle ;
  Geo.Angle = Angle;
}());


