/*jslint vars: true, white: true */
/*global Geo, console */

(function () {
  var LatLon = Geo.LatLon,
    Angle = Geo.Angle,
    abs = Math.abs,
    tan = Math.tan,
    atan2 = Math.atan2,
    asin = Math.asin,
    sin = Math.sin,
    cos = Math.cos,
    sqrt = Math.sqrt,
    log = Math.log,
    PI = Math.PI,
    PI2 = 2 * PI;

  function Sphere(radius) {
    this.radius = radius || 1;
  }

  Sphere.prototype.area = function () {
    var r = this.radius;
    return 4 * Math.PI * r * r;
  };

  Sphere.prototype.volume = function () {
    var r = this.radius;
    return (4 / 3) * Math.PI * r * r * r;
  };

  Sphere.prototype.angleOf = function (distance) {
    return new Angle(distance / this.radius);
  };

  Sphere.prototype.distanceOf = function (angle) {
    if (typeof angle === 'number') {
      return angle * this.radius;
    } else {
      return angle.r * this.radius;
    }
  };

  /**
   * Returns the distance between LatLon points, in the units of radius
   * (using Haversine formula)
   *
   * @param   {LatLon} a Latitude/longitude of origin point.
   * @param   {LatLon} a Latitude/longitude of destination point.
   * @return  {Number} Distance between origin and destination points.
  */
  Sphere.prototype.distanceBetween = function (a, b) {
    return this.distanceOf(a.angleTo(b));
  };

  /**
   * Returns the destination point from this point having travelled the given
   * distance (in km) on the given initial bearing (bearing may vary before
   * destination is reached)
   *
   *   see http://williams.best.vwh.net/avform.htm#LL
   *
   * @param   {LatLon} a Initial location
   * @param   {Number} brng Initial bearing
   * @param   {Number} dist Distance in km.
   * @return {LatLon} Destination point.

  */
  Sphere.prototype.destinationPoint = function (a, bearing, distance) {
    var angle = this.angleOf(distance);
    console.log(a, bearing, distance, angle);
    return a.atBearingAndAngle(bearing, angle);
  };


  /* ----------------------------------------------- */

  /**
   * Returns the distance from this point to the supplied point, in km,
   * travelling along a rhumb line
   *
   *   see http://williams.best.vwh.net/avform.htm#Rhumb
   *
   * @param  {LatLon} a Latitude/longitude of origin point.
   * @param  {LatLon} b Latitude/longitude of destination point.
   * @return {Number} Distance in km between this point and destination point.
  */
  Sphere.prototype.rhumbDistanceBetween = function (a, b) {
    var R = this.radius;
    var lat1 = a.lat.r, lat2 = b.lat.r;
    var dLat = b.lat.r - a.lat.r;
    var dLon = abs(b.lon.r - a.lon.r);
    var dPhi = log( tan(lat2 / 2 + PI / 4) / tan(lat1 / 2 + PI / 4));
    // E-W line gives dPhi=0
    var q = (!isNaN(dLat / dPhi)) ? dLat / dPhi : cos(lat1);
    // if dLon over 180° take shorter rhumb across 180° meridian:
    if (dLon > PI) { dLon = 2 * PI - dLon; }
    var dist = sqrt(dLat * dLat + q * q * dLon * dLon) * R;

    // 4 sig figs reflects typical 0.3% accuracy of spherical model
    return dist.toPrecisionFixed(4);
  };

  /**
   * Returns the bearing from this point to the supplied point along a rhumb
   * line, in degrees
   *
   * @param   {LatLon} point: Latitude/longitude of destination point.
   * @return {Number} Bearing in degrees from North.

  */
  Sphere.prototype.rhumbBearingTo = function (point) {
    var lat1 = this.lat.toRad(), lat2 = point.lat.toRad();
    var dLon = (point.lon - this.lon).toRad();

    var dPhi = Math.log(
            Math.tan(lat2 / 2 + Math.PI / 4) /
            Math.tan(lat1 / 2 + Math.PI / 4));
    if (Math.abs(dLon) > Math.PI) {
        dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
    }
    var brng = Math.atan2(dLon, dPhi);

    return (brng.toDeg() + 360) % 360;
  };

  /**
   * Returns the destination point from this point having travelled the given
   * distance (in km) on the given bearing along a rhumb line
   *
   * @param   {Number} brng: Bearing in degrees from North.
   * @param   {Number} dist: Distance in km.
   * @return {LatLon} Destination point.

  */
  Sphere.prototype.rhumbDestinationPoint = function (brng, dist) {
    var R = this.radius;
    // d = angular distance covered on earth's surface
    var d = parseFloat(dist) / R;
    var lat1 = this.lat.toRad(), lon1 = this.lon.toRad();
    brng = brng.toRad();

    var lat2 = lat1 + d * Math.cos(brng);
    var dLat = lat2 - lat1;
    var dPhi = Math.log(
            Math.tan(lat2 / 2 + Math.PI / 4) /
            Math.tan(lat1 / 2 + Math.PI / 4));
    // E-W line gives dPhi=0
    var q = (!isNaN(dLat / dPhi)) ? dLat / dPhi : Math.cos(lat1);
    var dLon = d * Math.sin(brng) / q;
    // check for some daft bugger going past the pole
    if (Math.abs(lat2) > Math.PI / 2) {
        lat2 = lat2 > 0 ? Math.PI - lat2 : -(Math.PI - lat2);
    }
    var lon2 = (lon1 + dLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    return new LatLon(lat2.toDeg(), lon2.toDeg());
  };

  Geo.Sphere = Sphere;
  Geo.EARTH = new Sphere(6371000); // meters

}());

