/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, expect, spyOn, Geo, LatLon */

describe("LatLon", function () {
  describe("Constructor", function () {
    it("should store arguments as attributes", function () {
      var ll = new LatLon(30, 60);
      expect(ll.lat).toEqual(30);
      expect(ll.lon).toEqual(60);
    });
  });
});


