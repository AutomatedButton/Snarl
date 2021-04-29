import RuleChecker from '../src/Game/RuleChecker.mjs'
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
var testRC = new RuleChecker(testGS)

describe("Game state created with one key and one exit", function () {
    it("should have one key", function () {
        assert(testRC.hasOne("key"));
    });
    it("should have one exit", function () {
        assert(testRC.hasOne("exit"));
    });
});