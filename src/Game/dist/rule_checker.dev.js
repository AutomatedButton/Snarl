"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RuleChecker =
/*#__PURE__*/
function () {
  function RuleChecker(gamestate) {
    _classCallCheck(this, RuleChecker);

    this.gamestate = gamestate;
  }

  _createClass(RuleChecker, [{
    key: "validateGameState",
    value: function validateGameState() {
      if (this.hasOne("key") && this.hasOne("exit") && this.validNumPlayers()) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "getExit",
    value: function getExit() {
      for (var i = 0; i < this.gamestate.layout.length; i++) {
        for (var j = 0; j < this.gamestate.layout.length; j++) {
          if (this.gamestate.layout[i][j].tileType == "exit") {
            return this.gamestate.layout[i][j].location;
          }
        }
      }
    }
  }, {
    key: "endOfLevel",
    value: function endOfLevel() {
      var exit = this.getExit();

      for (var i = 0; i < this.gamestate.players.length; i++) {
        if (this.gamestate.players[i].location.row != exit.row && this.gamestate.players[i].location.col != exit.col) {
          console.log(this.gamestate.players[i]);
          return false;
        }
      }

      return true;
    }
  }, {
    key: "endOfGame",
    value: function endOfGame() {
      if (this.gamestate.players.length == 0) {
        console.log("End of Game");
        return true;
      }

      return false;
    }
  }, {
    key: "adversaryOnDest",
    value: function adversaryOnDest(dest) {
      var adversaries = this.gamestate.adversaries;

      for (var i = 0; i < adversaries.length; i++) {
        if (adversaries[i].location.row === dest.row && adversaries[i].location.col === dest.col) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "expelPlayer",
    value: function expelPlayer(player) {
      var players = this.gamestate.players;

      for (var i = 0; i < players.length; i++) {
        if (players[i].name === player.name) {
          this.gamestate.players.splice(i, 1);
        }
      }
    }
  }, {
    key: "collectKey",
    value: function collectKey(dest) {
      this.gamestate.exit = true;
      var row = dest.row;
      var col = dest.col;
      this.gamestate.layout[row][col].tileType = "floor";
    }
  }, {
    key: "keyOnDest",
    value: function keyOnDest(dest) {
      var layout = this.gamestate.layout;

      for (var i = 0; i < layout.length; i++) {
        for (var j = 0; j < layout.length; j++) {
          if (layout[i][j].tileType === "key") {
            if (layout[i][j].location.row === dest.row && layout[i][j].location.col === dest.col) {
              return true;
            }
          }
        }
      }
    }
  }, {
    key: "exitOnDest",
    value: function exitOnDest(dest) {
      var layout = this.gamestate.layout;

      for (var i = 0; i < layout.length; i++) {
        for (var j = 0; j < layout.length; j++) {
          if (layout[i][j].tileType === "exit") {
            if (layout[i][j].location.row === dest.row && layout[i][j].location.col === dest.col) {
              return true;
            }
          }
        }
      }
    }
  }, {
    key: "movePlayer",
    value: function movePlayer(player, dest) {
      for (var i = 0; i < this.gamestate.players.length; i++) {
        if (this.gamestate.players[i] == player) {
          this.gamestate.players[i].location = dest;
        }
      }
    }
  }, {
    key: "playerInteractions",
    value: function playerInteractions(player, dest) {
      if (this.adversaryOnDest(dest)) {
        this.expelPlayer(player);
      }

      if (this.keyOnDest(dest)) {
        this.collectKey(dest);
        this.movePlayer(player, dest);
      }

      if (this.exitOnDest(dest)) {
        this.movePlayer(player, {
          row: -1,
          col: -1
        });

        if (this.gamestate.exit) {
          console.log("Player Exited.");
        } else {
          this.movePlayer(player, dest);
        }
      }

      if (!this.adversaryOnDest(dest) && !this.keyOnDest(dest) && !this.exitOnDest(dest)) {
        this.movePlayer(player, dest);
      }

      if (this.endOfLevel()) {
        console.log("End of Level");
      }

      this.endOfGame();
      return this.gamestate;
    }
  }, {
    key: "getPlayerOnDest",
    value: function getPlayerOnDest(dest) {
      for (var i = 0; i < this.gamestate.players.length; i++) {
        if (this.gamestate.players[i].location.row === dest.row && this.gamestate.players[i].location.col === dest.col) {
          return this.gamestate.players[i];
        }
      }
    }
  }, {
    key: "moveAdversary",
    value: function moveAdversary(adversary, dest) {
      for (var i = 0; i < this.gamestate.adversaries.length; i++) {
        if (this.gamestate.adversaries[i] == adversary) {
          this.gamestate.adversaries[i].location = dest;
        }
      }
    }
  }, {
    key: "adversaryInteractions",
    value: function adversaryInteractions(adversary, dest) {
      if (this.anyPlayersOnDest(dest)) {
        var player = this.getPlayerOnDest(dest);
        this.expelPlayer(player);
      }

      this.moveAdversary(adversary, dest);

      if (this.endOfLevel()) {
        console.log("End of Level");
      }

      this.endOfGame();
      return this.gamestate;
    }
  }, {
    key: "isLegalAdversaryMove",
    value: function isLegalAdversaryMove(adversary, dest) {
      var adversaryPos = adversary.location;

      if (this.anyAdversaryOnDest(dest)) {
        return false;
      }

      if (!(this.isOnSameRow(dest, adversaryPos) || this.isOnSameCol(dest, adversaryPos) || this.isOnCorner(dest, adversaryPos))) {
        return false;
      } else {
        return this.adversaryInteractions(adversary, dest);
      }
    }
  }, {
    key: "anyAdversaryOnDest",
    value: function anyAdversaryOnDest(dest) {
      var adversaries = this.gamestate.adversaries;

      for (var i = 0; i < adversaries.length; i++) {
        if (adversaries[i].location.row === dest.row && adversaries[i].location.col === dest.col) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "anyPlayersOnDest",
    value: function anyPlayersOnDest(dest) {
      var players = this.gamestate.players;

      for (var i = 0; i < players.length; i++) {
        if (players[i].location.row === dest.row && players[i].location.col === dest.col) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isOnSameRow",
    value: function isOnSameRow(dest, playerPos) {
      if (dest.col == playerPos.col - 1 && dest.row == playerPos.row) {
        if (this.isNotWallTile(dest)) {
          return true;
        }
      }

      if (dest.col == playerPos.col + 1 && dest.row == playerPos.row) {
        if (this.isNotWallTile(dest)) {
          return true;
        }
      }

      if (dest.col == playerPos.col - 2 && dest.row == playerPos.row) {
        if (this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col - 1
        }) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col - 2
        })) {
          return true;
        }
      }

      if (dest.col == playerPos.col + 2 && dest.row == playerPos.row) {
        if (this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col + 1
        }) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col + 2
        })) {
          return true;
        }
      }

      return false; // if (Math.abs(dest.col - playerPos.col) === 1 && Math.abs(dest.row - playerPos.row) === 1 ) {
      //     if (this.isNotWallTile(playerPos.col + 1)) {
      //         return true;
      //     }
      // }
    }
  }, {
    key: "isOnCorner",
    value: function isOnCorner(dest, playerPos) {
      if (dest.col == playerPos.col - 1 && dest.row == playerPos.row - 1) {
        if (this.isNotWallTile(dest) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col - 1
        }) && this.isNotWallTile({
          row: playerPos.row - 1,
          col: playerPos.col
        })) {
          return true;
        }
      }

      if (dest.col == playerPos.col - 1 && dest.row == playerPos.row + 1) {
        if (this.isNotWallTile(dest) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col - 1
        }) && this.isNotWallTile({
          row: playerPos.row + 1,
          col: playerPos.col
        })) {
          return true;
        }
      }

      if (dest.col == playerPos.col + 1 && dest.row == playerPos.row - 1) {
        if (this.isNotWallTile(dest) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col + 1
        }) && this.isNotWallTile({
          row: playerPos.row - 1,
          col: playerPos.col
        })) {
          return true;
        }
      }

      if (dest.col == playerPos.col + 1 && dest.row == playerPos.row + 1) {
        if (this.isNotWallTile(dest) && this.isNotWallTile({
          row: playerPos.row,
          col: playerPos.col + 1
        }) && this.isNotWallTile({
          row: playerPos.row + 1,
          col: playerPos.col
        })) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isOnSameCol",
    value: function isOnSameCol(dest, playerPos) {
      if (dest.col == playerPos.col && dest.row == playerPos.row - 1) {
        if (this.isNotWallTile(dest)) {
          return true;
        }
      }

      if (dest.col == playerPos.col && dest.row == playerPos.row + 1) {
        if (this.isNotWallTile(dest)) {
          return true;
        }
      }

      if (dest.col == playerPos.col && dest.row == playerPos.row - 2) {
        if (this.isNotWallTile({
          row: playerPos.row - 1,
          col: playerPos.col
        }) && this.isNotWallTile({
          row: playerPos.row - 2,
          col: playerPos.col
        })) {
          return true;
        }
      }

      if (dest.col == playerPos.col && dest.row == playerPos.row + 2) {
        if (this.isNotWallTile({
          row: playerPos.row + 1,
          col: playerPos.col
        }) && this.isNotWallTile({
          row: playerPos.row + 2,
          col: playerPos.col
        })) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "isLegalPlayerMove",
    value: function isLegalPlayerMove(player, dest) {
      var playerPos = player.location;

      if (this.anyPlayersOnDest(dest)) {
        return false;
      }

      if (!(this.isOnSameRow(dest, playerPos) || this.isOnSameCol(dest, playerPos) || this.isOnCorner(dest, playerPos))) {
        return false;
      } else {
        return this.playerInteractions(player, dest);
      }
    }
  }, {
    key: "includesPos",
    value: function includesPos(validMoves, pos) {
      for (var i = 0; i < validMoves.length; i++) {
        if (this.twoPosEqual(validMoves[i], pos)) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "twoPosEqual",
    value: function twoPosEqual(pos1, pos2) {
      return pos1.row == pos2.row && pos2.col == pos2.col;
    }
  }, {
    key: "isNotWallTile",
    value: function isNotWallTile(pos) {
      try {
        return this.gamestate.layout[pos.row][pos.col].tileType != "wall";
      } catch (_unused) {
        return false;
      }
    }
  }, {
    key: "exitUnreachable",
    value: function exitUnreachable() {}
  }, {
    key: "roomsOverlap",
    value: function roomsOverlap() {}
  }, {
    key: "hallwaysOverlap",
    value: function hallwaysOverlap() {}
  }, {
    key: "validNumPlayers",
    value: function validNumPlayers() {
      if (this.gamestate.players.length > 0 && this.gamestate.players.length <= 4) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "hasOne",
    value: function hasOne(tileType) {
      var rooms = this.gamestate.rooms;
      var num = 0;

      for (var i = 0; i < rooms.length; i++) {
        num = num + this.tileTypeInRoom(rooms[i], tileType);

        if (num > 1) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "tileTypeInRoom",
    value: function tileTypeInRoom(room, tileType) {
      var num = 0;

      for (var i = 0; i < room.length; i++) {
        for (var j = 0; j < room[0].length; j++) {
          if (room[i][j].tileType == tileType.toString()) {
            num++;
          }
        }
      }

      return num;
    }
  }]);

  return RuleChecker;
}();

var _default = RuleChecker;
exports["default"] = _default;