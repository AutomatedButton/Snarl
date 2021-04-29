import Level from "../src/Game/Level.mjs";
import RuleChecker from "../src/Game/RuleChecker.mjs"
import assert from "assert";

var lv = new Level();
lv.makeLevel();
lv.createPlayer("Nilay");
var dest = { row: 0, col: 0 };

describe("Created Player on (0, 0) and Check if Player is on given tile", function () {
    it("Should have a player on (0, 0) ", function () {
        assert(lv.playerOnTile(dest));
    });
    it("Should not have a player on (0, 1) ", function () {
        assert(!lv.playerOnTile({ row: 0, col: 1 }));
    });
});
