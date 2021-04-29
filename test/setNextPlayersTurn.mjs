import GameState from '../src/Game/GameState.mjs'
import Level from '../src/Game/Level.mjs'
import Player from '../src/Common/Player.mjs'
import GameManager from '../src/Game/GameManager.mjs'
import assert from "assert";

var p1 = new Player("Nilay");
var p2 = new Player("Adam");
var lv = new Level();
lv.makeLevel()
var playerMap = new Map();
playerMap.set("Nilay", p1)
playerMap.set("Adam", p2)
var testGS = new GameState(lv.gameLevel, playerMap, new Map(), lv.objects, lv.rooms, false);
var testGM = new GameManager(testGS, lv)
testGM.gameStarted = true;
var players = Array.from(testGM.gamestate.players.keys())
testGM.playersTurn = players[0]

describe("Set next players turn in Game Manager. Current players turn is: " + testGM.playersTurn, function () {
    it("Player's Turn should now be: " + p2.name, function () {
        testGM.setNextPlayersTurn()
        assert(testGM.playersTurn == p2.name);
    });
});