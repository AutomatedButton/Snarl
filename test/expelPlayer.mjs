import RuleChecker from '../src/Game/RuleChecker.mjs'
import GameState from '../src/Game/GameState.mjs'
import Level from '../src/Game/Level.mjs'
import Player from '../src/Common/Player.mjs'
import assert from "assert";

var p1 = new Player("Nilay");
p1.location = { row: 1, col: 3 };
var lv = new Level();
lv.makeLevel();
var playerMap = new Map();
playerMap.set("Nilay", p1)
var testGS = new GameState(lv.gameLevel, playerMap, new Map(), lv.objects, lv.rooms, false);
var testRC = new RuleChecker(testGS)

describe("Expel player Nilay", function () {
    it("should not have Nilay in the game anymore", function () {
        testGS.expelPlayer("Nilay")
        assert(!(testGS.players.has("Nilay")));
    });
});
