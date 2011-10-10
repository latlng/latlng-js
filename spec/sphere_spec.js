/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("Sphere", function () {
  var Sphere = Geo.Sphere,
    LatLon = Geo.LatLon,
    Angle = Geo.Angle,
    deg = Angle.deg,
    toDeg = Angle.toDeg,
    degLatLon = LatLon.fromDegrees,
    sphere;

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

  describe("angleOf", function () {
    it("should return the angle of a distance", function () {
      expect(sphere.angleOf(20)).toEqual(2);
    });
  });

  describe("distanceOf", function () {
    it("should return the distance for an angle", function () {
      expect(sphere.distanceOf(2)).toEqual(20);
    });
  });

  describe("distanceBetween", function () {
    it("should calculate the distance between points", function () {
      var a, b, d;
      a = degLatLon(30, 60);
      b = degLatLon(60, 30);
      d = sphere.distanceBetween(a, b);
      expect(d).toEqual(6.300251316243758);
    });
  });

  describe("destinationPoint", function () {
    it("should return a LatLon at bearing and distance", function () {
      var a = degLatLon(0, 0),
        bearing = deg(90),
        distance = sphere.distanceOf(deg(90)),
        b = sphere.destinationPoint(a, bearing, distance);
      expect(toDeg(b.lat)).toEqual(0);
      expect(toDeg(b.lon)).toEqual(90);
    });
  });

});

