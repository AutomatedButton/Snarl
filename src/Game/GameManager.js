const Render = require("./Render");
const LocalPlayer = require("../Player/LocalPlayer");
const RuleChecker = require("./RuleChecker");
const GameState = require("./GameState");

/**
 * @desc GameManager manages the changing of the gamestate
 * @param lv: the current Level of the game
 * @param gamestate: the current gamestate of the game
 * @param playersTurn: the current players turn (null if game has not started)
 * @param gameStarted: Boolean indicating if the game has started yet or not
 */
class GameManager {
    constructor(gamestate, lv, allLevels) {
        if (lv === undefined && allLevels === undefined) {
            gamestate && Object.assign(this, gamestate);
        } else {
            this.lvNum = 0;
            this.lv = lv;
            this.gamestate = gamestate;
            this.localPlayers = {};
            this.playersTurn = null;
            this.window = {};
            this.allLevels = allLevels;
            this.keysFound = {};
            this.exitedPlayers = {};
            this.ejects = {};
            this.validateGamestate();
        }
    }

    /**
     * @desc Validates the gamestate
     */
    validateGamestate() {
        this.gamestate.validateGameState();
    }

    /**
     * @desc Registers a player with the given player name
     * @param playerName: the name of the player that has been registered
     */
    registerPlayer(playerName) {
        if (this.playerNameNotRegister(playerName) && Object.keys(this.gamestate.players).length <= 4) {
            // New player in the first level creation
            if (!this.localPlayers[playerName]) {
                this.keysFound[playerName] = 0;
                this.exitedPlayers[playerName] = 0;
                this.ejects[playerName] = 0;
                var localPlayer = new LocalPlayer(playerName);
                this.localPlayers[playerName] = localPlayer;
            }
            this.lv.createPlayer(playerName);
            this.gamestate.players = this.lv.players;
            this.updateRendering();
        } else {
            return true;
        }
    }

    /**
     * @desc Registers a random number of the adversaries in the game
     */
    registerAdversaries() {
        var ghostsNum = Math.floor((this.lvNum - 1) / 2);
        var zombNum = Math.floor(this.lvNum / 2) + 1;
        this.lv.createAdversaries(ghostsNum, zombNum);
        this.gamestate.adversaries = this.lv.adversaries;
        this.updateRendering();
    }

    /**
     * @desc Returns true if a player with the given name has not been registered
     * @param playerName: the player name that is being checked if it has not been registered
     */
    playerNameNotRegister(playerName) {
        return this.gamestate.players[playerName] === undefined;
    }

    /**
     * @desc Gets the players that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */
    getNearbyPlayers(playerName) {
        var nearbyPlayers = [];
        var localPlayerLoc = this.gamestate.players[playerName].location;
        for (let value of Object.values(this.gamestate.players)) {
            if (
                Math.abs(localPlayerLoc.row - value.location.row) <= 2 &&
                Math.abs(localPlayerLoc.col - value.location.col) <= 2 &&
                playerName !== value.name
            ) {
                var nearbyPlayer = {};
                nearbyPlayer["name"] = value.name;
                nearbyPlayer["location"] = value.location;
                nearbyPlayers.push(nearbyPlayer);
            }
        }
        return nearbyPlayers;
    }

    /**
     * @desc Gets the adversaries that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */
    getNearbyAdversaries(playerName) {
        var nearbyAdversaries = [];
        var localPlayerLoc = this.gamestate.players[playerName].location;
        for (let value of Object.values(this.gamestate.adversaries)) {
            if (Math.abs(localPlayerLoc.row - value.location.row) <= 2 && Math.abs(localPlayerLoc.col - value.location.col) <= 2) {
                var adversaryUpdate = {};
                adversaryUpdate["type"] = value["type"];
                adversaryUpdate["location"] = value["location"];
                adversaryUpdate["health"] = value["health"];
                nearbyAdversaries.push(adversaryUpdate);
            }
        }
        return nearbyAdversaries;
    }

    /**
     * @desc Gets the objects that are within a 5x5 square of the given player
     * @param playerName: the player name that is being used
     */
    getNearbyObjects(playerName) {
        var nearbyObjects = [];
        var localPlayerLoc = this.gamestate.players[playerName].location;
        for (let [key, value] of Object.entries(this.gamestate.objects)) {
            if (Math.abs(localPlayerLoc.row - value.location.row) <= 2 && Math.abs(localPlayerLoc.col - value.location.col) <= 2) {
                var nearbyObj = {};
                nearbyObj[key] = value.location;
                nearbyObjects.push(nearbyObj);
            }
        }
        return nearbyObjects;
    }

    /**
     * @desc Gets a 5x5 grid with the player in the center as the player's view
     * @param playerName: the player name that is being used
     */
    getPlayerLayout(playerName) {
        var nearbyLayout = [];
        for (var row = 0; row < this.gamestate.layout.length - 1; row++) {
            for (var col = 0; col < this.gamestate.layout.length - 1; col++) {
                var tile = this.gamestate.layout[row][col];
                if (
                    Math.abs(this.gamestate.players[playerName].location.row - row) <= 2 &&
                    Math.abs(this.gamestate.players[playerName].location.col - col) <= 2
                ) {
                    nearbyLayout.push(tile);
                }
            }
        }
        return nearbyLayout;
    }

    /**
     * @desc Requests the location that the player would like to move to
     * @param playerName: the player name that is requesting to move successful
     */
    async requestPlayerMove(playerName) {
        var rulechecker = new RuleChecker(this.gamestate);
        // const playersTurnWindow = this.window[playerName];
        const requestedDest = await this.localPlayers[playerName].provideMove();
        var successfulMove = this.gamestate.playerMovement(playerName, requestedDest);
        if (successfulMove[0]) {
            this.keysFound[playerName] = this.keysFound[playerName] + 1;
            // for (let value of Object.values(this.window)) {
            //     value.alert("Player " + playerName + " found the key");
            // }
        } else if (successfulMove[1]) {
            this.exitedPlayers[playerName] = this.exitedPlayers[playerName] + 1;
            // for (let value of Object.values(this.window)) {
            //     value.alert("Player " + playerName + " exited");
            // }
        }
        if (successfulMove !== false) {
            this.localPlayers[playerName].updateLocalPlayer(
                this.gamestate.players[playerName].location,
                this.getNearbyPlayers(playerName),
                this.getNearbyAdversaries(playerName),
                this.getNearbyObjects(playerName),
                this.gamestate.exitUnlocked,
                // this.window[playerName],
                this.playersTurn
            );
            this.updateRendering();
            if (successfulMove[2] === true) {
                this.gamestate.expelPlayer(playerName);
            }
            // this.updateWindowList();
            // Checks if all players have been expelled
            if (this.gamestate.players.size === 0) {
                this.playersTurn = null;
            } else {
                this.setNextPlayersTurn();
            }
            if (rulechecker.isEndOfLevel()) {
                this.endLevel();
            }
            // if (rulechecker.isEndOfGame()) {
            //     this.endGame();
            // }
        }
        return successfulMove;
    }

    /**
     * @desc Alerts all of the players if a player is expelled
     */

    updateWindowList() {
        for (let key of Object.keys(this.window)) {
            if (!this.gamestate.players[key]) {
                for (let value of Object.values(this.window)) {
                    value.alert("Player " + key + " was expelled");
                }
                delete this.window[key];
            }
        }
    }

    /**
     * @desc Randomly moves all of the adversaries in the game
     */
    onAdversaryMove() {
        for (let key of Object.keys(this.gamestate.adversaries)) {
            var expelPlayerName = this.gamestate.adversaryMovement(key);
            this.updateRendering();
            if (expelPlayerName) {
                this.gamestate.expelPlayer(expelPlayerName);
            }
            // Checks if all players have been expelled
            if (this.gamestate.players.size === 0) {
                this.playersTurn = null;
            }
            // this.updateWindowList();
        }
        return this.gamestate.players;
    }

    /**
     * @desc Sets the next players turn and if all players have moved, call the function to move the adversaries
     */
    setNextPlayersTurn() {
        var players = Array.from(Object.keys(this.gamestate.players));
        if (players.length === 0) {
            this.playersTurn = null;
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i].exited) {
                players.splice(i, 1);
            }
        }
        if (this.allPlayersExited()) {
            this.playersTurn = null;
            var turnNotSet = false;
            return;
        }

        var playerIndex = players.indexOf(this.playersTurn);
        var curIndex = playerIndex;
        if (players[curIndex + 1] === undefined) {
            curIndex = 0;
        } else {
            curIndex = playerIndex + 1;
        }
        var turnNotSet = true;

        settingTurn: for (var i = 0; i < players.length + 1; i++) {
            if (players[curIndex] === undefined) {
                curIndex = 0;
                continue settingTurn;
            } else if (this.gamestate.players[players[curIndex]].exited) {
                curIndex++;
                continue settingTurn;
            } else {
                this.playersTurn = players[curIndex];
                turnNotSet = false;
                break;
            }
        }
        if (turnNotSet) {
            this.playersTurn = null;
        }
    }

    updateRendering() {
        for (const [key, value] of Object.entries(this.window)) {
            if (this.gamestate.players[key]) {
                var rend = new Render(this.gamestate, value, this.gamestate.players[key]);
                rend.RenderInit();
            }
        }
    }

    /**
     * @desc Returns true if all players have exited
     */
    allPlayersExited() {
        for (let value of Object.values(this.gamestate.players)) {
            if (!value.exited) {
                return false;
            }
        }
        return true;
    }

    /**
     * @desc Ends the level
     */
    endLevel() {
        this.playersTurn = null;
    }

    /**
     * @desc Ends the game
     */
    endGame() {
        console.log("Game has ended.");
    }
}

module.exports = GameManager;