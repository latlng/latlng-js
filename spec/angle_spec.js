/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("Angle", function () {
  var Angle = Geo.Angle;

  describe("round", function () {
    it("should round the value to the number of decimal places requested",
      function () {
        expect(Angle.round(12.3456, 0)).toEqual(12);
        expect(Angle.round(12.3456, 1)).toEqual(12.3);
        expect(Angle.round(12.3456, 3)).toEqual(12.346);
      });
  });

  describe("roundTo", function () {
    it("should round the value to the number of decimal places requested",
      function () {
        expect(Angle.roundTo(12.3456, 1)).toEqual(12);
        expect(Angle.roundTo(12.3456, 0.1)).toEqual(12.3);
        expect(Angle.roundTo(12.3456, 0.001)).toEqual(12.346);
      });
  });

  describe("parseDMS", function () {
    it("returns the number it is passed", function () {
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

  describe("instance", function () {
    var angle, degrees, radians, neg;
    beforeEach(function () {
      degrees = 51.4778111111111;
      radians = degrees * Math.PI / 180;
      angle = Angle.fromDegrees(degrees);
      neg = Angle.fromDegrees(-degrees);
    });

    describe("Constructor", function () {
      it("should create a angle with a given value in degrees", function () {
        var angle = Angle.fromDegrees(10);
        expect(angle.r).toEqual(10 * Math.PI / 180);
      });

      it("should create a angle with a given value in radians", function () {
        var angle = new Angle(3);
        expect(angle.r).toEqual(3);
      });

      it("should parse deg-min-sec", function () {
        var deg = "40\u00b044\u203255\u2033",
          angle = Angle.fromDegrees(deg);
        expect(angle.r).toEqual(0.7111974295036337);
        expect(angle.toString()).toEqual(deg);
      });
    });

    describe("valueOf", function () {
      it("should return the angle value in radians", function () {
        expect(angle.valueOf()).toEqual(radians);
      });
    });

    describe("radians", function () {
      it("should return the degrees of the angle", function () {
        expect(angle.r).toEqual(radians);
      });
    });

    describe("degrees", function () {
      it("should return the degrees of the angle", function () {
        expect(angle.degrees()).toEqual(degrees);
      });
    });

    describe("toDMS", function () {
      it("should format a number in degrees, minutes and seconds", function () {
        expect(angle.toDMS()).toEqual("51\u00b028\u203240\u2033");
        expect(angle.toDMS('dms')).toEqual("51\u00b028\u203240\u2033");
        expect(angle.toDMS('dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
      });
      it("should format a number in degrees and minutes", function () {
        expect(angle.toDMS('dm')).toEqual("51\u00b028.67\u2032");
        expect(angle.toDMS('dm', 0)).toEqual("51\u00b029\u2032");
        expect(angle.toDMS('dm', 2)).toEqual("51\u00b028.67\u2032");
      });
      it("should format a number in degrees", function () {
        expect(angle.toDMS('d')).toEqual("51.4778\u00b0");
        expect(angle.toDMS('d', 0)).toEqual("51\u00b0");
        expect(angle.toDMS('d', 4)).toEqual("51.4778\u00b0");
      });
    });

    describe("toLat", function () {
      it("should format a number in degrees, minutes, seconds", function () {
        expect(angle.toLat()).toEqual("51\u00b028\u203240\u2033N");
        expect(angle.toLat('dms')).toEqual("51\u00b028\u203240\u2033N");
        expect(angle.toLat('dms', 2)).toEqual("51\u00b028\u203240.12\u2033N");
        expect(neg.toLat()).toEqual("51\u00b028\u203240\u2033S");
        expect(neg.toLat('dms')).toEqual("51\u00b028\u203240\u2033S");
        expect(neg.toLat('dms', 2)).toEqual("51\u00b028\u203240.12\u2033S");
      });
      it("should format a number in degrees and minutes", function () {
        expect(angle.toLat('dm')).toEqual("51\u00b028.67\u2032N");
        expect(angle.toLat('dm', 0)).toEqual("51\u00b029\u2032N");
        expect(angle.toLat('dm', 2)).toEqual("51\u00b028.67\u2032N");
        expect(neg.toLat('dm')).toEqual("51\u00b028.67\u2032S");
        expect(neg.toLat('dm', 0)).toEqual("51\u00b029\u2032S");
        expect(neg.toLat('dm', 2)).toEqual("51\u00b028.67\u2032S");
      });
      it("should format a number in degrees", function () {
        expect(angle.toLat('d')).toEqual("51.4778\u00b0N");
        expect(angle.toLat('d', 0)).toEqual("51\u00b0N");
        expect(angle.toLat('d', 4)).toEqual("51.4778\u00b0N");
        expect(neg.toLat('d')).toEqual("51.4778\u00b0S");
        expect(neg.toLat('d', 0)).toEqual("51\u00b0S");
        expect(neg.toLat('d', 4)).toEqual("51.4778\u00b0S");
      });
    });
    describe("toLon", function () {
      it("should format a number in degrees, minutes, seconds", function () {
        expect(angle.toLon()).toEqual("51\u00b028\u203240\u2033E");
        expect(angle.toLon('dms')).toEqual("51\u00b028\u203240\u2033E");
        expect(angle.toLon('dms', 2)).toEqual("51\u00b028\u203240.12\u2033E");
        expect(neg.toLon()).toEqual("51\u00b028\u203240\u2033W");
        expect(neg.toLon('dms')).toEqual("51\u00b028\u203240\u2033W");
        expect(neg.toLon('dms', 2)).toEqual("51\u00b028\u203240.12\u2033W");
      });
      it("should format a number in degrees and minutes", function () {
        expect(angle.toLon('dm')).toEqual("51\u00b028.67\u2032E");
        expect(angle.toLon('dm', 0)).toEqual("51\u00b029\u2032E");
        expect(angle.toLon('dm', 2)).toEqual("51\u00b028.67\u2032E");
        expect(neg.toLon('dm')).toEqual("51\u00b028.67\u2032W");
        expect(neg.toLon('dm', 0)).toEqual("51\u00b029\u2032W");
        expect(neg.toLon('dm', 2)).toEqual("51\u00b028.67\u2032W");
      });
      it("should format a number in degrees", function () {
        expect(angle.toLon('d')).toEqual("51.4778\u00b0E");
        expect(angle.toLon('d', 0)).toEqual("51\u00b0E");
        expect(angle.toLon('d', 4)).toEqual("51.4778\u00b0E");
        expect(neg.toLon('d')).toEqual("51.4778\u00b0W");
        expect(neg.toLon('d', 0)).toEqual("51\u00b0W");
        expect(neg.toLon('d', 4)).toEqual("51.4778\u00b0W");
      });
    });
    describe("toBrng", function () {
      it("should format a number in degrees, minutes, seconds", function () {
        expect(angle.toBrng()).toEqual("51\u00b028\u203240\u2033");
        expect(angle.toBrng('dms')).toEqual("51\u00b028\u203240\u2033");
        expect(angle.toBrng('dms', 2)).toEqual("51\u00b028\u203240.12\u2033");
      });
      it("should format a number in degrees and minutes", function () {
        expect(angle.toBrng('dm')).toEqual("51\u00b028.67\u2032");
        expect(angle.toBrng('dm', 0)).toEqual("51\u00b029\u2032");
        expect(angle.toBrng('dm', 2)).toEqual("51\u00b028.67\u2032");
      });
      it("should format a number in degrees", function () {
        expect(angle.toBrng('d')).toEqual("51.4778\u00b0");
        expect(angle.toBrng('d', 0)).toEqual("51\u00b0");
        expect(angle.toBrng('d', 4)).toEqual("51.4778\u00b0");
      });
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
        latitude = Angle.toLat(record.deg, 'd', 0);
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
        longitude = Angle.toLon(record.deg, 'd', 0);
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
        bearing = Angle.toBrng(record.deg);
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
        bearing = Angle.toBrng(record.deg, record.style);
        expect(bearing).toEqual(record.str);
      }
    });
  });

});

