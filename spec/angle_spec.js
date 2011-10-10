/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("Angle", function () {
  var angle, degrees, radians, neg,
    Angle = Geo.Angle,
    toDeg = Angle.toDeg,
    toRad = Angle.toRad,
    parseDMS = Angle.parseDMS,
    rad = Angle.rad,
    deg = Angle.deg,
    round = Angle.round,
    toDMS = Angle.toDMS,
    toLat = Angle.toLat,
    toLon = Angle.toLon,
    toBrng = Angle.toBrng;


  beforeEach(function () {
    degrees = 51.477811111111;
    radians = degrees * Math.PI / 180;
    angle = toRad(degrees);
    neg = toRad(-degrees);
  });

  describe("round", function () {
    it("should round the value to the number of decimal places requested",
      function () {
        expect(round(12.3456, 0)).toEqual(12);
        expect(round(12.3456, 1)).toEqual(12.3);
        expect(round(12.3456, 3)).toEqual(12.346);
      });
  });

  describe("parseDMS", function () {
    it("returns the number it is passed", function () {
      expect(parseDMS(3.5)).toEqual(3.5);
    });
    it("should parse deg-min-sec suffixed with N/S/E/W", function () {
      expect(parseDMS("40\u00b044\u203255\u2033N")
        ).toEqual(40.74861111111111);
      expect(parseDMS("40\u00b044\u203255\u2033S")
        ).toEqual(-40.74861111111111);
      expect(parseDMS("40\u00b044\u203255\u2033")
        ).toEqual(40.74861111111111);
      expect(parseDMS("-40\u00b044\u203255\u2033")
        ).toEqual(-40.74861111111111);
      expect(parseDMS("73 59 11E")).toEqual(73.9863888888889);
      expect(parseDMS("73 59 11W")).toEqual(-73.9863888888889);
      expect(parseDMS("73/59/11E")).toEqual(73.9863888888889);
      expect(parseDMS("73/59/11W")).toEqual(-73.9863888888889);
      expect(parseDMS("51\u00b0 28\u2032 40.12\u2033 N")
        ).toEqual(51.477811111111116);
      expect(parseDMS("51\u00b0 28\u2032 40.12\u2033 S")
        ).toEqual(-51.477811111111116);
    });
    it("should parse fixed-width format without separators", function () {
      expect(parseDMS("0033709W")).toEqual(-3.6191666666666666);
      expect(parseDMS("00337W")).toEqual(-3.6166666666666667);
      expect(parseDMS("40\u00b0N")).toEqual(40.0);
    });
    it("should parse decimal format with N/S/E/W", function () {
      expect(parseDMS("27.389N")).toEqual(27.389);
      expect(parseDMS("27.389S")).toEqual(-27.389);
      expect(parseDMS("27.389E")).toEqual(27.389);
      expect(parseDMS("27.389W")).toEqual(-27.389);
      expect(parseDMS("-27.389")).toEqual(-27.389);
    });
    it("should handle double negative", function () {
      expect(parseDMS("-27.389S")).toEqual(27.389);
    });
    it("should gracefully handle non numeric input", function () {
      expect(parseDMS("FRED")).toBeNan();
    });
  });

  describe("radians", function () {
    it("should return the degrees of the angle", function () {
      expect(angle).toEqual(radians);
    });
  });

  describe("degrees", function () {
    it("should return the degrees of the angle", function () {
      expect(toDeg(angle)).toEqual(degrees);
    });
  });

  describe("toDMS", function () {
    it("should format a number in degrees, minutes and seconds", function () {
      expect(toDMS(angle)).toEqual("51\u00b028\u203240\u2033");
      expect(toDMS(angle, 'dms')).toEqual("51\u00b028\u203240\u2033");
      expect(toDMS(angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(toDMS(angle, 'dm')).toEqual("51\u00b028.67\u2032");
      expect(toDMS(angle, 'dm', 0)).toEqual("51\u00b029\u2032");
      expect(toDMS(angle, 'dm', 2)).toEqual("51\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(toDMS(angle, 'd')).toEqual("51.4778\u00b0");
      expect(toDMS(angle, 'd', 0)).toEqual("51\u00b0");
      expect(toDMS(angle, 'd', 4)).toEqual("51.4778\u00b0");
    });
  });

  describe("toLat", function () {
    it("should format a number in degrees, minutes, seconds", function () {
      expect(toLat(angle)).toEqual("51\u00b028\u203240\u2033N");
      expect(toLat(angle, 'dms')).toEqual("51\u00b028\u203240\u2033N");
      expect(toLat(angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033N");
      expect(toLat(-angle)).toEqual("51\u00b028\u203240\u2033S");
      expect(toLat(-angle, 'dms')).toEqual("51\u00b028\u203240\u2033S");
      expect(toLat(-angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033S");
    });
    it("should format a number in degrees and minutes", function () {
      expect(toLat(angle, 'dm')).toEqual("51\u00b028.67\u2032N");
      expect(toLat(angle, 'dm', 0)).toEqual("51\u00b029\u2032N");
      expect(toLat(angle, 'dm', 2)).toEqual("51\u00b028.67\u2032N");
      expect(toLat(-angle, 'dm')).toEqual("51\u00b028.67\u2032S");
      expect(toLat(-angle, 'dm', 0)).toEqual("51\u00b029\u2032S");
      expect(toLat(-angle, 'dm', 2)).toEqual("51\u00b028.67\u2032S");
    });
    it("should format a number in degrees", function () {
      expect(toLat(angle, 'd')).toEqual("51.4778\u00b0N");
      expect(toLat(angle, 'd', 0)).toEqual("51\u00b0N");
      expect(toLat(angle, 'd', 4)).toEqual("51.4778\u00b0N");
      expect(toLat(-angle, 'd')).toEqual("51.4778\u00b0S");
      expect(toLat(-angle, 'd', 0)).toEqual("51\u00b0S");
      expect(toLat(-angle, 'd', 4)).toEqual("51.4778\u00b0S");
    });
  });
  describe("toLon", function () {
    it("should format a number in degrees, minutes, seconds", function () {
      expect(toLon(angle)).toEqual("51\u00b028\u203240\u2033E");
      expect(toLon(angle, 'dms')).toEqual("51\u00b028\u203240\u2033E");
      expect(toLon(angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033E");
      expect(toLon(-angle)).toEqual("51\u00b028\u203240\u2033W");
      expect(toLon(-angle, 'dms')).toEqual("51\u00b028\u203240\u2033W");
      expect(toLon(-angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033W");
    });
    it("should format a number in degrees and minutes", function () {
      expect(toLon(angle, 'dm')).toEqual("51\u00b028.67\u2032E");
      expect(toLon(angle, 'dm', 0)).toEqual("51\u00b029\u2032E");
      expect(toLon(angle, 'dm', 2)).toEqual("51\u00b028.67\u2032E");
      expect(toLon(-angle, 'dm')).toEqual("51\u00b028.67\u2032W");
      expect(toLon(-angle, 'dm', 0)).toEqual("51\u00b029\u2032W");
      expect(toLon(-angle, 'dm', 2)).toEqual("51\u00b028.67\u2032W");
    });
    it("should format a number in degrees", function () {
      expect(toLon(angle, 'd')).toEqual("51.4778\u00b0E");
      expect(toLon(angle, 'd', 0)).toEqual("51\u00b0E");
      expect(toLon(angle, 'd', 4)).toEqual("51.4778\u00b0E");
      expect(toLon(-angle, 'd')).toEqual("51.4778\u00b0W");
      expect(toLon(-angle, 'd', 0)).toEqual("51\u00b0W");
      expect(toLon(-angle, 'd', 4)).toEqual("51.4778\u00b0W");
    });
  });
  describe("toBrng", function () {
    it("should format a number in degrees, minutes, seconds", function () {
      expect(toBrng(angle)).toEqual("51\u00b028\u203240\u2033");
      expect(toBrng(angle, 'dms')).toEqual("51\u00b028\u203240\u2033");
      expect(toBrng(angle, 'dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
    });
    it("should format a number in degrees and minutes", function () {
      expect(toBrng(angle, 'dm')).toEqual("51\u00b028.67\u2032");
      expect(toBrng(angle, 'dm', 0)).toEqual("51\u00b029\u2032");
      expect(toBrng(angle, 'dm', 2)).toEqual("51\u00b028.67\u2032");
    });
    it("should format a number in degrees", function () {
      expect(toBrng(angle, 'd')).toEqual("51.4778\u00b0");
      expect(toBrng(angle, 'd', 0)).toEqual("51\u00b0");
      expect(toBrng(angle, 'd', 4)).toEqual("51.4778\u00b0");
    });
  });

  describe("toLat", function () {
    it("should normalize values to -180..180 degrees", function () {
      var i, latitude, record, records = [
        {deg: -450, str: "90\u00b0S"},
        {deg: -360, str: "0\u00b0N"},
        {deg: -330, str: "30\u00b0N"},
        {deg: -300, str: "60\u00b0N"},
        {deg: -270, str: "90\u00b0N"},
        {deg: -240, str: "60\u00b0N"},
        {deg: -210, str: "30\u00b0N"},
        {deg: -180, str: "0\u00b0N"},
        {deg: -150, str: "30\u00b0S"},
        {deg: -120, str: "60\u00b0S"},
        {deg: -90, str: "90\u00b0S"},
        {deg: -60, str: "60\u00b0S"},
        {deg: -30, str: "30\u00b0S"},
        {deg: 0, str: "0\u00b0N"},
        {deg: 30, str: "30\u00b0N"},
        {deg: 60, str: "60\u00b0N"},
        {deg: 90, str: "90\u00b0N"},
        {deg: 120, str: "60\u00b0N"},
        {deg: 150, str: "30\u00b0N"},
        {deg: 180, str: "0\u00b0N"},
        {deg: 210, str: "30\u00b0S"},
        {deg: 240, str: "60\u00b0S"},
        {deg: 270, str: "90\u00b0S"},
        {deg: 300, str: "60\u00b0S"},
        {deg: 330, str: "30\u00b0S"},
        {deg: 360, str: "0\u00b0N"},
        {deg: 359.999999999, str: "0\u00b0N"},
        {deg: 450, str: "90\u00b0N"}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        latitude = Angle.toLat(deg(record.deg), 'd', 0);
        expect(latitude).toEqual(record.str);
      }
    });
    it("should round -0.0000000001 to 0\u2032N", function () {
      var i, latitude, record, records = [
        {str: "0.0000\u00b0N", style: 'd'},
        {str: "0\u00b00.00\u2032N", style: 'dm'},
        {str: "0\u00b00\u20320\u2033N", style: 'dms'}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        latitude = Angle.toLat(0.00000001, record.style);
        expect(latitude).toEqual(record.str);
        latitude = Angle.toLat(-0.00000001, record.style);
        expect(latitude).toEqual(record.str);
      }
    });
  });

  describe("toLon", function () {
    it("should normalize values to -90..90 degrees", function () {
      var i, longitude, record, records = [
        {deg: -450, str: "90\u00b0W"},
        {deg: -420, str: "60\u00b0W"},
        {deg: -390, str: "30\u00b0W"},
        {deg: -360, str: "0\u00b0E"},
        {deg: -330, str: "30\u00b0E"},
        {deg: -300, str: "60\u00b0E"},
        {deg: -270, str: "90\u00b0E"},
        {deg: -240, str: "120\u00b0E"},
        {deg: -210, str: "150\u00b0E"},
        {deg: -180, str: "180\u00b0W"},
        {deg: -150, str: "150\u00b0W"},
        {deg: -120, str: "120\u00b0W"},
        {deg: -90, str: "90\u00b0W"},
        {deg: -60, str: "60\u00b0W"},
        {deg: -30, str: "30\u00b0W"},
        {deg: 0, str: "0\u00b0E"},
        {deg: 30, str: "30\u00b0E"},
        {deg: 60, str: "60\u00b0E"},
        {deg: 90, str: "90\u00b0E"},
        {deg: 120, str: "120\u00b0E"},
        {deg: 150, str: "150\u00b0E"},
        {deg: 180, str: "180\u00b0E"},
        {deg: 210, str: "150\u00b0W"},
        {deg: 240, str: "120\u00b0W"},
        {deg: 270, str: "90\u00b0W"},
        {deg: 300, str: "60\u00b0W"},
        {deg: 330, str: "30\u00b0W"},
        {deg: 359.9999999, str: "0\u00b0E"},
        {deg: 360, str: "0\u00b0E"},
        {deg: 390, str: "30\u00b0E"},
        {deg: 420, str: "60\u00b0E"},
        {deg: 450, str: "90\u00b0E"}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        longitude = Angle.toLon(deg(record.deg), 'd', 0);
        expect(longitude).toEqual(record.str);
      }
    });
    it("should round -0.0000000001 to 0\u2032E", function () {
      var i, longitude, record, records = [
        {str: "0.0000\u00b0E", style: 'd'},
        {str: "0\u00b00.00\u2032E", style: 'dm'},
        {str: "0\u00b00\u20320\u2033E", style: 'dms'}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        longitude = Angle.toLon(0.00000001, record.style);
        expect(longitude).toEqual(record.str);
        longitude = Angle.toLon(-0.00000001, record.style);
        expect(longitude).toEqual(record.str);
      }
    });
  });

  describe("toBrng", function () {
    it("should normalize values to 0..360 degrees", function () {
      var i, bearing, record, records = [
        {deg: -450, str: "270\u00b00\u20320\u2033"},
        {deg: -360, str: "0\u00b00\u20320\u2033"},
        {deg: -270, str: "90\u00b00\u20320\u2033"},
        {deg: -180, str: "180\u00b00\u20320\u2033"},
        {deg:  -90, str: "270\u00b00\u20320\u2033"},
        {deg:    0, str: "0\u00b00\u20320\u2033"},
        {deg:   90, str: "90\u00b00\u20320\u2033"},
        {deg:  180, str: "180\u00b00\u20320\u2033"},
        {deg:  270, str: "270\u00b00\u20320\u2033"},
        {deg:  360, str: "0\u00b00\u20320\u2033"},
        {deg:  450, str: "90\u00b00\u20320\u2033"}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        bearing = Angle.toBrng(deg(record.deg));
        expect(bearing).toEqual(record.str);
      }
    });
    it("should round 360 to 0", function () {
      var i, bearing, record, records = [
        {deg: 359.999999999, str: "0.0000\u00b0", style: 'd'},
        {deg: 359.999999999, str: "0\u00b00.00\u2032", style: 'dm'},
        {deg: 359.999999999, str: "0\u00b00\u20320\u2033", style: 'dms'}
      ];
      for (i = 0; i < records.length; i += 1) {
        record = records[i];
        bearing = Angle.toBrng(deg(record.deg), record.style);
        expect(bearing).toEqual(record.str);
      }
    });

  });
});

