"use strict";

var _level = _interopRequireDefault(require("./level.js"));

var _render = _interopRequireDefault(require("./render.js"));

var _game_state = _interopRequireDefault(require("./game_state.js"));

var _rule_checker = _interopRequireDefault(require("./rule_checker.js"));

var _player = _interopRequireDefault(require("./player.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameManager =
/*#__PURE__*/
function () {
  function GameManager(gamestate, lv) {
    _classCallCheck(this, GameManager);

    this.lv = lv;
    this.gamestate = gamestate;
    this.turn = "Players";
    this.playersTurn = null;
    this.gameStarted = false;
  }

  _createClass(GameManager, [{
    key: "registerAdversary",
    value: function registerAdversary() {
      var numAdv = Math.floor(Math.random() * (4 - 1) + 1);
      this.lv.createAdversaries(numAdv);
      this.gamestate.adversaries = this.lv.adversaries;
      var rend = new _render["default"](this.gamestate);
      console.log(this.gamestate);
      rend.RenderInit();
    }
  }, {
    key: "playerNameAlreadyRegister",
    value: function playerNameAlreadyRegister(playerName) {
      for (var i = 0; i < this.lv.players.length; i++) {
        if (this.lv.players[i].name == playerName) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "registerPlayer",
    value: function registerPlayer(playerName) {
      if (!this.playerNameAlreadyRegister(playerName)) {
        this.lv.createPlayer(playerName);
        this.gamestate.players = this.lv.players;
        var rend = new _render["default"](this.gamestate);
        rend.RenderInit();
      } else {
        console.log("Player Name is already registered");
      }
    }
  }, {
    key: "setNextPlayersTurn",
    value: function setNextPlayersTurn() {
      for (var i = 0; i < this.lv.players.length; i++) {
        if (this.lv.players[i].name == this.playersTurn.name) {
          if (this.lv.players[i + 1] != undefined) {
            this.playersTurn = this.lv.players[i + 1];
          } else {
            this.playersTurn = this.lv.players[0];
          }

          break;
        }
      }
    }
  }, {
    key: "requestPlayerMove",
    value: function requestPlayerMove(player) {
      console.log(player);
      var requestedDest = {
        row: this.gamestate.players[0].location.row + 1,
        col: this.gamestate.players[0].location.col + 1
      };

      if (this.gameStarted) {
        var ruleChecker = new _rule_checker["default"](this.gamestate);
        var gameState = ruleChecker.isLegalPlayerMove(player, requestedDest);
        console.log("newgamestate", gameState);

        if (gameState == false) {
          console.log("Illegal Move");
        } else {
          var rend = new _render["default"](gameState);
          rend.RenderInit();
          this.setNextPlayersTurn();
        }
      } else {
        console.log("Game has not started yet!");
      }
    }
  }, {
    key: "onAdversaryMove",
    value: function onAdversaryMove(adversay, dest) {
      var ruleChecker = new _rule_checker["default"](this.gamestate);
      var gameState = ruleChecker.isLegalAdversaryMove(adversay, dest);
      console.log("newgamestate", gameState);
      var rend = new _render["default"](gameState);

      if (gameState == false) {
        console.log("Illegal Move");
      } else {
        rend.RenderInit();
      }
    }
  }]);

  return GameManager;
}();

window.onload = function () {
  // var btncontext = button.getContext('2d');
  var lv = new _level["default"]();
  lv.makeLevel();
  var gamestate = new _game_state["default"](lv.gameLevel, [], [], lv.rooms, false);
  var ruleChecker = new _rule_checker["default"](gamestate);
  var gamemanager = new GameManager(gamestate, lv);
  gamemanager.registerPlayer("Nilay");

  if (ruleChecker.validateGameState()) {
    gamemanager.registerPlayer("Bob");
    console.log(gamemanager.gamestate);
    gamemanager.registerAdversary();
    var rend = new _render["default"](gamestate);
    rend.RenderInit();
    var button = document.getElementById("start-btn");
    console.log(button);

    button.onclick = function () {
      if (!gamemanager.gameStarted) {
        console.log("Game Started");
        gamemanager.gameStarted = true;
        gamemanager.playersTurn = gamemanager.gamestate.players[0];
        gamemanager.requestPlayerMove(gamemanager.playersTurn);
        console.log(gamemanager);
      }
    };
  }
};