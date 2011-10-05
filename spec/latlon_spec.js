/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("LatLon", function () {
  var LatLon = Geo.LatLon, Angle = Geo.Angle;

  describe("Constructor", function () {
    it("should store arguments as attributes", function () {
      var ll = LatLon.fromDegrees(30, 60);
      expect(ll.lat.degrees()).toEqual(30);
      expect(ll.lon.degrees()).toEqual(60);
    });
  });

  describe("Between Points", function () {
    var a, b;

    beforeEach(function () {
      a = LatLon.fromDegrees(0, 0);
      b = LatLon.fromDegrees(45, 90);
    });

    describe("angleTo", function () {
      it("should calculate internal angle between points", function () {
        expect(a.angleTo(b).degrees()).toEqual(90);
      });
    });

    describe("bearingTo", function () {
      it("should calculate bearing from a to b", function () {
        expect(a.bearingTo(b).degrees()).toEqual(45);
      });
    });

    describe("atBearingAndAngle", function () {
      it("should calculate bearing from a to b", function () {
        var c = a.atBearingAndAngle(
          Angle.fromDegrees(45),
          Angle.fromDegrees(90)
        );
        expect(c.lat.degrees()).toEqual(45);
        expect(c.lon.degrees()).toEqual(90);
      });
    });

    describe("finalBearingTo", function () {
      it("should calculate final bearing from a to b", function () {
        expect(a.finalBearingTo(b).degrees()).toEqual(90);
      });
    });

    describe("midpointBetween", function () {
      it("should find the midpoint between a and b", function () {
        var c = a.midpointTo(b);
        expect(c.lat.degrees()).toEqual(30);
        expect(c.lon.degrees()).toEqual(35.264389682755);
        b = LatLon.fromDegrees(0, 90);
        c = a.midpointTo(b);
        expect(c.lat.degrees()).toEqual(0);
        expect(c.lon.degrees()).toEqual(45);
        b = LatLon.fromDegrees(90, 0);
        c = a.midpointTo(b);
        expect(c.lat.degrees()).toEqual(45);
        expect(c.lon.degrees()).toEqual(0);
      });
    });

  });
});


