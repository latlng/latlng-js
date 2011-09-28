/*jslint vars: true, white: true */
/*global Geo */

(function () {

  function Sphere(radius) {
    this.radius = radius || 1;
  }

  Geo.Sphere = Sphere;

  Sphere.prototype.area = function () {
    var r = this.radius;
    return 4 * Math.PI * r * r;
  };

  Sphere.prototype.volume = function () {
    var r = this.radius;
    return (4 / 3) * Math.PI * r * r * r;
  };

  Sphere.prototype.distanceBetween = function (a, b) {
    var r = this.radius;
    var lat1 = a.lat.toRad(), lon1 = a.lon.toRad();
    var lat2 = b.lat.toRad(), lon2 = b.lon.toRad();
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;

    var theta = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(theta), Math.sqrt(1 - theta));
    var d = r * c;
    return d;
  };

  Sphere.EARTH = new Sphere(6371000); // meters

}());

