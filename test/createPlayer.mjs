import Level from '../src/Game/Level.mjs'
import assert from 'assert'

var lv = new Level();
lv.makeLevel();
lv.createPlayer("Nilay")

describe('Creating a Player', function() {
    it('should create a player in the level', function() {
      if (lv.players.size == 0) {
        assert.fail("No Players in Level")
      }
      for (let key of lv.players.keys()) {
        assert.equal(key, "Nilay");
      }
  });
});