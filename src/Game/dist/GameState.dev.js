"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import RuleChecker from "./RuleChecker.js";
var Adversary = require("./Adversary");

var RuleChecker = require("./RuleChecker");
/**
 * @desc GameState holds the information of the current gamestate
 * @param layout: 2D array of all of the tiles in the game
 * @param players: a map of the current players that are still alive in the game
 * @param adversaries: a map of the adversaries that are in the game
 * @param objects: a map of the objects in the game (key, exit)
 * @param rooms: Array containing all of the rooms that have been made
 * @param exitUnlocked: Boolean indicating if the exit has been unlocked
 */


var GameState =
/*#__PURE__*/
function () {
  function GameState(layout, players, adversaries, objects, rooms, exitUnlocked) {
    _classCallCheck(this, GameState);

    if (players === undefined && adversaries === undefined && objects === undefined && rooms === undefined && exitUnlocked === undefined) {
      layout && Object.assign(this, layout);
    } else {
      this.layout = layout;
      this.players = players;
      this.adversaries = adversaries;
      this.objects = objects;
      this.rooms = rooms;
      this.exitUnlocked = exitUnlocked;
      this.key = null;
      this.exits = [];
      this.ejects = [];
      this.validateGameState();
    }
  }
  /**
   * @desc Validates the game state using the Rule Checker's validation function
   */


  _createClass(GameState, [{
    key: "validateGameState",
    value: function validateGameState() {
      var rulechecker = new RuleChecker(this);
      return rulechecker.validateGameState();
    }
    /**
     * @desc Checks if the move is valid and then move the player to that location
     * @param player: the player that is trying to move
     * @param chosenLocation: the location that the player is trying to move to
     */

  }, {
    key: "playerMovement",
    value: function playerMovement(playerName, chosenLocation) {
      var keyCollected = false;
      var playerExited = false;
      var expelPlayer = false;
      var rulechecker = new RuleChecker(this);

      if (rulechecker.isLegalPlayerMove(playerName, chosenLocation)) {
        this.movePlayer(playerName, chosenLocation);

        if (rulechecker.isPlayerExpelled(chosenLocation)) {
          expelPlayer = true;
        } else if (rulechecker.isKeyCollected(chosenLocation)) {
          this.collectKey();
          keyCollected = true;
        } else if (rulechecker.isPlayerExited(chosenLocation)) {
          this.exitPlayer(playerName);
          playerExited = true;
        }

        return [keyCollected, playerExited, expelPlayer];
      } else {
        console.log("Illegal Move");
        return false;
      }
    }
    /**
     * @desc Deletes the given player from the gamestate
     * @param playerName: the name of the player that is to be removed
     */

  }, {
    key: "expelPlayer",
    value: function expelPlayer(playerName) {
      delete this.players[playerName];
    }
    /**
     * @desc Deletes the key from the objects map and unlocks the exit
     */

  }, {
    key: "collectKey",
    value: function collectKey() {
      this.exitUnlocked = true;
      delete this.objects["key"];
    }
    /**
     * @desc Moves the given player to the given destination location
     * @param playerName: the given player name to be moved
     * @param dest: the destination location that the player is moving to
     */

  }, {
    key: "movePlayer",
    value: function movePlayer(playerName, dest) {
      this.players[playerName].location = dest;
    }
    /**
     * @desc Sets the given player name to be exited
     * @param playerName: the given player name that has exited the level
     */

  }, {
    key: "exitPlayer",
    value: function exitPlayer(playerName) {
      this.players[playerName].exited = true;
    }
    /**
     * @desc Moves the given player to the given destination location
     * @param playerName: the given player name to be moved
     * @param dest: the destination location that the player is moving to
     */

  }, {
    key: "moveAdversary",
    value: function moveAdversary(adversaryKey, dest) {
      var rulechecker = new RuleChecker(this);
      this.adversaries[adversaryKey].location = dest;

      if (this.layout[this.adversaries[adversaryKey].location.row][this.adversaries[adversaryKey].location.col].tileType === "wall") {
        var randRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];
        var origin = randRoom[0][0].location;
        var valid = false;

        while (!valid) {
          var randRow = Math.floor(Math.random() * randRoom.length);
          var randCol = Math.floor(Math.random() * randRoom[randRow].length);

          if (randRoom[randRow][randCol].tileType !== "wall" && !rulechecker.anyPlayersOnDest({
            row: randRow + origin.row,
            col: randCol + origin.col
          })) {
            valid = true;
            this.adversaries[adversaryKey].location = {
              row: randRow + origin.row,
              col: randCol + origin.col
            };
          }
        }
      }
    }
    /**
     * @desc Checks if the adversary movement is going to be valid and then update the game state
     * @param adversaryKey: the key of the adversary that is trying to move
     * @param dest: the location that the adversary is going to move to
     */

  }, {
    key: "adversaryMovement",
    value: function adversaryMovement(adversaryKey) {
      var rulechecker = new RuleChecker(this);
      var adversary = new Adversary(this.adversaries[adversaryKey]);
      this.adversaries[adversaryKey].updatePlayerLocations(this.players);
      var dest = this.adversaries[adversaryKey].chooseDestination();
      this.moveAdversary(adversaryKey, dest);

      if (rulechecker.anyPlayersOnDest(dest)) {
        var playerName = this.getPlayerOnDest(dest);
        return playerName;
      }
    }
    /**
     * @desc returns the name of the player on the given destination, if none return null
     * @param dest: the location that is being checked for a player
     */

  }, {
    key: "getPlayerOnDest",
    value: function getPlayerOnDest(dest) {
      for (var _i = 0, _Object$values = Object.values(this.players); _i < _Object$values.length; _i++) {
        var value = _Object$values[_i];

        if (value.location.row === dest.row && value.location.col == dest.col) {
          return value.name;
        }
      }

      return null;
    }
  }]);

  return GameState;
}();

module.exports = GameState; // export default GameState;