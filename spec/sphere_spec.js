/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("Sphere", function () {
  var Sphere = Geo.Sphere, sphere;

  beforeEach(function () {
    sphere = new Sphere(10);
  });

  describe("Constructor", function () {
    it("should create a sphere with a given radius", function () {
      expect(sphere.radius).toEqual(10);
    });
  });

  describe("volume", function () {
    it("should return the volume of the sphere", function () {
      expect(sphere.volume()).toEqual(4188.790204786391);
    });
  });

  describe("area", function () {
    it("should return the surface area of the sphere", function () {
      expect(sphere.area()).toEqual(1256.6370614359173);
    });
  });

  describe("distanceBetween", function () {
    it("should calculate the distance between points", function () {
      var a, b, d;
      a = new LatLon(30, 60);
      b = new LatLon(60, 30);
      d = sphere.distanceBetween(a, b);
      expect(d).toEqual(6.300251316243758);
    });
  });

});

