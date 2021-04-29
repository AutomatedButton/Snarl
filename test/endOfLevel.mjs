import RuleChecker from '../src/Game/RuleChecker.mjs'
import GameState from '../src/Game/GameState.mjs'
import Level from '../src/Game/Level.mjs'
import Player from '../src/Common/Player.mjs'
import assert from "assert";

var p1 = new Player("Nilay");
p1.location = { row: 1, col: 3 };
p1.exited = true
var lv = new Level();
lv.makeLevel();
var playerMap = new Map();
playerMap.set("Nilay", p1)
var testGS = new GameState(lv.gameLevel, playerMap, new Map(), lv.objects, lv.rooms, false);
var testRC = new RuleChecker(testGS)

describe("All players have exited: Check end of level", function () {
    it("should return true indicating that the level has ended", function () {
        assert(testRC.isEndOfLevel());
    });
});
