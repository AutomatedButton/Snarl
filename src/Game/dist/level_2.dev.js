"use strict";

//To Do:
// 1. Make hallways not go through other rooms
// 2. Make hallways not intersect

/**
 * @desc Level var holds the information of the game
 * @param gameLevel: 2D array of all of the tiles in the game
 * @param rooms: Array containing all of the rooms that have been made
 * @param levelSize: The number of tiles wanted per row and column
 */
var Level = {
  gameLevel: [],
  rooms: [],
  levelSize: 30,
  players: [],
  adversaries: []
};
/**
 * @desc initializes the game with a levelSize x levelSize grid of walls
 */

function makeLevel() {
  for (var row = 0; row < Level.levelSize; row++) {
    Level.gameLevel[row] = [];

    for (var col = 0; col < Level.levelSize; col++) {
      var newTile = new Tile({
        row: row,
        col: col
      });
      newTile.tileType = "wall";
      Level.gameLevel[row][col] = newTile;
    }
  }

  makeRoom(3, 5, {
    row: 0,
    col: 0
  });
  makeRoom(3, 5, {
    row: 0,
    col: 15
  });
  makeHallway({
    row: 1,
    col: 4
  }, {
    row: 1,
    col: 15
  }); // makeAllRooms(2);
  // makeAllHallways();
  // createAllPlayers(2);
  // createAdversaries(3);
  // createExitDoor();
  // createKey();
}
/**
 * @desc makes all of the rooms in the game by:
 *       1. Splitting the game into the given numRooms number of zones
 *       2. Randomly create a room in each zone (only one room per zone)
 */


function makeAllRooms(numRooms) {
  var roomsCreated = new Array(9).fill(0); // Loop through the given number of rooms times
  var rowsOfRooms = 3;
  var colsOfRooms = 3;
  var zoneWidth = 8;
  var zoneHeight = 8;

  for (var i = 0; i < numRooms; i++) {
    // Randomly select where the next room is going to go
    while (true) {
      var rng = generateRandom(1, 9);

      if (roomsCreated[rng - 1] == 0) {
        roomsCreated[rng - 1] = 1;
        break;
      }
    } // Determine the size of the room randomly (currently not working for other than 9 zones)


    var roomWidth = generateRandom(4, 7);
    var roomHeight = generateRandom(4, 7); // Randomly choose the position of the room (currently not working for other than 9 zones)

    var col = generateRandom(0, zoneWidth - roomWidth) + (Math.floor(levelSize / colsOfRooms)) * ((rng - 1) % colsOfRooms);
    var row = generateRandom(0, zoneHeight - roomHeight) + (Math.floor(levelSize / rowsOfRoom)) * Math.floor((rng - 1) / rowsOfRooms);
    var position = {
      row: row,
      col: col
    };
    makeRoom(height, width, position);
  }
}
/**
 * @desc makes a room with the givenRows, givenColumns, and givenLocation
 * @param givenRows: the amount of rows to make in the room
 * @param givenColumns: the amount of columns to make in the room
 * @param givenLocation: the exact x-y coordinate of the top left of the room
 */


function makeRoom(givenRows, givenColumns, givenLocation) {
  // Buffer of where the x location starts of the room
  var rowBuffer = givenLocation.row; // Buffer of where the y location starts of the room

  var colBuffer = givenLocation.col; // Array of the room

  var room = []; // Rows

  for (var i = rowBuffer; i < rowBuffer + givenRows; i++) {
    var row = []; // Columns

    for (var j = colBuffer; j < colBuffer + givenColumns; j++) {
      Level.gameLevel[i][j].tileType = "floor";
      row.push(Level.gameLevel[i][j]);
    }

    room.push(row);
  }

  Level.rooms.push(room);
}
/**
 * @desc makes all the hallways between all of the rooms
 */


function makeAllHallways() {
  // Loop that goes through all of the rooms and creates at least one hallway between each room
  for (var i = 0; i < Level.rooms.length - 1; i++) {
    var room1 = Level.rooms[i]; // Randomly picks an y (row) and a random outside room's x (column) from the next room

    var randRow = generateRandom(0, room1.length);
    var randCol = generateRandom(0, room1[randRow].length); // Creates an array with both of these positions

    var location1 = {
      row: room1[randRow][randCol].location.row,
      col: room1[randRow][randCol].location.col
    };
    var room2 = Level.rooms[i + 1]; // Randomly picks an x and a random outside room's y from the next room

    randRow = generateRandom(0, room2.length);
    randCol = generateRandom(0, room2[randRow].length); // Creates an array with both of these positions

    var location2 = {
      row: room2[randRow][randCol].location.row,
      col: room2[randRow][randCol].location.col
    }; // Creates a hallway between these two x-y positions

    makeHallway(location1, location2);
  }
}
/**
 * @desc Creates a hallway between the two given x-y points
 * @param room1Point: x-y coordinate of the first room
 * @param room2Point: x-y coordinate of the second room
 */


function makeHallway(room1Point, room2Point) {
  // Waypoint that is where the hallway changes direction
  var waypoint = {
    row: room1Point.row,
    col: room2Point.col
  }; // Loops through all of the tiles and checks if:
  // the row or the column shares the same x or y waypoint and is in between the two rooms
  // then create a floor tile

  for (var row = 0; row < Level.levelSize; row++) {
    for (var col = 0; col < Level.levelSize; col++) {
      if (row == waypoint.row && col <= Math.max(room1Point.col, room2Point.col) && col >= Math.min(room1Point.col, room2Point.col) || col == waypoint.col && row <= Math.max(room1Point.row, room2Point.row) && row >= Math.min(room1Point.row, room2Point.row)) {
        if (!(Level.gameLevel[row][col].tileType == "floor")) {
          Level.gameLevel[row][col].tileType = "hallway";
        }
      }
    }
  }
}
/**
 * @desc Creates the given number of players
 * @param numPlayers: the number of players (1-4) to be created
 */


function createAllPlayers(numPlayers) {
  var playerLocation;
  var player;
  var topLeftRoom = findTopLeftRoom();
  var playersSpawned = 0;

  row: for (var row = 0; row < Level.gameLevel.length; row++) {
    for (var col = 0; col < Level.gameLevel[0].length; col++) {
      playerLocation = {
        row: topLeftRoom[row][col].location.row,
        col: topLeftRoom[row][col].location.col
      };
      player = new Player("Nilay", playerLocation);
      Level.players.push(player);
      playersSpawned++;

      if (playersSpawned >= numPlayers) {
        break row;
      }
    }
  }
}
/**
 * @desc Finds the room closest to the top left and returns it
 */


function findTopLeftRoom() {
  var curRoom = Level.rooms[0];

  for (var i = 1; i < Level.rooms.length; i++) {
    if (Level.rooms[i][0][0].location.row + Level.rooms[i][0][0].location.col < curRoom[0][0].location.row + curRoom[0][0].location.col) {
      curRoom = Level.rooms[i];
    } else if (Level.rooms[i][0][0].location.row + Level.rooms[i][0][0].location.col == curRoom[0][0].location.row + curRoom[0][0].location.col) {
      if (Level.rooms[i][0][0].location.row < curRoom[0][0].location.row) {
        curRoom = Level.rooms[i];
      }
    }
  }

  return curRoom;
}
/**
 * @desc Creates the given number of adversaries
 * @param numAdvs: the number of adversaries to be created
 */


function createAdversaries(numAdvs) {
  var bottomRightRoom = findBottomRightRoom();
  var adversaryLocation;
  var adversary;
  var advSpawned = 0;

  row: for (var row = bottomRightRoom.length - 1; row > 0; row--) {
    for (var col = bottomRightRoom[0].length - 1; col > 0; col--) {
      adversaryLocation = {
        row: bottomRightRoom[row][col].location.row,
        col: bottomRightRoom[row][col].location.col
      };
      adversary = new Adversary("Ghost", adversaryLocation);
      Level.adversaries.push(adversary);
      advSpawned++;

      if (advSpawned >= numAdvs) {
        break row;
      }
    }
  }

  console.log(Level.adversaries);
}
/**
 * @desc Finds the room closest to the top left and returns it
 */


function findBottomRightRoom() {
  var curRoom = Level.rooms[0];

  for (var i = 1; i < Level.rooms.length; i++) {
    if (Level.rooms[i][0][0].location.row + Level.rooms[i][0][0].location.col > curRoom[0][0].location.row + curRoom[0][0].location.col) {
      curRoom = Level.rooms[i];
    } else if (Level.rooms[i][0][0].location.row + Level.rooms[i][0][0].location.col == curRoom[0][0].location.row + curRoom[0][0].location.col) {
      if (Level.rooms[i][0][0].location.col > curRoom[0][0].location.col) {
        curRoom = Level.rooms[i];
      }
    }
  }

  return curRoom;
}
/**
 * @desc Randomly creates an exit door that is not in the player spawn room
 */


function createExitDoor() {
  var exitRoom = findExitRoom();
  var randRow = generateRandom(0, exitRoom.length - 1);
  var randCol = generateRandom(0, exitRoom[randRow].length - 1);
  var gameLevelPos = {
    row: exitRoom[randRow][randCol].location.row,
    col: exitRoom[randRow][randCol].location.col
  };
  Level.gameLevel[gameLevelPos.row][gameLevelPos.col].tileType = "exit";
}
/**
 * @desc Finds a random room that is not the player spawn room
 */


function findExitRoom() {
  var possibleExitRooms = Level.rooms.slice();
  var topLeftRoom = findTopLeftRoom();
  var topLeftIndex = possibleExitRooms.indexOf(topLeftRoom);

  if (topLeftIndex != -1) {
    possibleExitRooms.splice(topLeftIndex, 1);
  }

  var exitRoom = possibleExitRooms[generateRandom(0, possibleExitRooms.length - 1)];
  return exitRoom;
}
/**
 * @desc Randomly creates a key in a room that is not the exit room
 */


function createKey() {
  var keyRoom = findKeyRoom();
  console.log('keyroom', keyRoom);
  var randRow = generateRandom(0, keyRoom.length - 1);
  var randCol = generateRandom(0, keyRoom[randRow].length - 1);
  var gameLevelPos = {
    row: keyRoom[randRow][randCol].location.row,
    col: keyRoom[randRow][randCol].location.col
  };
  Level.gameLevel[gameLevelPos.row][gameLevelPos.col].tileType = "key";
}
/**
 * @desc Finds a random room to place the key in that is not the exit room
 */


function findKeyRoom() {
  var possibleKeyRooms = Level.rooms.slice();
  var exitRoom = findExitRoom();
  var exitRoomIndex = possibleKeyRooms.indexOf(exitRoom);

  if (exitRoomIndex != -1) {
    possibleKeyRooms.splice(exitRoomIndex, 1);
  }

  var keyRoom = possibleKeyRooms[generateRandom(0, possibleKeyRooms.length - 1)];
  return keyRoom;
}
/**
 * @desc Creates a random integer between the given min and max inclusive
 * @param min: minimum integer in random
 * @param max: maximum integer in random
 */


function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**
 * @desc Checks if the player movement is going to be valid and then update the game state
 * @param player: the player that is trying to move
 * @param chosenLocation: the location that the player is trying to move to
 */


function playerMovement(player, chosenLocation) {
  // For Testing Purposes
  // var isValid = RuleCheckerCheck(Level.gameLevel, player, chosenLocation);
  var isValid = true;

  if (isValid) {
    // Testing Purposes
    // RuleCheckerInteractions(Level, player, chosenLocation);
    var levelIndex;

    for (var i = 0; i < Level.players.length; i++) {
      if (Level.players[i] = player) {
        levelIndex = i;
        break;
      }
    }

    Level.players[levelIndex].location = chosenLocation; // Testing Purposes
    // RenderInit();
  }
}
/**
 * @desc Checks if the adversary movement is going to be valid and then update the game state
 * @param adversary: the adversary that is trying to move
 * @param chosenLocation: the location that the adversary is going to move to
 */


function adversaryMovement(adversary, chosenLocation) {
  // For Testing Purposes
  // var isValid = RuleCheckerCheck(Level.gameLevel, adversary, chosenLocation);
  var isValid = true;

  if (isValid) {
    // For Testing Purposes
    // RuleCheckerInteractions(Level, adversary, chosenLocation);
    var levelIndex;

    for (var i = 0; i < Level.adversaries.length; i++) {
      if (Level.adversaries[i] = adversary) {
        levelIndex = i;
        break;
      }
    }

    Level.adversaries[levelIndex].location = chosenLocation; // For Testing Purposes
    // RenderInit();
  }
}

window.onload = function () {
  makeLevel();
  RenderInit();
};

module.exports = {
  Level: Level,
  generateRandom: generateRandom,
  playerMovement: playerMovement,
  adversaryMovement: adversaryMovement
};