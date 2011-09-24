/*global describe, it, beforeEach, Player, Song, expect, spyOn */

beforeEach(function () {
  this.addMatchers({
    toBeNan: function () {
      console.log(this.actual);
      return isNaN(this.actual);
    }
  });
});

