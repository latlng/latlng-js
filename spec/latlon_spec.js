/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("LatLon", function () {
  var LatLon = Geo.LatLon,
    Angle = Geo.Angle,
    deg = Angle.fromDegrees,
    degLatLon = LatLon.fromDegrees;

  describe("Constructor", function () {
    it("should store arguments as attributes", function () {
      var ll = degLatLon(30, 60);
      expect(ll.lat.deg()).toEqual(30);
      expect(ll.lon.deg()).toEqual(60);
    });
  });

  describe("Between Points", function () {
    var a, b;

    beforeEach(function () {
      a = degLatLon(0, 0);
      b = degLatLon(45, 90);
    });

    describe("angleTo", function () {
      it("should calculate internal angle between points", function () {
        expect(a.angleTo(b).deg()).toEqual(90);
      });
    });

    describe("bearingTo", function () {
      it("should calculate bearing from a to b", function () {
        expect(a.bearingTo(b).deg()).toEqual(45);
      });
    });

    describe("atBearingAndAngle", function () {
      it("should calculate bearing from a to b", function () {
        var c = a.atBearingAndAngle(deg(45), deg(90));
        expect(c.lat.deg()).toEqual(45);
        expect(c.lon.deg()).toEqual(90);
        c = a.atBearingAndAngle(deg(90), deg(90));
        expect(c.lat.deg()).toEqual(0);
        expect(c.lon.deg()).toEqual(90);
      });
    });

    describe("finalBearingTo", function () {
      it("should calculate final bearing from a to b", function () {
        expect(a.finalBearingTo(b).deg()).toEqual(90);
      });
    });

    describe("midpointTo", function () {
      it("should find the midpoint between a and b", function () {
        var c = a.midpointTo(b);
        expect(c.lat.deg()).toEqual(30);
        expect(c.lon.deg()).toEqual(35.264389682755);
        b = degLatLon(0, 90);
        c = a.midpointTo(b);
        expect(c.lat.deg()).toEqual(0);
        expect(c.lon.deg()).toEqual(45);
        b = degLatLon(90, 0);
        c = a.midpointTo(b);
        expect(c.lat.deg()).toEqual(45);
        expect(c.lon.deg()).toEqual(0);
      });
    });

  });
});


