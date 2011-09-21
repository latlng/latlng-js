/*jslint sloppy: true, indent: 2 */
/*global describe, it, beforeEach, Player, Song, expect, spyOn */

beforeEach(function () {
  this.addMatchers({
    toBePlaying: function (expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong &&
        player.isPlaying;
    }
  });
});

