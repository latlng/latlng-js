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
    rad = Angle.rad,
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

    return this.lat.toLat(format, dp) + ', ' +
        this.lon.toLon(format, dp);
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
    var brng = rad(bearing), theta = rad(angle),
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

  /**
   * Returns the point of intersection of two paths defined by point and bearing
   *
   *   see http://williams.best.vwh.net/avform.htm#Intersection
   *
   * @param   {LatLon} p1 First point.
   * @param   {Number} brng1 Initial bearing from first point.
   * @param   {LatLon} p2 Second point.
   * @param   {Number} brng2 Initial bearing from second point.
   * @return {LatLon} Destination point
   *                  (null if no unique intersection defined).

  */
  LatLon.intersection = function (p1, brng1, p2, brng2) {
    var b1 = rad(brng1), b2 = rad(brng2),
      lat1 = p1.lat.r, lon1 = p1.lon.r,
      lat2 = p2.lat.r, lon2 = p2.lon.r,
      dLat = lat2 - lat1, dLon = lon2 - lon1;

    var dist12 = 2 * asin(
      sqrt(sin(dLat / 2) * Math.sin(dLat / 2) +
      cos(lat1) * cos(lat2) *
      sin(dLon / 2) * sin(dLon / 2)));
    if (dist12 === 0) {
      return null;
    }

    // initial/final bearings between points
    var brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) /
      (Math.sin(dist12) * Math.cos(lat1)));
    if (isNaN(brngA)) {
      brngA = 0;  // protect against rounding
    }
    var brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) /
      (Math.sin(dist12) * Math.cos(lat2)));

    var brng12, brng21;
    if (Math.sin(lon2 - lon1) > 0) {
      brng12 = brngA;
      brng21 = 2 * Math.PI - brngB;
    } else {
      brng12 = 2 * Math.PI - brngA;
      brng21 = brngB;
    }

    // angle 2-1-3
    var alpha1 = (b1 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;
    // angle 1-2-3
    var alpha2 = (brng21 - b2 + Math.PI) % (2 * Math.PI) - Math.PI;

    // infinite intersections
    if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0) {
      return null;
    }
    // ambiguous intersection
    if (Math.sin(alpha1) * Math.sin(alpha2) < 0) {
      return null;
    }

    //alpha1 = Math.abs(alpha1);
    //alpha2 = Math.abs(alpha2);
    // ... Ed Williams takes abs of alpha1/alpha2, but that seems to break
    // calculation?

    var alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) +
            Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
    var dist13 = Math.atan2(
            Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
            Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
    var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) +
            Math.cos(lat1) * Math.sin(dist13) * Math.cos(b1));
    var dLon13 = Math.atan2(
            Math.sin(b1) * Math.sin(dist13) * Math.cos(lat1),
             Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
    var lon3 = lon1 + dLon13;
    // normalise to -180..+180º
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    return new LatLon(lat3.toDeg(), lon3.toDeg());
  };


  Geo.LatLon = LatLon;

}());

