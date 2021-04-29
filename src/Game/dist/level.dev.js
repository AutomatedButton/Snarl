"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = require("./Tile.js"); // import Tile from "./Tile.js";


var Player = require("../Common/Player.js");

var Adversary = require("./Adversary.js");
/**
 * @desc Level var holds the information of the game
 * @param gameLevel: 2D array of all of the tiles in the game
 * @param rooms: Array containing all of the rooms that have been made
 * @param levelSize: The number of tiles wanted per row and column
 */


var Level =
/*#__PURE__*/
function () {
  function Level() {
    _classCallCheck(this, Level);

    this.gameLevel = [];
    this.rooms = [];
    this.levelSize = 30;
    this.players = {};
    this.objects = {};
    this.adversaries = {};
  }

  _createClass(Level, [{
    key: "makeGivenLevel",
    value: function makeGivenLevel(level) {
      for (var row = 0; row < this.levelSize; row++) {
        this.gameLevel[row] = [];

        for (var col = 0; col < this.levelSize; col++) {
          var newTile = new Tile({
            row: row,
            col: col
          }, "wall");
          this.gameLevel[row][col] = newTile;
        }
      }

      var rooms = level.rooms;
      var hallways = level.hallways;
      var objects = level.objects;

      for (var i = 0; i < rooms.length; i++) {
        this.makeRoom(rooms[i].bounds.rows, rooms[i].bounds.columns, {
          row: rooms[i].origin[0],
          col: rooms[i].origin[1]
        }, rooms[i]);
      }

      for (var i = 0; i < hallways.length; i++) {
        this.makeHallway(hallways[i]);
      }

      for (var i = 0; i < objects.length; i++) {
        if (objects[i].type === "key") {
          this.objects["key"] = this.gameLevel[objects[i].position[0]][objects[i].position[1]];
        } else if (objects[i].type === "exit") {
          this.objects["exit"] = this.gameLevel[objects[i].position[0]][objects[i].position[1]];
        }
      }

      return Level;
    }
    /**
     * @desc initializes the game with a levelSize x levelSize grid of walls
     */

  }, {
    key: "makeLevel",
    value: function makeLevel() {
      for (var row = 0; row < this.levelSize; row++) {
        this.gameLevel[row] = [];

        for (var col = 0; col < this.levelSize; col++) {
          var newTile = new Tile({
            row: row,
            col: col
          }, "wall");
          this.gameLevel[row][col] = newTile;
        }
      }

      this.makeRoom(5, 5, {
        row: 2,
        col: 2
      });
      this.makeRoom(5, 5, {
        row: 8,
        col: 8
      });
      this.makeHallway({
        row: 4,
        col: 6
      }, {
        row: 4,
        col: 10
      });
      this.makeHallway({
        row: 4,
        col: 10
      }, {
        row: 8,
        col: 10
      }); // this.makeAllRooms(2);
      // this.makeAllHallways();
      // this.createAdversaries(4);
      // this.createExitDoor();
      // this.gameLevel[4][4].tileType = "exit";
      // this.gameLevel[10][10].tileType = "key";
      // this.createKey();

      this.objects["key"] = this.gameLevel[10][10];
      this.objects["exit"] = this.gameLevel[4][4];
      return Level;
    }
    /**
     * @desc makes all of the rooms in the game by:
     *       1. Splitting the game into the given numRooms number of zones
     *       2. Randomly create a room in each zone (only one room per zone)
     */

  }, {
    key: "makeAllRooms",
    value: function makeAllRooms(numRooms) {
      var roomsCreated = new Array(9).fill(0); // Loop through the given number of rooms times

      var rowsOfRooms = 3;
      var colsOfRooms = 3;
      var zoneWidth = 8;
      var zoneHeight = 8;

      for (var i = 0; i < numRooms; i++) {
        // Randomly select where the next room is going to go
        while (true) {
          var rng = this.generateRandom(1, 9);

          if (roomsCreated[rng - 1] == 0) {
            roomsCreated[rng - 1] = 1;
            break;
          }
        } // Determine the size of the room randomly (currently not working for other than 9 zones)


        var roomWidth = this.generateRandom(4, 7);
        var roomHeight = this.generateRandom(4, 7); // Randomly choose the position of the room (currently not working for other than 9 zones)

        var col = this.generateRandom(0, zoneWidth - roomWidth) + Math.floor(this.levelSize / colsOfRooms) * ((rng - 1) % colsOfRooms);
        var row = this.generateRandom(0, zoneHeight - roomHeight) + Math.floor(this.levelSize / rowsOfRooms) * Math.floor((rng - 1) / rowsOfRooms);
        var position = {
          row: row,
          col: col
        };
        this.makeRoom(roomHeight, roomWidth, position);
      }
    }
    /**
     * @desc makes a room with the givenRows, givenColumns, and givenLocation
     * @param givenRows: the amount of rows to make in the room
     * @param givenColumns: the amount of columns to make in the room
     * @param givenLocation: the exact x-y coordinate of the top left of the room
     */

  }, {
    key: "makeRoom",
    value: function makeRoom(givenRows, givenColumns, givenLocation, givenRoom) {
      // Buffer of where the x location starts of the room
      var rowBuffer = givenLocation.row; // Buffer of where the y location starts of the room

      var colBuffer = givenLocation.col; // Array of the room

      var room = []; // Rows

      for (var i = rowBuffer; i < rowBuffer + givenRows; i++) {
        var row = []; // Columns

        for (var j = colBuffer; j < colBuffer + givenColumns; j++) {
          if (givenRoom.layout[i - rowBuffer][j - colBuffer] === 0) {
            this.gameLevel[i][j].tileType = "wall";
          } else {
            this.gameLevel[i][j].tileType = "floor";
          }

          row.push(this.gameLevel[i][j]);
        }

        room.push(row);
      }

      this.rooms.push(room);
    }
    /**
     * @desc makes all the hallways between all of the rooms
     */

  }, {
    key: "makeAllHallways",
    value: function makeAllHallways() {
      // Loop that goes through all of the rooms and creates at least one hallway between each room
      for (var i = 0; i < this.rooms.length - 1; i++) {
        var room1 = this.rooms[i]; // Randomly picks an y (row) and a random outside room's x (column) from the next room

        var randRow = this.generateRandom(0, room1.length);
        var randCol = this.generateRandom(0, room1[randRow].length); // Creates an array with both of these positions

        var location1 = {
          row: room1[randRow][randCol].location.row,
          col: room1[randRow][randCol].location.col
        };
        var room2 = this.rooms[i + 1]; // Randomly picks an x and a random outside room's y from the next room

        randRow = this.generateRandom(0, room2.length);
        randCol = this.generateRandom(0, room2[randRow].length); // Creates an array with both of these positions

        var location2 = {
          row: room2[randRow][randCol].location.row,
          col: room2[randRow][randCol].location.col
        }; // Creates a hallway between these two x-y positions

        this.makeHallway(location1, location2);
      }
    }
    /**
     * @desc Creates a hallway between the two given x-y points
     * @param room1Point: x-y coordinate of the first room
     * @param room2Point: x-y coordinate of the second room
     */

  }, {
    key: "makeHallway",
    value: function makeHallway(hallway) {
      var waypoints = [hallway.from].concat(hallway.waypoints);
      waypoints.push(hallway.to);

      for (var i = 0; i < waypoints.length; i++) {
        var wx = waypoints[i][0];
        var wy = waypoints[i][1];

        if (waypoints[i + 1] !== undefined) {
          if (wx === waypoints[i + 1][0]) {
            for (var j = wy; j < waypoints[i + 1][1]; j++) {
              this.gameLevel[wx][j].tileType = "floor";
            }
          } else if (wy === waypoints[i + 1][1]) {
            for (var k = wx; k < waypoints[i + 1][0]; k++) {
              this.gameLevel[k][wy].tileType = "floor";
            }
          }
        }
      }
    }
  }, {
    key: "playerOnTile",
    value: function playerOnTile(loc) {
      for (var _i = 0, _Object$values = Object.values(this.players); _i < _Object$values.length; _i++) {
        var value = _Object$values[_i];

        if (value.location.row == loc.row && value.location.col == loc.col) {
          return true;
        } else {
          return false;
        }
      }
    }
    /**
     * @desc Creates a player with the given player name
     * @param playerName: the name of the player
     */

  }, {
    key: "createPlayer",
    value: function createPlayer(playerName) {
      var valid = false;

      validLoc: while (!valid) {
        var randomRoom = this.generateRandom(1, this.rooms.length) - 1;
        randomRoom = this.rooms[randomRoom];
        var randRow = this.generateRandom(1, randomRoom.length) - 1;
        var randCol = this.generateRandom(1, randomRoom[randRow].length) - 1;
        var randLoc = randomRoom[randRow][randCol].location;

        for (var _i2 = 0, _Object$values2 = Object.values(this.players); _i2 < _Object$values2.length; _i2++) {
          var value = _Object$values2[_i2];

          if (value.location.row === randLoc.row && randLoc.col === value.location.col) {
            continue validLoc;
          }
        }

        for (var _i3 = 0, _Object$values3 = Object.values(this.objects); _i3 < _Object$values3.length; _i3++) {
          var _value = _Object$values3[_i3];

          if (_value.location.row === randLoc.row && randLoc.col === _value.location.col) {
            continue validLoc;
          }
        }

        for (var _i4 = 0, _Object$values4 = Object.values(this.adversaries); _i4 < _Object$values4.length; _i4++) {
          var _value2 = _Object$values4[_i4];

          if (_value2.location.row === randLoc.row && randLoc.col === _value2.location.col) {
            continue validLoc;
          }
        }

        valid = true;
      }

      var player = new Player(playerName, randLoc, false);
      this.players[playerName] = player;
    }
    /**
     * @desc Creates the given number of adversaries
     * @param numAdvs: the number of adversaries to be created
     */

  }, {
    key: "createAdversaries",
    value: function createAdversaries(ghostsNum, zombNum) {
      var numAdvs = ghostsNum + zombNum;
      var type;
      var advSpawned = 0;
      var valid = false;

      for (var i = 0; i < numAdvs; i++) {
        validLoc: while (!valid) {
          if (advSpawned >= ghostsNum && advSpawned < numAdvs) {
            type = "Zombie";
          } else if (advSpawned == numAdvs) {
            break;
          } else {
            type = "Ghost";
          }

          var randomRoom = this.generateRandom(1, this.rooms.length) - 1;
          randomRoom = this.rooms[randomRoom];
          var randRow = this.generateRandom(1, randomRoom.length) - 1;
          var randCol = this.generateRandom(1, randomRoom[randRow].length) - 1;
          var randLoc = randomRoom[randRow][randCol].location;

          for (var _i5 = 0, _Object$values5 = Object.values(this.players); _i5 < _Object$values5.length; _i5++) {
            var value = _Object$values5[_i5];

            if (value.location.row === randLoc.row && randLoc.col && value.location.col) {
              continue validLoc;
            }
          }

          for (var _i6 = 0, _Object$values6 = Object.values(this.objects); _i6 < _Object$values6.length; _i6++) {
            var _value3 = _Object$values6[_i6];

            if (_value3.location.row === randLoc.row && randLoc.col && _value3.location.col) {
              continue validLoc;
            }
          }

          for (var _i7 = 0, _Object$values7 = Object.values(this.adversaries); _i7 < _Object$values7.length; _i7++) {
            var _value4 = _Object$values7[_i7];

            if (_value4.location.row === randLoc.row && randLoc.col && _value4.location.col) {
              continue validLoc;
            }
          }

          valid = true;
          advSpawned++;
        }

        var adversary = new Adversary(advSpawned, type, randLoc, this.gameLevel, this.objects, this.rooms);
        this.adversaries[adversary.type + advSpawned] = adversary;
      }
    }
    /**
     * @desc Randomly creates an exit door that is not in the player spawn room
     */

  }, {
    key: "createExitDoor",
    value: function createExitDoor() {
      var exitRoom = this.findExitRoom();
      var randRow = this.generateRandom(0, exitRoom.length - 1);
      var randCol = this.generateRandom(0, exitRoom[randRow].length - 1);
      var gameLevelPos = {
        row: exitRoom[randRow][randCol].location.row,
        col: exitRoom[randRow][randCol].location.col
      };
      this.objects["exit"] = this.gameLevel[gameLevelPos.row][gameLevelPos.col];
    }
    /**
     * @desc Finds a random room that is not the player spawn room
     */

  }, {
    key: "findExitRoom",
    value: function findExitRoom() {
      var possibleExitRooms = this.rooms.slice();
      var topLeftRoom = this.findTopLeftRoom();
      var topLeftIndex = possibleExitRooms.indexOf(topLeftRoom);

      if (topLeftIndex != -1) {
        possibleExitRooms.splice(topLeftIndex, 1);
      }

      var exitRoom = possibleExitRooms[this.generateRandom(0, possibleExitRooms.length - 1)];
      return exitRoom;
    }
    /**
     * @desc Randomly creates a key in a room that is not the exit room
     */

  }, {
    key: "createKey",
    value: function createKey() {
      var keyRoom = this.findKeyRoom();
      var randRow = this.generateRandom(0, keyRoom.length - 1);
      var randCol = this.generateRandom(0, keyRoom[randRow].length - 1);
      var gameLevelPos = {
        row: keyRoom[randRow][randCol].location.row,
        col: keyRoom[randRow][randCol].location.col
      };
      this.objects["key"] = this.gameLevel[gameLevelPos.row][gameLevelPos.col];
    }
    /**
     * @desc Finds a random room to place the key in that is not the exit room
     */

  }, {
    key: "findKeyRoom",
    value: function findKeyRoom() {
      var possibleKeyRooms = this.rooms.slice();
      var exitRoom = this.findExitRoom();
      var exitRoomIndex = possibleKeyRooms.indexOf(exitRoom);

      if (exitRoomIndex != -1) {
        possibleKeyRooms.splice(exitRoomIndex, 1);
      }

      var keyRoom = possibleKeyRooms[this.generateRandom(0, possibleKeyRooms.length - 1)];
      return keyRoom;
    }
    /**
     * @desc Creates a random integer between the given min and max inclusive
     * @param min: minimum integer in random
     * @param max: maximum integer in random
     */

  }, {
    key: "generateRandom",
    value: function generateRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }]);

  return Level;
}();

module.exports = Level; // export default Level;