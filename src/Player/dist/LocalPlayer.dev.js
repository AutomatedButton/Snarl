"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @desc LocalPlayer holds the information of a user
 * @param name: The name of the local player that matches with a player in the game
 */
var LocalPlayer =
/*#__PURE__*/
function () {
  function LocalPlayer(name) {
    _classCallCheck(this, LocalPlayer);

    this.name = name;
    this.removed = false;
  }
  /**
   * @desc Updates the local player with information about their surroundings
   * @param playersLocation: the local player's current location
   * @param players: players thare are in a 5x5 square near the local player
   * @param adversaries: adversaries thare are in a 5x5 square near the local player
   * @param objects: objects thare are in a 5x5 square near the local player
   * @param exitUnlocked: boolean if the current level exit is unlocked or not
   */


  _createClass(LocalPlayer, [{
    key: "updateLocalPlayer",
    value: function updateLocalPlayer(playersLocation, players, adversaries, objects, exitUnlocked, window, currentPlayersTurn) {
      var nearbyPlayers = window.document.getElementById("nearby-players-label");
      nearbyPlayers.innerHTML = "Nearby Players: " + JSON.stringify(players);
      var curLocation = window.document.getElementById("current-location-label");
      curLocation.innerHTML = "Current Location: " + JSON.stringify(playersLocation);
      var nearbyAdversaries = window.document.getElementById("nearby-adversaries-label");
      nearbyAdversaries.innerHTML = "Nearby Adversaries: " + JSON.stringify(adversaries);
      var nearbyObjects = window.document.getElementById("nearby-objects-label");
      nearbyObjects.innerHTML = "Nearby Objects: " + JSON.stringify(objects);
      var nearbyExit = window.document.getElementById("exit-unlocked-label");
      nearbyExit.innerHTML = "Is Exit Unlocked: " + JSON.stringify(exitUnlocked);
      var currentPlayersTurnLabel = window.document.getElementById("current-player-turn");
      currentPlayersTurnLabel.innerHTML = "Current Player's Turn: " + currentPlayersTurn;
    }
    /**
     * @desc Waits for the user to click on a tile that they are requesting to move to
     */

  }, {
    key: "provideMove",
    value: function provideMove() {
      var timeout, row, col;
      return regeneratorRuntime.async(function provideMove$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              timeout = function timeout(ms) {
                return regeneratorRuntime.async(function timeout$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt("return", new Promise(function (res) {
                          return setTimeout(res, ms);
                        }));

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              };

              row = undefined;
              col = undefined;
              canvas.addEventListener("click", function (event) {
                row = Math.floor(event.pageY / 30 - 0.25);
                col = Math.floor(event.pageX / 30 - 0.25);
              });

            case 4:
              if (!(row === undefined)) {
                _context2.next = 9;
                break;
              }

              _context2.next = 7;
              return regeneratorRuntime.awrap(timeout(50));

            case 7:
              _context2.next = 4;
              break;

            case 9:
              return _context2.abrupt("return", {
                row: row,
                col: col
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }]);

  return LocalPlayer;
}();

module.exports = LocalPlayer; // export default LocalPlayer;