"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @desc RuleChecker checks all of the rules in the game
 * @param gamestate: the current gamestate of the game
 */
var RuleChecker =
/*#__PURE__*/
function () {
  function RuleChecker(gamestate) {
    _classCallCheck(this, RuleChecker);

    this.gamestate = gamestate;
  }
  /**
   * @desc Validates the game state by checking that there is only one key and one exit
   */


  _createClass(RuleChecker, [{
    key: "validateGameState",
    value: function validateGameState() {
      if (!this.hasOne("key") && !this.hasOne("exit")) {
        throw new Error("Invalid Game State Exception: Invalid number of Keys and Exits");
      } else if (!this.hasOne("exit")) {
        throw new Error("Invalid Game State Exception: Invalid number of Exits");
      } else if (!this.hasOne("key")) {
        throw new Error("Invalid Game State Exception: Invalid number of Keys");
      }

      return true;
    }
    /**
     * @desc Returns true if the gamestate objects map has one tileType key
     * @param tileType: the tile type that needs to be checked
     */

  }, {
    key: "hasOne",
    value: function hasOne(tileType) {
      return this.gamestate.objects[tileType] !== undefined;
    }
    /**
     * @desc Returns true if the given destination is a valid move for the given player
     * @param playerName: The name of the player that is trying to move
     * @param dest: the requested player destination
     */

  }, {
    key: "isLegalPlayerMove",
    value: function isLegalPlayerMove(playerName, dest) {
      var playerPos = this.gamestate.players[playerName].location;

      if (this.twoPosEqual(playerPos, dest)) {
        return true;
      }

      if (this.anyPlayersOnDest(dest)) {
        return false;
      }

      if (!this.isNotWallTile(dest)) {
        return false;
      }

      if (Math.abs(playerPos.row - dest.row) + Math.abs(playerPos.col - dest.col) <= 2) {
        if (Math.abs(playerPos.row - dest.row) === 1 && Math.abs(playerPos.col - dest.col) === 1) {
          if ((this.anyPlayersOnDest({
            row: playerPos.row,
            col: dest.col
          }) || !this.isNotWallTile({
            row: playerPos.row,
            col: dest.col
          }) || this.anyAdversaryOnDest({
            row: playerPos.row,
            col: dest.col
          })) && (this.anyPlayersOnDest({
            row: dest.row,
            col: playerPos.col
          }) || !this.isNotWallTile({
            row: dest.row,
            col: playerPos.col
          }) || this.anyAdversaryOnDest({
            row: dest.row,
            col: playerPos.col
          }))) {
            return false;
          }
        }

        return true;
      } else {
        return false;
      }
    }
    /**
     * @desc Returns the adversary if there is one on the chosen location
     * @param dest: the requested destination
     */

  }, {
    key: "playerAttack",
    value: function playerAttack(dest) {
      for (var _i = 0, _Object$entries = Object.entries(this.gamestate.adversaries); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (value.location.row === dest.row && value.location.col === dest.col) {
          return key;
        }
      }
    }
    /**
     * @desc Returns true if the given destination has a player on it
     * @param dest: the requested destination
     */

  }, {
    key: "anyPlayersOnDest",
    value: function anyPlayersOnDest(dest) {
      for (var _i2 = 0, _Object$values = Object.values(this.gamestate.players); _i2 < _Object$values.length; _i2++) {
        var value = _Object$values[_i2];

        if (this.twoPosEqual(value.location, dest) && !value.exited) {
          return true;
        }
      }

      return false;
    }
    /**
     * @desc Checks to see if the given destination is a valid move for the given adversary
     * @param adversary
     */

  }, {
    key: "isLegalAdversaryMove",
    value: function isLegalAdversaryMove(adversary, dest) {
      var adversaryPos = this.gamestate.adversaries[adversary].location;

      if (this.anyAdversaryOnDest(dest)) {
        return false;
      }

      if (!(this.isOnSameRow(dest, adversaryPos) || this.isOnSameCol(dest, adversaryPos) || this.isOnCorner(dest, adversaryPos))) {
        return false;
      } else {
        return this.adversaryInteractions(adversary, dest);
      }
    }
    /**
     * @desc Returns true if the given destination has an adversary on it
     * @param dest: the requested destination
     */

  }, {
    key: "anyAdversaryOnDest",
    value: function anyAdversaryOnDest(dest) {
      var adversaries = this.gamestate.adversaries;

      for (var _i3 = 0, _Object$values2 = Object.values(adversaries); _i3 < _Object$values2.length; _i3++) {
        var value = _Object$values2[_i3];

        if (value.location.row === dest.row && value.location.col === dest.col) {
          return true;
        }
      }

      return false;
    }
    /**
     * @desc Checks if the two given positions are equal
     * @param pos1: the first given position
     * @param pos2: the second given position
     */

  }, {
    key: "twoPosEqual",
    value: function twoPosEqual(pos1, pos2) {
      return pos1.row === pos2.row && pos1.col === pos2.col;
    }
    /**
     * @desc Checks if there is an adversary on the given player's requested destination
     * @param dest: the requested player destination
     */

  }, {
    key: "isPlayerExpelled",
    value: function isPlayerExpelled(dest) {
      for (var _i4 = 0, _Object$values3 = Object.values(this.gamestate.adversaries); _i4 < _Object$values3.length; _i4++) {
        var value = _Object$values3[_i4];

        if (this.twoPosEqual(value.location, dest)) {
          return true;
        }
      }

      return false;
    }
    /**
     * @desc Checks if the key is on the given destination to be collected
     * @param dest: the requested player destination
     */

  }, {
    key: "isKeyCollected",
    value: function isKeyCollected(dest) {
      if (this.gamestate.objects["key"]) {
        var keyLoc = this.gamestate.objects["key"].location;
        return this.twoPosEqual(keyLoc, dest);
      }
    }
    /**
     * @desc Checks if exit is unlocked and the given destination is the exit for the player to exit the level
     * @param dest: the requested player destination
     */

  }, {
    key: "isPlayerExited",
    value: function isPlayerExited(dest) {
      if (this.gamestate.exitUnlocked) {
        var exitLoc = this.gamestate.objects["exit"].location;
        return this.twoPosEqual(exitLoc, dest);
      } else {
        return false;
      }
    }
    /**
     * @desc Checks if the level has ended when all of the players have exited the current level
     */

  }, {
    key: "isEndOfLevel",
    value: function isEndOfLevel() {
      for (var _i5 = 0, _Object$values4 = Object.values(this.gamestate.players); _i5 < _Object$values4.length; _i5++) {
        var value = _Object$values4[_i5];

        if (!value.exited) {
          return false;
        }
      }

      return true;
    }
    /**
     * @desc Checks if the game has ended when all of the players have been expelled
     */

  }, {
    key: "isEndOfGame",
    value: function isEndOfGame() {
      if (this.gamestate.players.size == 0) {
        console.log("End of Game");
        return true;
      }

      return false;
    }
    /**
     * @desc Returns true if the given position is not a wall tile
     * @param pos: the given position
     */

  }, {
    key: "isNotWallTile",
    value: function isNotWallTile(pos) {
      try {
        return this.gamestate.layout[pos.row][pos.col].tileType != "wall";
      } catch (_unused) {
        return false;
      }
    } // exitUnreachable() {}
    // roomsOverlap() {}
    // hallwaysOverlap() {}

  }]);

  return RuleChecker;
}();

module.exports = RuleChecker; // export default RuleChecker;