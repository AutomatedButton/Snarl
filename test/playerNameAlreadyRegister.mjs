import GameManager from "../src/Game/GameManager.mjs";
import GameState from '../src/Game/GameState.mjs'
import Level from '../src/Game/Level.mjs'
import Player from '../src/Common/Player.mjs'
import assert from "assert";

var p1 = new Player("Nilay");
var lv = new Level();
lv.makeLevel();
var playerMap = new Map();
playerMap.set("Nilay", p1)
var testGS = new GameState(lv.gameLevel, playerMap, new Map(), lv.objects, lv.rooms, false);
var testGM = new GameManager(testGS, lv);

describe("Registered Player Nilay and Check if given player has already been registered", function () {
    it("Player Nilay should be registered", function () {
        assert(testGM.playerNameAlreadyRegister("Nilay"));
    });
    it("Player Bob should be registered", function () {
        assert(!testGM.playerNameAlreadyRegister("Bob"));
    });
});