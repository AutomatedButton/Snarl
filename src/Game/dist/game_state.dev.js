"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameState =
/*#__PURE__*/
function () {
  function GameState(layout, players, adversaries, rooms, exit) {
    _classCallCheck(this, GameState);

    this.layout = layout;
    this.players = players;
    this.adversaries = adversaries;
    this.rooms = rooms;
    this.exit = exit;
  }
  /**
       * @desc Checks if the player movement is going to be valid and then update the game state
       * @param player: the player that is trying to move
       * @param chosenLocation: the location that the player is trying to move to
       */


  _createClass(GameState, [{
    key: "playerMovement",
    value: function playerMovement(player, chosenLocation) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i] = player) {
          this.players[i].location = chosenLocation;
          break;
        }
      }
    }
    /**
     * @desc Checks if the adversary movement is going to be valid and then update the game state
     * @param adversary: the adversary that is trying to move
     * @param chosenLocation: the location that the adversary is going to move to
     */

  }, {
    key: "adversaryMovement",
    value: function adversaryMovement(adversary, givenLocation) {
      for (var i = 0; i < this.adversaries.length; i++) {
        if (this.adversaries[i] = adversary) {
          this.location[i].location = givenLocation;
          break;
        }
      }
    }
  }]);

  return GameState;
}();

var _default = GameState;
exports["default"] = _default;