/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("LatLon", function () {
  var LatLon = Geo.LatLon,
    Angle = Geo.Angle,
    deg = Angle.deg,
    toDeg = Angle.toDeg,
    degLatLon = LatLon.fromDegrees;

  describe("Constructor", function () {
    it("should store arguments as attributes", function () {
      var ll = degLatLon(30, 60);
      expect(toDeg(ll.lat)).toEqual(30);
      expect(toDeg(ll.lon)).toEqual(60);
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
        expect(toDeg(a.angleTo(b))).toEqual(90);
      });
    });

    describe("bearingTo", function () {
      it("should calculate bearing from a to b", function () {
        expect(toDeg(a.bearingTo(b))).toEqual(45);
      });
    });

    describe("atBearingAndAngle", function () {
      it("should calculate bearing from a to b", function () {
        var c = a.atBearingAndAngle(deg(45), deg(90));
        expect(toDeg(c.lat)).toEqual(45);
        expect(toDeg(c.lon)).toEqual(90);
        c = a.atBearingAndAngle(deg(90), deg(90));
        expect(toDeg(c.lat)).toEqual(0);
        expect(toDeg(c.lon)).toEqual(90);
      });
    });

    describe("finalBearingTo", function () {
      it("should calculate final bearing from a to b", function () {
        expect(toDeg(a.finalBearingTo(b))).toEqual(90);
      });
    });

    describe("midpointTo", function () {
      it("should find the midpoint between a and b", function () {
        var c = a.midpointTo(b);
        expect(toDeg(c.lat)).toEqual(30);
        expect(toDeg(c.lon)).toEqual(35.264389682755);
        b = degLatLon(0, 90);
        c = a.midpointTo(b);
        expect(toDeg(c.lat)).toEqual(0);
        expect(toDeg(c.lon)).toEqual(45);
        b = degLatLon(90, 0);
        c = a.midpointTo(b);
        expect(toDeg(c.lat)).toEqual(45);
        expect(toDeg(c.lon)).toEqual(0);
      });
    });

  });
});


