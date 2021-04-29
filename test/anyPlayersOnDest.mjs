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
var testRC = new RuleChecker(testGS);

describe("Create player on row: 1 and col: 3", function () {
    it("Check if there are any players on row: 1 col: 3", function () {
        assert(testRC.anyPlayersOnDest({ row: 1, col: 3 }));
    });
});