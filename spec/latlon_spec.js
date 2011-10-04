/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("LatLon", function () {
  var LatLon = Geo.LatLon;

  describe("Constructor", function () {
    it("should store arguments as attributes", function () {
      var ll = new LatLon(30, 60);
      expect(ll.lat.degrees()).toEqual(30);
      expect(ll.lon.degrees()).toEqual(60);
    });
  });

  describe("Between Points", function () {
    var a, b;

    beforeEach(function () {
      a = new LatLon(0, 0);
      b = new LatLon(45, 90);
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

    describe("finalBearingTo", function () {
      it("should calculate final bearing from a to b", function () {
        expect(a.finalBearingTo(b).degrees()).toEqual(90);
      });
    });

  });
});


