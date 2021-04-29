"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Render = require("./Render");

var LocalPlayer = require("../Player/LocalPlayer");

var RuleChecker = require("./RuleChecker");

var GameState = require("./GameState");
/**
 * @desc GameManager manages the changing of the gamestate
 * @param lv: the current Level of the game
 * @param gamestate: the current gamestate of the game
 * @param playersTurn: the current players turn (null if game has not started)
 * @param gameStarted: Boolean indicating if the game has started yet or not
 */


var GameManager =
/*#__PURE__*/
function () {
  function GameManager(gamestate, lv, allLevels) {
    _classCallCheck(this, GameManager);

    if (lv === undefined && allLevels === undefined) {
      gamestate && Object.assign(this, gamestate);
    } else {
      this.lvNum = 0;
      this.lv = lv;
      this.gamestate = gamestate;
      this.localPlayers = {};
      this.playersTurn = null;
      this.window = {};
      this.allLevels = allLevels;
      this.keysFound = {};
      this.exitedPlayers = {};
      this.ejects = {};
      this.validateGamestate();
    }
  }
  /**
   * @desc Validates the gamestate
   */


  _createClass(GameManager, [{
    key: "validateGamestate",
    value: function validateGamestate() {
      this.gamestate.validateGameState();
    }
    /**
     * @desc Registers a player with the given player name
     * @param playerName: the name of the player that has been registered
     */

  }, {
    key: "registerPlayer",
    value: function registerPlayer(playerName) {
      if (this.playerNameNotRegister(playerName) && Object.keys(this.gamestate.players).length <= 4) {
        // New player in the first level creation
        if (!this.localPlayers[playerName]) {
          this.keysFound[playerName] = 0;
          this.exitedPlayers[playerName] = 0;
          this.ejects[playerName] = 0;
          var localPlayer = new LocalPlayer(playerName);
          this.localPlayers[playerName] = localPlayer;
        }

        this.lv.createPlayer(playerName);
        this.gamestate.players = this.lv.players;
        this.updateRendering();
      } else {
        return true;
      }
    }
    /**
     * @desc Registers a random number of the adversaries in the game
     */

  }, {
    key: "registerAdversaries",
    value: function registerAdversaries() {
      var ghostsNum = Math.floor((this.lvNum - 1) / 2);
      var zombNum = Math.floor(this.lvNum / 2) + 1;
      this.lv.createAdversaries(ghostsNum, zombNum);
      this.gamestate.adversaries = this.lv.adversaries;
      this.updateRendering();
    }
    /**
     * @desc Returns true if a player with the given name has not been registered
     * @param playerName: the player name that is being checked if it has not been registered
     */

  }, {
    key: "playerNameNotRegister",
    value: function playerNameNotRegister(playerName) {
      return this.gamestate.players[playerName] === undefined;
    }
    /**
     * @desc Gets the players that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */

  }, {
    key: "getNearbyPlayers",
    value: function getNearbyPlayers(playerName) {
      var nearbyPlayers = [];
      var localPlayerLoc = this.gamestate.players[playerName].location;

      for (var _i = 0, _Object$values = Object.values(this.gamestate.players); _i < _Object$values.length; _i++) {
        var value = _Object$values[_i];

        if (Math.abs(localPlayerLoc.row - value.location.row) <= 2 && Math.abs(localPlayerLoc.col - value.location.col) <= 2 && playerName !== value.name) {
          var nearbyPlayer = {};
          nearbyPlayer["name"] = value.name;
          nearbyPlayer["location"] = value.location;
          nearbyPlayers.push(nearbyPlayer);
        }
      }

      return nearbyPlayers;
    }
    /**
     * @desc Gets the adversaries that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */

  }, {
    key: "getNearbyAdversaries",
    value: function getNearbyAdversaries(playerName) {
      var nearbyAdversaries = [];
      var localPlayerLoc = this.gamestate.players[playerName].location;

      for (var _i2 = 0, _Object$values2 = Object.values(this.gamestate.adversaries); _i2 < _Object$values2.length; _i2++) {
        var value = _Object$values2[_i2];

        if (Math.abs(localPlayerLoc.row - value.location.row) <= 2 && Math.abs(localPlayerLoc.col - value.location.col) <= 2) {
          var adversaryUpdate = {};
          adversaryUpdate["type"] = value["type"];
          adversaryUpdate["location"] = value["location"];
          adversaryUpdate["health"] = value["health"];
          nearbyAdversaries.push(adversaryUpdate);
        }
      }

      return nearbyAdversaries;
    }
    /**
     * @desc Gets the objects that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */

  }, {
    key: "getNearbyObjects",
    value: function getNearbyObjects(playerName) {
      var nearbyObjects = [];
      var localPlayerLoc = this.gamestate.players[playerName].location;

      for (var _i3 = 0, _Object$entries = Object.entries(this.gamestate.objects); _i3 < _Object$entries.length; _i3++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (Math.abs(localPlayerLoc.row - value.location.row) <= 2 && Math.abs(localPlayerLoc.col - value.location.col) <= 2) {
          var nearbyObj = {};
          nearbyObj[key] = value.location;
          nearbyObjects.push(nearbyObj);
        }
      }

      return nearbyObjects;
    }
    /**
     * @desc Gets a 5x5 grid with the player in the center as the player's view
     * @param playerName: the player name that is being used
     */

  }, {
    key: "getPlayerLayout",
    value: function getPlayerLayout(playerName) {
      var nearbyLayout = [];

      for (var row = 0; row < this.gamestate.layout.length - 1; row++) {
        for (var col = 0; col < this.gamestate.layout.length - 1; col++) {
          var tile = this.gamestate.layout[row][col];

          if (Math.abs(this.gamestate.players[playerName].location.row - row) <= 2 && Math.abs(this.gamestate.players[playerName].location.col - col) <= 2) {
            nearbyLayout.push(tile);
          }
        }
      }

      return nearbyLayout;
    }
    /**
     * @desc Requests the location that the player would like to move to
     * @param playerName: the player name that is requesting to move successful
     */

  }, {
    key: "requestPlayerMove",
    value: function requestPlayerMove(playerName) {
      var rulechecker, requestedDest, successfulMove;
      return regeneratorRuntime.async(function requestPlayerMove$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              rulechecker = new RuleChecker(this.gamestate); // const playersTurnWindow = this.window[playerName];

              _context.next = 3;
              return regeneratorRuntime.awrap(this.localPlayers[playerName].provideMove());

            case 3:
              requestedDest = _context.sent;
              successfulMove = this.gamestate.playerMovement(playerName, requestedDest);

              if (successfulMove[0]) {
                this.keysFound[playerName] = this.keysFound[playerName] + 1; // for (let value of Object.values(this.window)) {
                //     value.alert("Player " + playerName + " found the key");
                // }
              } else if (successfulMove[1]) {
                this.exitedPlayers[playerName] = this.exitedPlayers[playerName] + 1; // for (let value of Object.values(this.window)) {
                //     value.alert("Player " + playerName + " exited");
                // }
              }

              if (successfulMove !== false) {
                this.localPlayers[playerName].updateLocalPlayer(this.gamestate.players[playerName].location, this.getNearbyPlayers(playerName), this.getNearbyAdversaries(playerName), this.getNearbyObjects(playerName), this.gamestate.exitUnlocked, // this.window[playerName],
                this.playersTurn);
                this.updateRendering();

                if (successfulMove[2] === true) {
                  this.gamestate.expelPlayer(playerName);
                } // this.updateWindowList();
                // Checks if all players have been expelled


                if (this.gamestate.players.size === 0) {
                  this.playersTurn = null;
                } else {
                  this.setNextPlayersTurn();
                }

                if (rulechecker.isEndOfLevel()) {
                  this.endLevel();
                } // if (rulechecker.isEndOfGame()) {
                //     this.endGame();
                // }

              }

              return _context.abrupt("return", successfulMove);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
    /**
     * @desc Alerts all of the players if a player is expelled
     */

  }, {
    key: "updateWindowList",
    value: function updateWindowList() {
      for (var _i4 = 0, _Object$keys = Object.keys(this.window); _i4 < _Object$keys.length; _i4++) {
        var key = _Object$keys[_i4];

        if (!this.gamestate.players[key]) {
          for (var _i5 = 0, _Object$values3 = Object.values(this.window); _i5 < _Object$values3.length; _i5++) {
            var value = _Object$values3[_i5];
            value.alert("Player " + key + " was expelled");
          }

          delete this.window[key];
        }
      }
    }
    /**
     * @desc Randomly moves all of the adversaries in the game
     */

  }, {
    key: "onAdversaryMove",
    value: function onAdversaryMove() {
      for (var _i6 = 0, _Object$keys2 = Object.keys(this.gamestate.adversaries); _i6 < _Object$keys2.length; _i6++) {
        var key = _Object$keys2[_i6];
        var expelPlayerName = this.gamestate.adversaryMovement(key);
        this.updateRendering();

        if (expelPlayerName) {
          this.gamestate.expelPlayer(expelPlayerName);
        } // Checks if all players have been expelled


        if (this.gamestate.players.size === 0) {
          this.playersTurn = null;
        } // this.updateWindowList();

      }

      return this.gamestate.players;
    }
    /**
     * @desc Sets the next players turn and if all players have moved, call the function to move the adversaries
     */

  }, {
    key: "setNextPlayersTurn",
    value: function setNextPlayersTurn() {
      var players = Array.from(Object.keys(this.gamestate.players));

      if (players.length === 0) {
        this.playersTurn = null;
      }

      for (var i = 0; i < players.length; i++) {
        if (players[i].exited) {
          players.splice(i, 1);
        }
      }

      if (this.allPlayersExited()) {
        this.playersTurn = null;
        var turnNotSet = false;
        return;
      }

      var playerIndex = players.indexOf(this.playersTurn);
      var curIndex = playerIndex;

      if (players[curIndex + 1] === undefined) {
        curIndex = 0;
      } else {
        curIndex = playerIndex + 1;
      }

      var turnNotSet = true;

      settingTurn: for (var i = 0; i < players.length + 1; i++) {
        if (players[curIndex] === undefined) {
          curIndex = 0;
          continue settingTurn;
        } else if (this.gamestate.players[players[curIndex]].exited) {
          curIndex++;
          continue settingTurn;
        } else {
          this.playersTurn = players[curIndex];
          turnNotSet = false;
          break;
        }
      }

      if (turnNotSet) {
        this.playersTurn = null;
      }
    }
  }, {
    key: "updateRendering",
    value: function updateRendering() {
      for (var _i7 = 0, _Object$entries2 = Object.entries(this.window); _i7 < _Object$entries2.length; _i7++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i7], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];

        if (this.gamestate.players[key]) {
          var rend = new Render(this.gamestate, value, this.gamestate.players[key]);
          rend.RenderInit();
        }
      }
    }
    /**
     * @desc Returns true if all players have exited
     */

  }, {
    key: "allPlayersExited",
    value: function allPlayersExited() {
      for (var _i8 = 0, _Object$values4 = Object.values(this.gamestate.players); _i8 < _Object$values4.length; _i8++) {
        var value = _Object$values4[_i8];

        if (!value.exited) {
          return false;
        }
      }

      return true;
    }
    /**
     * @desc Ends the level
     */

  }, {
    key: "endLevel",
    value: function endLevel() {
      this.playersTurn = null;
    }
    /**
     * @desc Ends the game
     */

  }, {
    key: "endGame",
    value: function endGame() {
      console.log("Game has ended.");
    }
  }]);

  return GameManager;
}();

module.exports = GameManager;