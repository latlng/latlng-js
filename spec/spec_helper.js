/*global describe, it, beforeEach, Player, Song, expect, spyOn */

beforeEach(function () {
  this.addMatchers({
    toBeNan: function () {
      return isNaN(this.actual);
    }
  });
});

