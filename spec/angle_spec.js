/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("Angle", function () {
  var Angle = Geo.Angle;

  describe("parseDMS", function () {
    it("returns the number it(is passed", function () {
      expect(Angle.parseDMS(3.5)).toEqual(3.5);
    });
    it("should parse deg-min-sec suffixed with N/S/E/W", function () {
      expect(Angle.parseDMS("40\u00b044\u203255\u2033N")
        ).toEqual(40.74861111111111);
      expect(Angle.parseDMS("40\u00b044\u203255\u2033S")
        ).toEqual(-40.74861111111111);
      expect(Angle.parseDMS("40\u00b044\u203255\u2033")
        ).toEqual(40.74861111111111);
      expect(Angle.parseDMS("-40\u00b044\u203255\u2033")
        ).toEqual(-40.74861111111111);
      expect(Angle.parseDMS("73 59 11E")).toEqual(73.9863888888889);
      expect(Angle.parseDMS("73 59 11W")).toEqual(-73.9863888888889);
      expect(Angle.parseDMS("73/59/11E")).toEqual(73.9863888888889);
      expect(Angle.parseDMS("73/59/11W")).toEqual(-73.9863888888889);
      expect(Angle.parseDMS("51\u00b0 28\u2032 40.12\u2033 N")
        ).toEqual(51.477811111111116);
      expect(Angle.parseDMS("51\u00b0 28\u2032 40.12\u2033 S")
        ).toEqual(-51.477811111111116);
    });
    it("should parse fixed-width format without separators", function () {
      expect(Angle.parseDMS("0033709W")).toEqual(-3.6191666666666666);
      expect(Angle.parseDMS("00337W")).toEqual(-3.6166666666666667);
      expect(Angle.parseDMS("40\u00b0N")).toEqual(40.0);
    });
    it("should parse decimal format with N/S/E/W", function () {
      expect(Angle.parseDMS("27.389N")).toEqual(27.389);
      expect(Angle.parseDMS("27.389S")).toEqual(-27.389);
      expect(Angle.parseDMS("27.389E")).toEqual(27.389);
      expect(Angle.parseDMS("27.389W")).toEqual(-27.389);
      expect(Angle.parseDMS("-27.389")).toEqual(-27.389);
    });
    it("should handle double negative", function () {
      expect(Angle.parseDMS("-27.389S")).toEqual(27.389);
    });
    it("should gracefully handle non numeric input", function () {
      expect(Angle.parseDMS("FRED")).toBeNan();
    });
  });

  describe("toDMS", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Angle.toDMS(51.477811111111116)
        ).toEqual("051\u00b028\u203240\u2033");
      expect(Angle.toDMS(51.477811111111116, 'dms')
        ).toEqual("051\u00b028\u203240\u2033");
      expect(Angle.toDMS(51.477811111111116, 'dms', 2)
        ).toEqual("051\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Angle.toDMS(51.477811111111116, 'dm')
        ).toEqual("051\u00b028.67\u2032");
      expect(Angle.toDMS(51.477811111111116, 'dm', 0)
        ).toEqual("051\u00b029\u2032");
      expect(Angle.toDMS(51.477811111111116, 'dm', 2)
        ).toEqual("051\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(Angle.toDMS(51.477811111111116, 'd')).toEqual("051.4778\u00b0");
      expect(Angle.toDMS(51.477811111111116, 'd', 0)).toEqual("051\u00b0");
      expect(Angle.toDMS(51.477811111111116, 'd', 4)).toEqual("051.4778\u00b0");
    });
  });

  describe("toLat", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Angle.toLat(51.477811111111116)
        ).toEqual("51\u00b028\u203240\u2033N");
      expect(Angle.toLat(51.477811111111116, 'dms')
        ).toEqual("51\u00b028\u203240\u2033N");
      expect(Angle.toLat(51.477811111111116, 'dms', 2)
        ).toEqual("51\u00b028\u203240.12\u2033N");
      expect(Angle.toLat(-51.477811111111116)
        ).toEqual("51\u00b028\u203240\u2033S");
      expect(Angle.toLat(-51.477811111111116, 'dms')
        ).toEqual("51\u00b028\u203240\u2033S");
      expect(Angle.toLat(-51.477811111111116, 'dms', 2)
        ).toEqual("51\u00b028\u203240.12\u2033S");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Angle.toLat(51.477811111111116, 'dm')
        ).toEqual("51\u00b028.67\u2032N");
      expect(Angle.toLat(51.477811111111116, 'dm', 0)
        ).toEqual("51\u00b029\u2032N");
      expect(Angle.toLat(51.477811111111116, 'dm', 2)
        ).toEqual("51\u00b028.67\u2032N");
      expect(Angle.toLat(-51.477811111111116, 'dm')
        ).toEqual("51\u00b028.67\u2032S");
      expect(Angle.toLat(-51.477811111111116, 'dm', 0)
        ).toEqual("51\u00b029\u2032S");
      expect(Angle.toLat(-51.477811111111116, 'dm', 2)
        ).toEqual("51\u00b028.67\u2032S");
    });
    it("should format a number in degrees", function () {
      expect(Angle.toLat(51.477811111111116, 'd')).toEqual("51.4778\u00b0N");
      expect(Angle.toLat(51.477811111111116, 'd', 0)).toEqual("51\u00b0N");
      expect(Angle.toLat(51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0N");
      expect(Angle.toLat(-51.477811111111116, 'd')).toEqual("51.4778\u00b0S");
      expect(Angle.toLat(-51.477811111111116, 'd', 0)).toEqual("51\u00b0S");
      expect(Angle.toLat(-51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0S");
    });
  });
  describe("toLon", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Angle.toLon(51.477811111111116)
        ).toEqual("051\u00b028\u203240\u2033E");
      expect(Angle.toLon(51.477811111111116, 'dms')
        ).toEqual("051\u00b028\u203240\u2033E");
      expect(Angle.toLon(51.477811111111116, 'dms', 2)
        ).toEqual("051\u00b028\u203240.12\u2033E");
      expect(Angle.toLon(-51.477811111111116)
        ).toEqual("051\u00b028\u203240\u2033W");
      expect(Angle.toLon(-51.477811111111116, 'dms')
        ).toEqual("051\u00b028\u203240\u2033W");
      expect(Angle.toLon(-51.477811111111116, 'dms', 2)
        ).toEqual("051\u00b028\u203240.12\u2033W");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Angle.toLon(51.477811111111116, 'dm')
        ).toEqual("051\u00b028.67\u2032E");
      expect(Angle.toLon(51.477811111111116, 'dm', 0)
        ).toEqual("051\u00b029\u2032E");
      expect(Angle.toLon(51.477811111111116, 'dm', 2)
        ).toEqual("051\u00b028.67\u2032E");
      expect(Angle.toLon(-51.477811111111116, 'dm')
        ).toEqual("051\u00b028.67\u2032W");
      expect(Angle.toLon(-51.477811111111116, 'dm', 0)
        ).toEqual("051\u00b029\u2032W");
      expect(Angle.toLon(-51.477811111111116, 'dm', 2)
        ).toEqual("051\u00b028.67\u2032W");
    });
    it("should format a number in degrees", function () {
      expect(Angle.toLon(51.477811111111116, 'd')).toEqual("051.4778\u00b0E");
      expect(Angle.toLon(51.477811111111116, 'd', 0)).toEqual("051\u00b0E");
      expect(Angle.toLon(51.477811111111116, 'd', 4)).toEqual("051.4778\u00b0E");
      expect(Angle.toLon(-51.477811111111116, 'd')).toEqual("051.4778\u00b0W");
      expect(Angle.toLon(-51.477811111111116, 'd', 0)).toEqual("051\u00b0W");
      expect(Angle.toLon(-51.477811111111116, 'd', 4)).toEqual("051.4778\u00b0W");
    });
  });
  describe("toBrng", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Angle.toBrng(51.477811111111116)
        ).toEqual("051\u00b028\u203240\u2033");
      expect(Angle.toBrng(51.477811111111116, 'dms')
        ).toEqual("051\u00b028\u203240\u2033");
      expect(Angle.toBrng(51.477811111111116, 'dms', 2)
        ).toEqual("051\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Angle.toBrng(51.477811111111116, 'dm')
        ).toEqual("051\u00b028.67\u2032");
      expect(Angle.toBrng(51.477811111111116, 'dm', 0)
        ).toEqual("051\u00b029\u2032");
      expect(Angle.toBrng(51.477811111111116, 'dm', 2)
        ).toEqual("051\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(Angle.toBrng(51.477811111111116, 'd')).toEqual("051.4778\u00b0");
      expect(Angle.toBrng(51.477811111111116, 'd', 0)).toEqual("051\u00b0");
      expect(Angle.toBrng(51.477811111111116, 'd', 4)).toEqual("051.4778\u00b0");
    });
    it("should normalize values to 0..360 degrees", function () {
      expect(Angle.toBrng(-450)).toEqual("270\u00b000\u203200\u2033");
      expect(Angle.toBrng(-360)).toEqual("000\u00b000\u203200\u2033");
      expect(Angle.toBrng(-270)).toEqual("090\u00b000\u203200\u2033");
      expect(Angle.toBrng(-180)).toEqual("180\u00b000\u203200\u2033");
      expect(Angle.toBrng(-90)).toEqual("270\u00b000\u203200\u2033");
      expect(Angle.toBrng(0)).toEqual("000\u00b000\u203200\u2033");
      expect(Angle.toBrng(90)).toEqual("090\u00b000\u203200\u2033");
      expect(Angle.toBrng(180)).toEqual("180\u00b000\u203200\u2033");
      expect(Angle.toBrng(270)).toEqual("270\u00b000\u203200\u2033");
      expect(Angle.toBrng(360)).toEqual("000\u00b000\u203200\u2033");
      expect(Angle.toBrng(450)).toEqual("090\u00b000\u203200\u2033");
    });
  });

  describe("Constructor", function () {
    it("should create a angle with a given radius", function () {
      var angle = new Angle(10);
      expect(angle.radians).toEqual(10 * Math.PI / 180);
    });

    it("should parse deg-min-sec suffixed with N/S/E/W", function () {
      var deg = "40\u00b044\u203255\u2033",
        angle = new Angle(deg);
      expect(angle.radians).toEqual(0.7111974295036337);
      expect(angle.toString()).toEqual(deg);
    });
  });

  describe("methods", function () {
    var angle;

    beforeEach(function () {
      angle = new Angle(10);
    });

    describe("degrees", function () {
      it("should return the degrees of the angle", function () {
        expect(angle.degrees()).toEqual(10);
      });
    });
  });

});

