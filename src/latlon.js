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

  /* -----------------------------------------------
  */
  /*  Note that minimal error checking is performed in this example code!
  */
  /* -----------------------------------------------
  */


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
    this.lat = typeof (lat) === 'number' ? lat :
        typeof (lat) === 'string' && lat.trim() !== '' ? +lat : NaN;
    this.phi = lat; // latitude: north-south
    this.lon = typeof (lon) === 'number' ? lon :
        typeof (lon) === 'string' && lon.trim() !== '' ? +lon : NaN;
    this.lambda = lon; //longitude: east-west
  }

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

  /* ----------------------------------------------- */

  Geo.LatLon = LatLon;

}());

