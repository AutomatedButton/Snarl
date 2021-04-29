/**
 * @desc LocalPlayer holds the information of a user
 * @param name: The name of the local player that matches with a player in the game
 */
class LocalPlayer {
    constructor(name) {
        this.name = name;
        this.removed = false;
    }

    /**
     * @desc Updates the local player with information about their surroundings
     * @param playersLocation: the local player's current location
     * @param players: players thare are in a 5x5 square near the local player
     * @param adversaries: adversaries thare are in a 5x5 square near the local player
     * @param objects: objects thare are in a 5x5 square near the local player
     * @param exitUnlocked: boolean if the current level exit is unlocked or not
     */
    updateLocalPlayer(playersLocation, players, adversaries, objects, exitUnlocked, window, currentPlayersTurn) {
        var nearbyPlayers = window.document.getElementById("nearby-players-label");
        nearbyPlayers.innerHTML = "Nearby Players: " + JSON.stringify(players);

        var curLocation = window.document.getElementById("current-location-label");
        curLocation.innerHTML = "Current Location: " + JSON.stringify(playersLocation);

        var nearbyAdversaries = window.document.getElementById("nearby-adversaries-label");
        nearbyAdversaries.innerHTML = "Nearby Adversaries: " + JSON.stringify(adversaries);

        var nearbyObjects = window.document.getElementById("nearby-objects-label");
        nearbyObjects.innerHTML = "Nearby Objects: " + JSON.stringify(objects);

        var nearbyExit = window.document.getElementById("exit-unlocked-label");
        nearbyExit.innerHTML = "Is Exit Unlocked: " + JSON.stringify(exitUnlocked);

        var currentPlayersTurnLabel = window.document.getElementById("current-player-turn");
        currentPlayersTurnLabel.innerHTML = "Current Player's Turn: " + currentPlayersTurn;
    }

    /**
     * @desc Waits for the user to click on a tile that they are requesting to move to
     */
    async provideMove() {
        const timeout = async (ms) => new Promise((res) => setTimeout(res, ms));
        var row = undefined;
        var col = undefined;
        canvas.addEventListener("click", function (event) {
            row = Math.floor(event.pageY / 30 - 0.25);
            col = Math.floor(event.pageX / 30 - 0.25);
        });
        while (row === undefined) {
            await timeout(50);
        }
        return { row: row, col: col };
    }
}
module.exports = LocalPlayer;
// export default LocalPlayer;
