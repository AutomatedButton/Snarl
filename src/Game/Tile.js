/**
 * @desc this class holds the information of a single tile
 * @param tileType: Specifies the type of tile it is (floor, wall, exit, etc)
 * @param location: Specifies the location of the tile as an object ({x:30, y:60})
 * @constructor Create a tile by specifying the location in the game it is on
 */
class Tile {
	constructor(location, tileType) {
		this.location = location
		this.tileType = tileType;
	}
}
module.exports = Tile;
// export default Tile;