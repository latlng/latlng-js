/*jslint vars: true, white: true */

/*
 *  Latitude/longitude spherical geodesy formulae & scripts
 *    (c) Chris Veness 2002-2010
 *   - www.movable-type.co.uk/scripts/latlong.html
 *
 *  Sample usage:
 *    var p1 = new LatLon(51.5136, -0.0983);
 *    var p2 = new LatLon(51.4778, -0.0015);
 *    var dist = p1.distanceTo(p2);          // in km
 *    var brng = p1.bearingTo(p2);           // in degrees clockwise from north
 *    ... etc
 */

var Geo;
if (Geo === undefined) { Geo = {}; }

(function () {
  var Angle = Geo.Angle,
    sin = Math.sin,
    asin = Math.asin,
    cos = Math.cos,
    atan2 = Math.atan2,
    sqrt = Math.sqrt,
    PI = Math.PI,
    PI2 = 2 * PI;

  /**
   * Creates a point on the earth's surface at the supplied latitude / longitude
   *
   * @constructor
   * @param {Number} lat  latitude in numeric degrees.
   * @param {Number} lon  longitude in numeric degrees.
   * @param {Number=} rad radius of earth if different value is required
   *                             from standard 6,371km.
  */

  function LatLon(lat, lon) {
    // only accept numbers or valid numeric strings
    if (typeof(lat) === 'number') {
      this.lat = new Angle(lat);
    } else if (lat instanceof Angle) {
      this.lat = lat;
    }
    if (typeof(lon) === 'number') {
      this.lon = new Angle(lon);
    } else if (lon instanceof Angle) {
      this.lon = lon;
    }
  }

  LatLon.fromDegrees = function(lat, lon) {
    return new LatLon(Angle.fromDegrees(lat), Angle.fromDegrees(lon));
  };

  /*
    this.radius = typeof (rad) === 'number' ? rad :
        typeof (rad) === 'string' && rad.trim() !== '' ? +rad : NaN;
  */

  /* ----------------------------------------------- */


  /**
   * Returns the latitude of this point; signed numeric degrees if no format,
   * otherwise format & dp as per Geo.toLat()
   *
   * @param   {String} [format]: Return value as 'd', 'dm', 'dms'.
   * @param   {Number} [dp=0|2|4]: No of decimal places to display.
   * @return {Number|String} Numeric degrees if no format specified, otherwise
   *                         deg/min/sec.
   *
   * requires Geo

  */
  LatLon.prototype.lat = function (format, dp) {
    if (typeof format === 'undefined') {
      return this.lat;
    }

    return Geo.toLat(this.lat, format, dp);
  };

  /**
   * Returns the longitude of this point; signed numeric degrees if no format,
   * otherwise format & dp as per Geo.toLon()
   *
   * @param   {String} [format]: Return value as 'd', 'dm', 'dms'.
   * @param   {Number} [dp=0|2|4]: No of decimal places to display.
   * @return {Number|String} Numeric degrees if no format specified, otherwise
   *          deg/min/sec.
   *
   * requires Geo

  */
  LatLon.prototype.lon = function (format, dp) {
    if (typeof format === 'undefined') {
      return this.lon;
    }

    return Geo.toLon(this.lon, format, dp);
  };

  /**
   * Returns a string representation of this point; format and dp as per
   * lat()/lon()
   *
   * @param   {String} [format]: Return value as 'd', 'dm', 'dms'.
   * @param   {Number} [dp=0|2|4]: No of decimal places to display.
   * @return {String} Comma-separated latitude/longitude.
   *
   * requires Geo

  */
  LatLon.prototype.toString = function (format, dp) {
    if (typeof format === 'undefined') { format = 'dms'; }

    if (isNaN(this.lat) || isNaN(this.lon)) { return '-,-'; }

    return Geo.toLat(this.lat, format, dp) + ', ' +
        Geo.toLon(this.lon, format, dp);
  };

  /**
   * Returns the internal angle between the supplied LatLon points
   * (using Haversine formula)
   *
   * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
   *       Sky and Telescope, vol 68, no 2, 1984
   *
   * @param  {LatLon} point Latitude/longitude of destination point.
   * @return {Angle} angle between this point and destination point.
  */
  LatLon.prototype.angleTo = function (b) {
    var lat = this.lat.r,
      bLat = b.lat.r,
      sLat = sin((bLat - lat) / 2),
      sLon = sin((b.lon.r - this.lon.r) / 2),
      theta = sLat * sLat + cos(lat) * cos(bLat) * sLon * sLon,
      radians = 2 * atan2(sqrt(theta), sqrt(1 - theta));
    return new Angle(radians);
  };

  /**
   * Returns the (initial) bearing to the supplied point
   *   see http://williams.best.vwh.net/avform.htm#Crs
   *
   * @param   {LatLon} dest destination point LatLon.
   * @return {Angle} Initial bearing from North.

  */
  LatLon.prototype.bearingTo = function (dest) {
    var lat = this.lat.r, destLat = dest.lat.r,
      dLon = dest.lon.r - this.lon.r,
      cosDestLat = cos(destLat),
      x = cos(lat) * sin(destLat) - sin(lat) * cosDestLat * cos(dLon),
      y = sin(dLon) * cosDestLat,
      brng = atan2(y, x) % ( PI2 );
    if (brng < 0) { brng = brng + PI2; }
    return new Angle(brng);
  };

  LatLon.prototype.atBearingAndAngle = function (bearing, angle) {
    var brng = ( typeof bearing === 'number' ) ? bearing : bearing.r,
      theta = ( typeof angle === 'number' ) ? angle : angle.r,
      lat = this.lat.r, lon = this.lon.r,
      clat = cos(lat), slat = sin(lat), st = sin(theta), ct = cos(theta),
      lat2 = asin(slat * ct + clat * st * cos(brng)),
      lon2 = lon + atan2(sin(brng) * st * clat, ct - slat * sin(lat2));
    // normalise to -180..+180º
    lon2 = (lon2 + 3 * PI) % (2 * PI) - PI;
    return new LatLon(lat2, lon2);
  };

  /**
   * Returns final bearing upon arriving at the destination
   * the final bearing will differ from the initial bearing by varying
   * degrees according to distance and latitude
   *
   * @param   {LatLon} dest destination LatLon.
   * @return {Number} Final bearing from North.
  */
  LatLon.prototype.finalBearingTo = function (dest) {
    var destLat = dest.lat.r, lat = this.lat.r,
      dLon = this.lon.r - dest.lon.r,
      y = sin(dLon) * cos(lat),
      x = cos(destLat) * sin(lat) - sin(destLat) * cos(lat) * cos(dLon),
      brng = (atan2(y, x) + PI) % 360;
    return new Angle(brng);
  };

  /**
   * Returns the midpoint between this point and the supplied point.
   * http://mathforum.org/library/drmath/view/51822.html
   *
   * @param   {LatLon} dest destination LatLon.
   * @return {LatLon} Midpoint between LatLon's

  */
  LatLon.prototype.midpointTo = function (dest) {
    var lat = this.lat.r, lon = this.lon.r,
      destLat = dest.lat.r,
      dLon = dest.lon.r - lon,
      Bx = cos(destLat) * cos(dLon),
      By = cos(destLat) * sin(dLon),
      cLat = cos(lat),
      y = sin(lat) + sin(destLat),
      x = sqrt((cLat + Bx) * (cLat + Bx) + By * By),
      midLat = atan2(y, x),
      midLon = lon + atan2(By, cLat + Bx);
    // normalise to -180..+180º
    midLon = (midLon + 3 * PI) % PI2 - PI;
    return new LatLon(midLat, midLon);
  };

  Geo.LatLon = LatLon;

}());

