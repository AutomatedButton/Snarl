import Level from "../src/Game/Level.mjs";
import assert from "assert";

var level = new Level();
var min = 1;
var max = 4;
var rand = level.generateRandom(min, max);

describe("Generating a random number", function () {
    it("should create a random number between " + min + " and " + max + ": " + rand, function () {
        assert(rand >= min && rand <= max);
    });
});
