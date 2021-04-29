import Level from "../Game/Level.js";
import GameState from "../Game/GameState.js";
import GameManager from "../Game/GameManager.js";
import LocalObserver from "../Observer/LocalObserver.js";

var startbutton = document.getElementById("start-btn");

/**
 * @desc Start the game on a button click
 */
startbutton.onclick = async function () {
    var startLevel = document.getElementById("level").value;
    // Set Default Level Number to 1
    if (startLevel === null || startLevel === "") {
        startLevel = 1;
    }
    // Read Levels file and check validity of file
    var allLevels = await createLevel();
    if (allLevels[startLevel - 1] === undefined) {
        alert("Invalid Start Level");
        return;
    }

    var lv = new Level();
    lv.makeGivenLevel(allLevels[startLevel - 1]);
    var gamestate = new GameState(lv.gameLevel, {}, {}, lv.objects, lv.rooms, false);
    var gamemanager = new GameManager(gamestate, lv, allLevels);
    gamemanager.lvNum = startLevel;

    var observer = document.getElementById("observe").checked;
    if (observer) {
        var localObserver = new LocalObserver();
        var observerWind = window.open("");
        initializeObserver(observerWind);
    }

    registerPlayers(gamemanager);

    gamemanager.registerAdversaries();

    gamemanager.playersTurn = getFirstPlayer(gamestate.players);

    while (gamemanager.playersTurn !== null) {
        updateLocalPlayers(gamemanager);
        if (observer) {
            localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
        }
        var status = await requestPlayerMove(gamemanager, localObserver, observerWind);
    }

    while (status === "Next") {
        var gameover = createNextLevel(gamemanager, gamestate, allLevels);
        if (gameover) {
            informUsers(gamemanager, "You won the game!");
            var results = getResults(gamemanager);
            informUsers(gamemanager, results);
            break;
        }
        for (const key of Object.keys(gamemanager.localPlayers)) {
            gamemanager.registerPlayer(key);
        }

        gamemanager.registerAdversaries();
        gamemanager.playersTurn = getFirstPlayer(gamestate.players);
        updateLocalPlayers(gamemanager);
        if (observer) {
            localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
        }
        var status = await requestPlayerMove(gamemanager, localObserver, observerWind);
    }
    if (status === "Over") {
        informUsers(gamemanager, "You lost on level " + gamemanager.lvNum);
        var results = getResults(gamemanager);
        informUsers(gamemanager, results);
    }
};

/**
 * @desc Sorts the game results and returns the key and exit numbers for each player
 * @param gamemanager: current gamemanager
 */
function getResults(gamemanager) {
    var results = "";
    results = results + "Keys\n";
    const keysFoundSorted = Object.entries(gamemanager.keysFound).sort(([, a], [, b]) => a - b);
    for (const [key, value] of Object.entries(keysFoundSorted)) {
        results = results + key + ": " + value + " ";
    }
    results = results + "\n\nExits\n";
    const exitedPlayersSorted = Object.entries(gamemanager.exitedPlayers).sort(([, a], [, b]) => a - b);
    for (const [key, value] of Object.entries(exitedPlayersSorted)) {
        results = results + key + ": " + value + " ";
    }

    return results;
}

/**
 * @desc Sets the next level, returns true if there are no more levels and false if there are more levels
 * @param gamemanager: current gamemanager
 */
function createNextLevel(gamemanager, gamestate, allLevels) {
    if (allLevels[gamemanager.lvNum] !== undefined) {
        gamemanager.lvNum = gamemanager.lvNum + 1;
        var lv = new Level();
        lv.makeGivenLevel(allLevels[gamemanager.lvNum - 1]);
        var gamestate = new GameState(lv.gameLevel, {}, {}, lv.objects, lv.rooms, false);
        gamemanager.gamestate = gamestate;
        gamemanager.lv = lv;
        return false;
    }
    return true;
}

/**
 * @desc Returns an array of all of the levels by reading the file
 * @param file: all levels file
 */
function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        var levels = [];
        reader.readAsText(file);
        reader.onload = function () {
            var levelsFile = reader.result;
            // Split level file by new line
            var lines = levelsFile.split("\n");
            var level = "";
            // Start after the natural number line
            for (var i = 2; i < lines.length; i++) {
                // if end of file
                if (lines[i].replace(/\s/g, "") !== "") {
                    level = level + lines[i];
                } else {
                    levels.push(JSON.parse(level));
                    level = "";
                }
                // If reach second to last line in file
                if (i === lines.length - 1) {
                    levels.push(JSON.parse(level));
                    level = "";
                }
            }
            resolve(levels);
        };
        reader.onerror = reject;
    });
}

/**
 * @desc Returns an array of all of the levels in the file that is given by the user
 */
async function createLevel() {
    var levels_input = document.getElementById("levels");
    var file = levels_input.files[0];

    let levels = await readFileAsync(file);
    return levels;
}

/**
 * @desc Initializes the observer view
 * @param observerWind: the observer's window
 */
function initializeObserver(observerWind) {
    var canvas = observerWind.document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    observerWind.document.body.appendChild(canvas);
    observerWind.document.title = "Observer";
}

/**
 * @desc Registers all of the players and creates a local window
 * @param gamemanager: the gamemanager
 */
function registerPlayers(gamemanager) {
    var playersNum = document.getElementById("players").value;
    if (playersNum === null || playersNum === "") {
        playersNum = 1;
    } else if (playersNum < 1 || playersNum > 4) {
        alert("Invalid number of players");
        return;
    }

    for (var i = 0; i < playersNum; i++) {
        var wind = window.open("");

        var div = document.createElement("div");
        div.setAttribute("id", "flex-container");
        div.style.display = "flex";
        wind.document.body.appendChild(div);

        var div = document.createElement("div");
        div.setAttribute("id", "game");
        div.style.flex = 1;
        wind.document.getElementById("flex-container").appendChild(div);

        var canvas = wind.document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        wind.document.getElementById("game").appendChild(canvas);

        createUpdates(wind);
        var playerName = wind.prompt("What is Player " + (i + 1) + " name?");
        var valid = false;
        while (!valid) {
            if (playerName === null || playerName === "") {
                playerName = wind.prompt("What is Player " + (i + 1) + " name?");
            } else {
                var dupName = gamemanager.registerPlayer(playerName);
                if (dupName) {
                    wind.alert("Cannot register duplicate name: " + playerName);
                    playerName = "";
                } else {
                    gamemanager.window[playerName] = wind;
                    wind.document.title = playerName;
                    valid = true;
                }
            }
        }
    }
}

/**
 * @desc Returns the first player that registered
 * @param players: list of all of the players in the game
 */
function getFirstPlayer(players) {
    return Array.from(Object.keys(players))[0];
}

/**
 * @desc Initializes the on page view of the player updates
 * @param window: given window that the updates should be created on
 */
function createUpdates(window) {
    var div = document.createElement("div");
    div.setAttribute("id", "player-updates");
    div.style.flex = 1;
    window.document.getElementById("flex-container").appendChild(div);

    var label = window.document.createElement("p");
    label.setAttribute("id", "current-location-label");
    window.document.getElementById("player-updates").appendChild(label);

    var label = window.document.createElement("p");
    label.setAttribute("id", "nearby-players-label");
    window.document.getElementById("player-updates").appendChild(label);

    var label = window.document.createElement("p");
    label.setAttribute("id", "nearby-adversaries-label");
    window.document.getElementById("player-updates").appendChild(label);

    var label = window.document.createElement("p");
    label.setAttribute("id", "nearby-objects-label");
    window.document.getElementById("player-updates").appendChild(label);

    var label = window.document.createElement("p");
    label.setAttribute("id", "exit-unlocked-label");
    window.document.getElementById("player-updates").appendChild(label);

    var label = window.document.createElement("p");
    label.setAttribute("id", "current-player-turn");
    window.document.getElementById("player-updates").appendChild(label);
}

/**
 * @desc Updates all of the local players with all of the surroundings updates
 * @param gamemanager: current gamemanager
 */
function updateLocalPlayers(gamemanager) {
    for (let key of Object.keys(gamemanager.localPlayers)) {
        gamemanager.localPlayers[key].updateLocalPlayer(
            gamemanager.gamestate.players[key].location,
            gamemanager.getNearbyPlayers(key),
            gamemanager.getNearbyAdversaries(key),
            gamemanager.getNearbyObjects(key),
            gamemanager.gamestate.exitUnlocked,
            gamemanager.window[key],
            gamemanager.playersTurn
        );
    }
}

/**
 * @desc Async request to the current players turn to make a move. Returns Next if the level is over and Over if the game is over
 * @param gamemanager: current gamemanager
 * @param localObserver: the localobserver
 * @param observerWind: the observer window
 */
async function requestPlayerMove(gamemanager, localObserver, observerWind) {
    while (gamemanager.playersTurn !== null) {
        var successfulMove = await gamemanager.requestPlayerMove(gamemanager.playersTurn);
        if (successfulMove) {
            if (localObserver !== undefined) {
                localObserver.receiveUpdates(gamemanager.gamestate, observerWind);
            }
            updateLocalPlayers(gamemanager);
        }
    }
    if (gamemanager.gamestate.players.size === 0) {
        console.log("Game Over");
        return "Over";
    } else {
        console.log("Level Over");
        return "Next";
    }
}

/**
 * @desc ALerts all of the users with the given message
 * @param gamemanager: current gamemanager
 * @param message: message to be sent to all users
 */
function informUsers(gamemanager, message) {
    for (const value of Object.values(gamemanager.window)) {
        value.alert(message);
    }
}
