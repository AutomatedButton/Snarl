/**
 * @desc RuleChecker checks all of the rules in the game
 * @param gamestate: the current gamestate of the game
 */
class RuleChecker {
    constructor(gamestate) {
        this.gamestate = gamestate;
    }

    /**
     * @desc Validates the game state by checking that there is only one key and one exit
     */
    validateGameState() {
        if (!this.hasOne("key") && !this.hasOne("exit")) {
            throw new Error("Invalid Game State Exception: Invalid number of Keys and Exits");
        } else if (!this.hasOne("exit")) {
            throw new Error("Invalid Game State Exception: Invalid number of Exits");
        } else if (!this.hasOne("key")) {
            throw new Error("Invalid Game State Exception: Invalid number of Keys");
        }

        return true;
    }
    /**
     * @desc Returns true if the gamestate objects map has one tileType key
     * @param tileType: the tile type that needs to be checked
     */
    hasOne(tileType) {
        return this.gamestate.objects[tileType] !== undefined;
    }

    /**
     * @desc Returns true if the given destination is a valid move for the given player
     * @param playerName: The name of the player that is trying to move
     * @param dest: the requested player destination
     */
    isLegalPlayerMove(playerName, dest) {
        var playerPos = this.gamestate.players[playerName].location;
        if (this.twoPosEqual(playerPos, dest)) {
            return true;
        }
        if (this.anyPlayersOnDest(dest)) {
            return false;
        }
        if (!this.isNotWallTile(dest)) {
            return false;
        }
        if (Math.abs(playerPos.row - dest.row) + Math.abs(playerPos.col - dest.col) <= 2) {
            if (Math.abs(playerPos.row - dest.row) === 1 && Math.abs(playerPos.col - dest.col) === 1) {
                if (
                    (this.anyPlayersOnDest({ row: playerPos.row, col: dest.col }) ||
                        !this.isNotWallTile({ row: playerPos.row, col: dest.col }) ||
                        this.anyAdversaryOnDest({ row: playerPos.row, col: dest.col })) &&
                    (this.anyPlayersOnDest({ row: dest.row, col: playerPos.col }) ||
                        !this.isNotWallTile({ row: dest.row, col: playerPos.col }) ||
                        this.anyAdversaryOnDest({ row: dest.row, col: playerPos.col }))
                ) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     * @desc Returns the adversary if there is one on the chosen location
     * @param dest: the requested destination
     */
    playerAttack(dest) {
        for (let [key, value] of Object.entries(this.gamestate.adversaries)) {
            if (value.location.row === dest.row && value.location.col === dest.col) {
                return key;
            }
        }
    }

    /**
     * @desc Returns true if the given destination has a player on it
     * @param dest: the requested destination
     */
    anyPlayersOnDest(dest) {
        for (let value of Object.values(this.gamestate.players)) {
            if (this.twoPosEqual(value.location, dest) && !value.exited) {
                return true;
            }
        }
        return false;
    }

    /**
     * @desc Checks to see if the given destination is a valid move for the given adversary
     * @param adversary
     */
    isLegalAdversaryMove(adversary, dest) {
        var adversaryPos = this.gamestate.adversaries[adversary].location;

        if (this.anyAdversaryOnDest(dest)) {
            return false;
        }

        if (!(this.isOnSameRow(dest, adversaryPos) || this.isOnSameCol(dest, adversaryPos) || this.isOnCorner(dest, adversaryPos))) {
            return false;
        } else {
            return this.adversaryInteractions(adversary, dest);
        }
    }

    /**
     * @desc Returns true if the given destination has an adversary on it
     * @param dest: the requested destination
     */
    anyAdversaryOnDest(dest) {
        var adversaries = this.gamestate.adversaries;
        for (let value of Object.values(adversaries)) {
            if (value.location.row === dest.row && value.location.col === dest.col) {
                return true;
            }
        }
        return false;
    }

    /**
     * @desc Checks if the two given positions are equal
     * @param pos1: the first given position
     * @param pos2: the second given position
     */
    twoPosEqual(pos1, pos2) {
        return pos1.row === pos2.row && pos1.col === pos2.col;
    }

    /**
     * @desc Checks if there is an adversary on the given player's requested destination
     * @param dest: the requested player destination
     */
    isPlayerExpelled(dest) {
        for (let value of Object.values(this.gamestate.adversaries)) {
            if (this.twoPosEqual(value.location, dest)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @desc Checks if the key is on the given destination to be collected
     * @param dest: the requested player destination
     */
    isKeyCollected(dest) {
        if (this.gamestate.objects["key"]) {
            var keyLoc = this.gamestate.objects["key"].location;
            return this.twoPosEqual(keyLoc, dest);
        }
    }

    /**
     * @desc Checks if exit is unlocked and the given destination is the exit for the player to exit the level
     * @param dest: the requested player destination
     */
    isPlayerExited(dest) {
        if (this.gamestate.exitUnlocked) {
            var exitLoc = this.gamestate.objects["exit"].location;
            return this.twoPosEqual(exitLoc, dest);
        } else {
            return false;
        }
    }

    /**
     * @desc Checks if the level has ended when all of the players have exited the current level
     */
    isEndOfLevel() {
        for (let value of Object.values(this.gamestate.players)) {
            if (!value.exited) {
                return false;
            }
        }
        return true;
    }

    /**
     * @desc Checks if the game has ended when all of the players have been expelled
     */
    isEndOfGame() {
        if (this.gamestate.players.size == 0) {
            console.log("End of Game");
            return true;
        }
        return false;
    }

    /**
     * @desc Returns true if the given position is not a wall tile
     * @param pos: the given position
     */
    isNotWallTile(pos) {
        try {
            return this.gamestate.layout[pos.row][pos.col].tileType != "wall";
        } catch {
            return false;
        }
    }

    // exitUnreachable() {}

    // roomsOverlap() {}

    // hallwaysOverlap() {}
}
module.exports = RuleChecker;
// export default RuleChecker;
