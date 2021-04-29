"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @desc this class holds the information of a single player
 * @param name: Specifies the name of the player it
 * @param location: Specifies the location of the tile as an object ({row:4, col:12})
 * @constructor Create a player by specifying the location in the game it is on and the name
 */
var Player = function Player(name, location) {
  _classCallCheck(this, Player);

  this.name = name;
  this.location = location;
};

var _default = Player;
exports["default"] = _default;