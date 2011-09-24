/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, Player, Song, expect, spyOn, Geo */

describe("Geo", function () {
  describe("parseDMS", function () {
    it("returns the number it(is passed", function () {
      expect(Geo.parseDMS(3.5)).toEqual(3.5);
    });
    it("should parse deg-min-sec suffixed with N/S/E/W", function () {
      expect(Geo.parseDMS("40\u00b044\u203255\u2033N")).toEqual(40.74861111111111);
      expect(Geo.parseDMS("40\u00b044\u203255\u2033S")).toEqual(-40.74861111111111);
      expect(Geo.parseDMS("40\u00b044\u203255\u2033")).toEqual(40.74861111111111);
      expect(Geo.parseDMS("-40\u00b044\u203255\u2033")).toEqual(-40.74861111111111);
      expect(Geo.parseDMS("73 59 11E")).toEqual(73.9863888888889);
      expect(Geo.parseDMS("73 59 11W")).toEqual(-73.9863888888889);
      expect(Geo.parseDMS("73/59/11E")).toEqual(73.9863888888889);
      expect(Geo.parseDMS("73/59/11W")).toEqual(-73.9863888888889);
      expect(Geo.parseDMS("51\u00b0 28\u2032 40.12\u2033 N")).toEqual(51.477811111111116);
      expect(Geo.parseDMS("51\u00b0 28\u2032 40.12\u2033 S")).toEqual(-51.477811111111116);
    });
    it("should parse fixed-width format without separators", function () {
      expect(Geo.parseDMS("0033709W")).toEqual(-3.6191666666666666);
      expect(Geo.parseDMS("00337W")).toEqual(-3.6166666666666667);
      expect(Geo.parseDMS("40\u00b0N")).toEqual(40.0);
    });
    it("should parse decimal format with N/S/E/W", function () {
      expect(Geo.parseDMS("27.389N")).toEqual(27.389);
      expect(Geo.parseDMS("27.389S")).toEqual(-27.389);
      expect(Geo.parseDMS("27.389E")).toEqual(27.389);
      expect(Geo.parseDMS("27.389W")).toEqual(-27.389);
      expect(Geo.parseDMS("-27.389")).toEqual(-27.389);
    });
    it("should handle double negative", function () {
      expect(Geo.parseDMS("-27.389S")).toEqual(27.389);
    });
    it("should gracefully handle non numeric input", function () {
      expect(Geo.parseDMS("FRED")).toBeNan();
    });
  });
  describe("toDMS", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Geo.toDMS(51.477811111111116)).toEqual("51\u00b028\u203240\u2033");
      expect(Geo.toDMS(51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033");
      expect(Geo.toDMS(51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Geo.toDMS(51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032");
      expect(Geo.toDMS(51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032");
      expect(Geo.toDMS(51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(Geo.toDMS(51.477811111111116, 'd')).toEqual("51.4778\u00b0");
      expect(Geo.toDMS(51.477811111111116, 'd', 0)).toEqual("51\u00b0");
      expect(Geo.toDMS(51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0");
    });
  });
  describe("toLat", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Geo.toLat(51.477811111111116)).toEqual("51\u00b028\u203240\u2033N");
      expect(Geo.toLat(51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033N");
      expect(Geo.toLat(51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033N");
      expect(Geo.toLat(-51.477811111111116)).toEqual("51\u00b028\u203240\u2033S");
      expect(Geo.toLat(-51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033S");
      expect(Geo.toLat(-51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033S");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Geo.toLat(51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032N");
      expect(Geo.toLat(51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032N");
      expect(Geo.toLat(51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032N");
      expect(Geo.toLat(-51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032S");
      expect(Geo.toLat(-51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032S");
      expect(Geo.toLat(-51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032S");
    });
    it("should format a number in degrees", function () {
      expect(Geo.toLat(51.477811111111116, 'd')).toEqual("51.4778\u00b0N");
      expect(Geo.toLat(51.477811111111116, 'd', 0)).toEqual("51\u00b0N");
      expect(Geo.toLat(51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0N");
      expect(Geo.toLat(-51.477811111111116, 'd')).toEqual("51.4778\u00b0S");
      expect(Geo.toLat(-51.477811111111116, 'd', 0)).toEqual("51\u00b0S");
      expect(Geo.toLat(-51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0S");
    });
  });
  describe("toLon", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Geo.toLon(51.477811111111116)).toEqual("51\u00b028\u203240\u2033E");
      expect(Geo.toLon(51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033E");
      expect(Geo.toLon(51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033E");
      expect(Geo.toLon(-51.477811111111116)).toEqual("51\u00b028\u203240\u2033W");
      expect(Geo.toLon(-51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033W");
      expect(Geo.toLon(-51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033W");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Geo.toLon(51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032E");
      expect(Geo.toLon(51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032E");
      expect(Geo.toLon(51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032E");
      expect(Geo.toLon(-51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032W");
      expect(Geo.toLon(-51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032W");
      expect(Geo.toLon(-51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032W");
    });
    it("should format a number in degrees", function () {
      expect(Geo.toLon(51.477811111111116, 'd')).toEqual("51.4778\u00b0E");
      expect(Geo.toLon(51.477811111111116, 'd', 0)).toEqual("51\u00b0E");
      expect(Geo.toLon(51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0E");
      expect(Geo.toLon(-51.477811111111116, 'd')).toEqual("51.4778\u00b0W");
      expect(Geo.toLon(-51.477811111111116, 'd', 0)).toEqual("51\u00b0W");
      expect(Geo.toLon(-51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0W");
    });
  });
  describe("toBrng", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(Geo.toBrng(51.477811111111116)).toEqual("51\u00b028\u203240\u2033");
      expect(Geo.toBrng(51.477811111111116, 'dms')).toEqual("51\u00b028\u203240\u2033");
      expect(Geo.toBrng(51.477811111111116, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(Geo.toBrng(51.477811111111116, 'dm')).toEqual("51\u00b028.67\u2032");
      expect(Geo.toBrng(51.477811111111116, 'dm', 0)).toEqual("51\u00b029\u2032");
      expect(Geo.toBrng(51.477811111111116, 'dm', 2)).toEqual("51\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(Geo.toBrng(51.477811111111116, 'd')).toEqual("51.4778\u00b0");
      expect(Geo.toBrng(51.477811111111116, 'd', 0)).toEqual("51\u00b0");
      expect(Geo.toBrng(51.477811111111116, 'd', 4)).toEqual("51.4778\u00b0");
    });
    it("should normalize values to 0..360 degrees", function () {
      expect(Geo.toBrng(-450)).toEqual("270\u00b00\u20320\u2033");
      expect(Geo.toBrng(-360)).toEqual("0\u00b00\u20320\u2033");
      expect(Geo.toBrng(-270)).toEqual("90\u00b00\u20320\u2033");
      expect(Geo.toBrng(-180)).toEqual("180\u00b00\u20320\u2033");
      expect(Geo.toBrng(-90)).toEqual("270\u00b00\u20320\u2033");
      expect(Geo.toBrng(0)).toEqual("0\u00b00\u20320\u2033");
      expect(Geo.toBrng(90)).toEqual("90\u00b00\u20320\u2033");
      expect(Geo.toBrng(180)).toEqual("180\u00b00\u20320\u2033");
      expect(Geo.toBrng(270)).toEqual("270\u00b00\u20320\u2033");
      expect(Geo.toBrng(360)).toEqual("0\u00b00\u20320\u2033");
      expect(Geo.toBrng(450)).toEqual("90\u00b00\u20320\u2033");
    });
  });
});

