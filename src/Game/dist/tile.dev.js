"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @desc this class holds the information of a single tile
 * @param tileType: Specifies the type of tile it is (floor, wall, exit, etc)
 * @param location: Specifies the location of the tile as an object ({x:30, y:60})
 * @constructor Create a tile by specifying the location in the game it is on
 */
var Tile = function Tile(location, tileType) {
  _classCallCheck(this, Tile);

  this.location = location;
  this.tileType = tileType;
};

module.exports = Tile; // export default Tile;