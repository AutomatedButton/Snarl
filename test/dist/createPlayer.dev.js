"use strict";

// import Level from '../../src/Game/level.js'
// var lv = new Level();
// lv.makeLevel();
// console.log("Current Player List: ", lv.players)
// console.log("Attempt to create player Nilay")
// lv.createPlayer("Nilay")
// for (var i=0; i<lv.players.length; i++) {
//     if (lv.players[i].name == "Nilay") {
//         console.log("Test Passed: Player Nilay was created");
//         break;
//     }
// }
var assert = require('assert');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});