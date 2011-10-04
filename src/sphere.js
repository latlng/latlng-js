/*jslint vars: true, white: true */
/*global Geo */

(function () {
  var LatLon = Geo.LatLon;
  var Angle = Geo.Angle;

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

  /**
   * Returns the distance between LatLon points, in the units of radius
   * (using Haversine formula)
   *
   * @param   {LatLon} a Latitude/longitude of origin point.
   * @param   {LatLon} a Latitude/longitude of destination point.
   * @return  {Number} Distance between origin and destination points.
  */
  Sphere.prototype.distanceBetween = function (a, b) {
    return this.radius * a.angleTo(b);
  };




  /**
   * Returns the destination point from this point having travelled the given
   * distance (in km) on the given initial bearing (bearing may vary before
   * destination is reached)
   *
   *   see http://williams.best.vwh.net/avform.htm#LL
   *
   * @param   {Number} brng Initial bearing in degrees.
   * @param   {Number} dist Distance in km.
   * @return {LatLon} Destination point.

  */
  Sphere.prototype.destinationPoint = function (brng, dist) {
    dist = typeof (dist) === 'number' ? dist :
        typeof (dist) === 'string' && dist.trim() !== '' ? +dist : NaN;
    dist = dist / this.radius;  // convert dist to angular distance in radians
    brng = brng.toRad();  //
    var lat1 = this.lat.toRad(), lon1 = this.lon.toRad();

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                          Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
    var lon2 = lon1 +
        Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
                  Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
    // normalise to -180..+180º
    lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    return new LatLon(lat2.toDeg(), lon2.toDeg());
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
  Sphere.intersection = function (p1, brng1, p2, brng2) {
    brng1 = typeof brng1 === 'number' ? brng1 :
        typeof brng1 === 'string' && brng1.trim() !== '' ? +brng1 : NaN;
    brng2 = typeof brng2 === 'number' ? brng2 :
        typeof brng2 === 'string' && brng2.trim() !== '' ? +brng2 : NaN;
    var lat1 = p1.lat.toRad(), lon1 = p1.lon.toRad();
    var lat2 = p2.lat.toRad(), lon2 = p2.lon.toRad();
    var brng13 = brng1.toRad(), brng23 = brng2.toRad();
    var dLat = lat2 - lat1, dLon = lon2 - lon1;

    var dist12 = 2 * Math.asin(
      Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)));
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
    var alpha1 = (brng13 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;
    // angle 1-2-3
    var alpha2 = (brng21 - brng23 + Math.PI) % (2 * Math.PI) - Math.PI;

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
            Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
    var dLon13 = Math.atan2(
            Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1),
             Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
    var lon3 = lon1 + dLon13;
    // normalise to -180..+180º
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

    return new LatLon(lat3.toDeg(), lon3.toDeg());
  };


  /* ----------------------------------------------- */

  /**
   * Returns the distance from this point to the supplied point, in km,
   * travelling along a rhumb line
   *
   *   see http://williams.best.vwh.net/avform.htm#Rhumb
   *
   * @param   {LatLon} point Latitude/longitude of destination point.
   * @return {Number} Distance in km between this point and destination point.
  */
  Sphere.prototype.rhumbDistanceTo = function (point) {
    var R = this.radius;
    var lat1 = this.lat.toRad(), lat2 = point.lat.toRad();
    var dLat = (point.lat - this.lat).toRad();
    var dLon = Math.abs(point.lon - this.lon).toRad();

    var dPhi = Math.log(
            Math.tan(lat2 / 2 + Math.PI / 4) /
            Math.tan(lat1 / 2 + Math.PI / 4));
    // E-W line gives dPhi=0
    var q = (!isNaN(dLat / dPhi)) ? dLat / dPhi : Math.cos(lat1);
    // if dLon over 180° take shorter rhumb across 180° meridian:
    if (dLon > Math.PI) {
      dLon = 2 * Math.PI - dLon;
    }
    var dist = Math.sqrt(dLat * dLat + q * q * dLon * dLon) * R;

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

