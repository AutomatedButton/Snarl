"use strict";

var _Level = _interopRequireDefault(require("../Game/Level.js"));

var _GameState = _interopRequireDefault(require("../Game/GameState.js"));

var _GameManager = _interopRequireDefault(require("../Game/GameManager.js"));

var _LocalObserver = _interopRequireDefault(require("../Observer/LocalObserver.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var startbutton = document.getElementById("start-btn");
/**
 * @desc Start the game on a button click
 */

startbutton.onclick = function _callee() {
  var startLevel, allLevels, lv, gamestate, gamemanager, observer, localObserver, observerWind, status, gameover, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          startLevel = document.getElementById("level").value; // Set Default Level Number to 1

          if (startLevel === null || startLevel === "") {
            startLevel = 1;
          } // Read Levels file and check validity of file


          _context.next = 4;
          return regeneratorRuntime.awrap(createLevel());

        case 4:
          allLevels = _context.sent;

          if (!(allLevels[startLevel - 1] === undefined)) {
            _context.next = 8;
            break;
          }

          alert("Invalid Start Level");
          return _context.abrupt("return");

        case 8:
          lv = new _Level["default"]();
          lv.makeGivenLevel(allLevels[startLevel - 1]);
          gamestate = new _GameState["default"](lv.gameLevel, new Map(), new Map(), lv.objects, lv.rooms, false);
          gamemanager = new _GameManager["default"](gamestate, lv, allLevels);
          gamemanager.lvNum = startLevel;
          observer = document.getElementById("observe").checked;

          if (observer) {
            localObserver = new _LocalObserver["default"]();
            observerWind = window.open("");
            initializeObserver(observerWind);
          }

          registerPlayers(gamemanager);
          gamemanager.registerAdversaries();
          gamemanager.playersTurn = getFirstPlayer(gamestate.players);

        case 18:
          if (!(gamemanager.playersTurn !== null)) {
            _context.next = 26;
            break;
          }

          updateLocalPlayers(gamemanager);

          if (observer) {
            localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(requestPlayerMove(gamemanager, localObserver, observerWind));

        case 23:
          status = _context.sent;
          _context.next = 18;
          break;

        case 26:
          if (!(status === "Next")) {
            _context.next = 61;
            break;
          }

          gameover = createNextLevel(gamemanager, gamestate, allLevels);

          if (!gameover) {
            _context.next = 33;
            break;
          }

          informUsers(gamemanager, "You won the game!");
          results = getResults(gamemanager);
          informUsers(gamemanager, results);
          return _context.abrupt("break", 61);

        case 33:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 36;

          for (_iterator = gamemanager.localPlayers.keys()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            key = _step.value;
            gamemanager.registerPlayer(key);
          }

          _context.next = 44;
          break;

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](36);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 44:
          _context.prev = 44;
          _context.prev = 45;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 47:
          _context.prev = 47;

          if (!_didIteratorError) {
            _context.next = 50;
            break;
          }

          throw _iteratorError;

        case 50:
          return _context.finish(47);

        case 51:
          return _context.finish(44);

        case 52:
          gamemanager.registerAdversaries();
          gamemanager.playersTurn = getFirstPlayer(gamestate.players);
          updateLocalPlayers(gamemanager);

          if (observer) {
            localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
          }

          _context.next = 58;
          return regeneratorRuntime.awrap(requestPlayerMove(gamemanager, localObserver, observerWind));

        case 58:
          status = _context.sent;
          _context.next = 26;
          break;

        case 61:
          if (status === "Over") {
            informUsers(gamemanager, "You lost on level " + gamemanager.lvNum);
            results = getResults(gamemanager);
            informUsers(gamemanager, results);
          }

        case 62:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[36, 40, 44, 52], [45,, 47, 51]]);
};
/**
 * @desc Sorts the game results and returns the key and exit numbers for each player
 * @param gamemanager: current gamemanager
 */


function getResults(gamemanager) {
  var results = "";
  results = results + "Keys\n";
  var keysFoundSorted = new Map(_toConsumableArray(gamemanager.keysFound.entries()).sort(function (a, b) {
    return b[1] - a[1];
  }));
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keysFoundSorted.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          key = _step2$value[0],
          value = _step2$value[1];

      results = results + key + ": " + value + " ";
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  results = results + "\n\nExits\n";
  var exitedPlayersSorted = new Map(_toConsumableArray(gamemanager.exitedPlayers.entries()).sort(function (a, b) {
    return b[1] - a[1];
  }));
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = exitedPlayersSorted.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2),
          _key = _step3$value[0],
          _value = _step3$value[1];

      results = results + _key + ": " + _value + " ";
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return results;
}
/**
 * @desc Sets the next level, returns true if there are no more levels and false if there are more levels
 * @param gamemanager: current gamemanager
 */


function createNextLevel(gamemanager, gamestate, allLevels) {
  if (allLevels[gamemanager.lvNum] !== undefined) {
    gamemanager.lvNum = gamemanager.lvNum + 1;
    var lv = new _Level["default"]();
    lv.makeGivenLevel(allLevels[gamemanager.lvNum - 1]);
    var gamestate = new _GameState["default"](lv.gameLevel, new Map(), new Map(), lv.objects, lv.rooms, false);
    gamemanager.gamestate = gamestate;
    gamemanager.lv = lv;
    return false;
  }

  return true;
}
/**
 * @desc Returns an array of all of the levels by reading the file
 * @param file: all levels file
 */


function readFileAsync(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var levels = [];
    reader.readAsText(file);

    reader.onload = function () {
      var levelsFile = reader.result; // Split level file by new line

      var lines = levelsFile.split("\n");
      var level = ""; // Start after the natural number line

      for (var i = 2; i < lines.length; i++) {
        // if end of file
        if (lines[i].replace(/\s/g, "") !== "") {
          level = level + lines[i];
        } else {
          levels.push(JSON.parse(level));
          level = "";
        } // If reach second to last line in file


        if (i === lines.length - 1) {
          levels.push(JSON.parse(level));
          level = "";
        }
      }

      resolve(levels);
    };

    reader.onerror = reject;
  });
}
/**
 * @desc Returns an array of all of the levels in the file that is given by the user
 */


function createLevel() {
  var levels_input, file, levels;
  return regeneratorRuntime.async(function createLevel$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          levels_input = document.getElementById("levels");
          file = levels_input.files[0];
          _context2.next = 4;
          return regeneratorRuntime.awrap(readFileAsync(file));

        case 4:
          levels = _context2.sent;
          return _context2.abrupt("return", levels);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/**
 * @desc Initializes the observer view
 * @param observerWind: the observer's window
 */


function initializeObserver(observerWind) {
  var canvas = observerWind.document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  observerWind.document.body.appendChild(canvas);
  observerWind.document.title = "Observer";
}
/**
 * @desc Registers all of the players and creates a local window
 * @param gamemanager: the gamemanager
 */


function registerPlayers(gamemanager) {
  var playersNum = document.getElementById("players").value;

  if (playersNum === null || playersNum === "") {
    playersNum = 1;
  } else if (playersNum < 1 || playersNum > 4) {
    alert("Invalid number of players");
    return;
  }

  for (var i = 0; i < playersNum; i++) {
    var wind = window.open("");
    var div = document.createElement("div");
    div.setAttribute("id", "flex-container");
    div.style.display = "flex";
    wind.document.body.appendChild(div);
    var div = document.createElement("div");
    div.setAttribute("id", "game");
    div.style.flex = 1;
    wind.document.getElementById("flex-container").appendChild(div);
    var canvas = wind.document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    wind.document.getElementById("game").appendChild(canvas);
    createUpdates(wind);
    var playerName = wind.prompt("What is Player " + (i + 1) + " name?");
    var valid = false;

    while (!valid) {
      if (playerName === null || playerName === "") {
        playerName = wind.prompt("What is Player " + (i + 1) + " name?");
      } else {
        var dupName = gamemanager.registerPlayer(playerName);

        if (dupName) {
          wind.alert("Cannot register duplicate name: " + playerName);
          playerName = "";
        } else {
          gamemanager.window.set(playerName, wind);
          wind.document.title = playerName;
          valid = true;
        }
      }
    }
  }
}
/**
 * @desc Returns the first player that registered
 * @param players: list of all of the players in the game
 */


function getFirstPlayer(players) {
  return Array.from(players.keys())[0];
}
/**
 * @desc Initializes the on page view of the player updates
 * @param window: given window that the updates should be created on
 */


function createUpdates(window) {
  var div = document.createElement("div");
  div.setAttribute("id", "player-updates");
  div.style.flex = 1;
  window.document.getElementById("flex-container").appendChild(div);
  var label = window.document.createElement("p");
  label.setAttribute("id", "current-location-label");
  window.document.getElementById("player-updates").appendChild(label);
  var label = window.document.createElement("p");
  label.setAttribute("id", "nearby-players-label");
  window.document.getElementById("player-updates").appendChild(label);
  var label = window.document.createElement("p");
  label.setAttribute("id", "nearby-adversaries-label");
  window.document.getElementById("player-updates").appendChild(label);
  var label = window.document.createElement("p");
  label.setAttribute("id", "nearby-objects-label");
  window.document.getElementById("player-updates").appendChild(label);
  var label = window.document.createElement("p");
  label.setAttribute("id", "exit-unlocked-label");
  window.document.getElementById("player-updates").appendChild(label);
  var label = window.document.createElement("p");
  label.setAttribute("id", "current-player-turn");
  window.document.getElementById("player-updates").appendChild(label);
}
/**
 * @desc Updates all of the local players with all of the surroundings updates
 * @param gamemanager: current gamemanager
 */


function updateLocalPlayers(gamemanager) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = gamemanager.localPlayers.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var key = _step4.value;
      gamemanager.localPlayers.get(key).updateLocalPlayer(gamemanager.gamestate.players.get(key).location, gamemanager.getNearbyPlayers(key), gamemanager.getNearbyAdversaries(key), gamemanager.getNearbyObjects(key), gamemanager.gamestate.exitUnlocked, gamemanager.window.get(key), gamemanager.playersTurn);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}
/**
 * @desc Async request to the current players turn to make a move. Returns Next if the level is over and Over if the game is over
 * @param gamemanager: current gamemanager
 * @param localObserver: the localobserver
 * @param observerWind: the observer window
 */


function requestPlayerMove(gamemanager, localObserver, observerWind) {
  var successfulMove;
  return regeneratorRuntime.async(function requestPlayerMove$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(gamemanager.playersTurn !== null)) {
            _context3.next = 7;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(gamemanager.requestPlayerMove(gamemanager.playersTurn));

        case 3:
          successfulMove = _context3.sent;

          if (successfulMove) {
            if (localObserver !== undefined) {
              localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
            }

            updateLocalPlayers(gamemanager);
          }

          _context3.next = 0;
          break;

        case 7:
          if (!(gamemanager.gamestate.players.size === 0)) {
            _context3.next = 12;
            break;
          }

          console.log("Game Over");
          return _context3.abrupt("return", "Over");

        case 12:
          console.log("Level Over");
          return _context3.abrupt("return", "Next");

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/**
 * @desc ALerts all of the users with the given message
 * @param gamemanager: current gamemanager
 * @param message: message to be sent to all users
 */


function informUsers(gamemanager, message) {
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = gamemanager.window.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var value = _step5.value;
      value.alert(message);
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
        _iterator5["return"]();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
}