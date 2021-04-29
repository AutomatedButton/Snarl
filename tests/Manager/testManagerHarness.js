const { exit } = require("process");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var givenInput = "";
rl.on("line", (input) => {
    givenInput = givenInput + input;
    if (isValidJSONString(givenInput)) {
        rl.close();
        testOutput(givenInput);
    } else {
        rl.resume();
    }
});

function isValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function testOutput(input) {
    var jsonInput = JSON.parse(input);
    var players = jsonInput[0];
    var level = jsonInput[1];
    var natural = jsonInput[2];
    var playerLocations = jsonInput[3].slice(0, players.length);
    var adversaryLocations = jsonInput[3].slice(players.length, jsonInput[3].length);
    var listOfMoves = jsonInput[4];

    var state = new Object();
    state["type"] = "state";
    state["level"] = level;
    var playerList = createPlayerList(players, playerLocations);
    state["players"] = playerList;
    var adversaryList = createAdversaryList(adversaryLocations);
    state["adversaries"] = adversaryList;
    state["exit-locked"] = true;
    managerTrace = [];
    managerTrace = makePlayerUpdates(playerList, adversaryList, state, managerTrace);
    console.log(JSON.stringify(makeMoves(playerList, adversaryList, listOfMoves, natural, state, managerTrace)));
}

function getAdjacentRoomPoint(point, rooms) {
    for (var i = 0; i < rooms.length; i++) {
        var lowerBound = rooms[i].origin;
        var upperBound = [rooms[i].origin[0] + rooms[i].bounds.rows - 1, rooms[i].origin[1] + rooms[i].bounds.columns - 1];
        if (point[0] >= lowerBound[0] && point[0] <= upperBound[0] && point[1] >= lowerBound[1] && point[1] <= upperBound[1]) {
            var rowNum = Math.abs(point[0] - rooms[i].origin[0]);
            var colNum = Math.abs(point[1] - rooms[i].origin[1]);
            return rooms[i].layout[rowNum][colNum];
        }
    }
}

function isInAdjacentRoom(point, rooms) {
    for (var i = 0; i < rooms.length; i++) {
        var lowerBound = rooms[i].origin;
        var upperBound = [rooms[i].origin[0] + rooms[i].bounds.rows - 1, rooms[i].origin[1] + rooms[i].bounds.columns - 1];
        if (point[0] >= lowerBound[0] && point[0] <= upperBound[0] && point[1] >= lowerBound[1] && point[1] <= upperBound[1]) {
            return true;
        }
    }
    return false;
}

function isInAdjacentHallway(point, hallways) {
    for (var i = 0; i < hallways.length; i++) {
        if (pointInHallway(hallways[i], point)) {
            return true;
        }
    }
    return false;
}

function getPlayerVisibilityLayoutHallway(hallway, point, rooms, hallways) {

    var layout = [];
    for (var i = -2; i < 3; i++) {
        var row = [];
        for (var j = -2; j < 3; j++) {
            if (pointInHallway(hallway, [point[0] + i, point[1] + j])) {
                row.push(1);
            } else if (isInAdjacentRoom([point[0] + i, point[1] + j], rooms)) {
                var layoutPoint = getAdjacentRoomPoint([point[0] + i, point[1] + j], rooms);
                row.push(layoutPoint);
            } else if (isInAdjacentHallway([point[0] + i, point[1] + j], hallways)) {
                row.push(1);
            } else {
                row.push(0);
            }
        }
        layout.push(row);
    }
    return layout;
}

function getPlayerVisibilityLayoutRoom(room, point, rooms, hallways) {
    var lowerBound = room.origin;
    var upperBound = [room.origin[0] + room.bounds.rows - 1, room.origin[1] + room.bounds.columns - 1];
    if (point[0] >= lowerBound[0] && point[0] <= upperBound[0] && point[1] >= lowerBound[1] && point[1] <= upperBound[1]) {
        var rowInRoom = point[0] - room.origin[0];
        var colInRoom = point[1] - room.origin[1];
        var layout = [];
        for (var i = -2; i < 3; i++) {
            var row = [];
            for (var j = -2; j < 3; j++) {
                if (room.layout[rowInRoom + i] != undefined) {
                    if (room.layout[rowInRoom + i][colInRoom + j] != undefined) {
                        row.push(room.layout[rowInRoom + i][colInRoom + j]);
                    } else if (isInAdjacentRoom([point[0] + i, point[1] + j], rooms)) {
                        var layoutPoint = getAdjacentRoomPoint([point[0] + i, point[1] + j], rooms);
                        row.push(layoutPoint);
                    } else if (isInAdjacentHallway([point[0] + i, point[1] + j], hallways)) {
                        row.push(1);
                    } else {
                        row.push(0);
                    }
                } else if (isInAdjacentRoom([point[0] + i, point[1] + j], rooms)) {
                    var layoutPoint = getAdjacentRoomPoint([point[0] + i, point[1] + j], rooms);
                    row.push(layoutPoint);
                } else if (isInAdjacentHallway([point[0] + i, point[1] + j], hallways)) {
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            layout.push(row);
        }
        return layout;
    } else {
        return false;
    }
}

function searchRoomsAndHallwaysRoom(rooms, hallways, dest) {
    for (var i = 0; i < rooms.length; i++) {
        var layout = getPlayerVisibilityLayoutRoom(rooms[i], dest, rooms, hallways);
        if (layout != false) {
            return layout;
        }
    }

    for (var i = 0; i < hallways.length; i++) {
        if (pointInHallway(hallways[i], dest)) {
            var layout = getPlayerVisibilityLayoutHallway(hallways[i], dest, rooms, hallways);
            return layout;
        }
    }
}

function getPlayerLayout(player, state) {
    return searchRoomsAndHallwaysRoom(state.level.rooms, state.level.hallways, player.position, state.level.objects);
}

function getPlayersCurrentPos(player, state) {
    for (var i = 0; state.players.length; i++) {
        if (state.players[i].name == player.name) {
            return state.players[i].position;
        }
    }
}

function getNearbyActors(player, playerList, adversaryList) {
    var nearbyActors = [];
    for (var i = 0; i < playerList.length; i++) {
        if (
            Math.abs(player.position[0] - playerList[i].position[0]) <= 2 &&
            Math.abs(player.position[1] - playerList[i].position[1]) <= 2 &&
            player.name !== playerList[i].name
        ) {
            nearbyActors.push(playerList[i]);
        }
    }
    for (var i = 0; i < adversaryList.length; i++) {
        if (
            Math.abs(player.position[0] - adversaryList[i].position[0]) <= 2 &&
            Math.abs(player.position[1] - adversaryList[i].position[1]) <= 2
        ) {
            nearbyActors.push(adversaryList[i]);
        }
    }
    return nearbyActors;
}

function getNearbyObjects(player, state) {
    var nearbyObjects = [];
    for (var i = 0; i < state.level.objects.length; i++) {
        if (
            Math.abs(player.position[0] - state.level.objects[i].position[0]) <= 2 &&
            Math.abs(player.position[1] - state.level.objects[i].position[1]) <= 2
        ) {
            nearbyObjects.push(state.level.objects[i]);
        }
    }
    return nearbyObjects;
}

// TODO: getNearbyObjects, getNearbyPlayers functions
function makePlayerUpdates(playerList, adversaryList, state, managerTrace) {
    for (var i = 0; i < playerList.length; i++) {
        var managerTraceEntry = [];
        managerTraceEntry.push(playerList[i].name);
        var playerUpdate = new Object();
        playerUpdate["type"] = "player-update";
        var layout = getPlayerLayout(playerList[i], state);
        playerUpdate["layout"] = layout;
        playerUpdate["position"] = getPlayersCurrentPos(playerList[i], state);
        playerUpdate["objects"] = getNearbyObjects(playerList[i], state);
        playerUpdate["actors"] = getNearbyActors(playerList[i], playerList, adversaryList);
        managerTraceEntry.push(playerUpdate);
        managerTrace.push(managerTraceEntry);
    }
    return managerTrace;
}

function isOtherPlayerOnDest(playerName, players, dest) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].position.toString() == dest.toString() && players[i].name.toString() != playerName.toString()) {
            return true;
        }
    }
    return false;
}

function isTraversableDest(rooms, hallways, dest, objects) {
    for (var i = 0; i < rooms.length; i++) {
        var traversableCheck = traversablePointInRoom(rooms[i], dest, objects);
        if (traversableCheck || traversableCheck == "exit" || traversableCheck == "key") {
            return traversableCheck;
        }
    }

    for (var i = 0; i < hallways.length; i++) {
        if (pointInHallway(hallways[i], dest)) {
            return true;
        }
    }
    return false;
}

function pointInHallway(hallway, point) {
    waypoints = [hallway.from].concat(hallway.waypoints);
    waypoints.push(hallway.to);
    if ((hallway.from[0] === point[0] && hallway.from[1] === point[1]) || (hallway.to[0] === point[0] && hallway.to[1] === point[1])) {
        return false;
    }

    for (var i = 0; i < waypoints.length; i++) {
        wpx = waypoints[i][0].toString();
        wpy = waypoints[i][1].toString();
        if (waypoints[i + 1] != null) {
            if (wpx == waypoints[i + 1][0].toString()) {
                var larger = Math.max(wpy, waypoints[i + 1][1]);
                var smaller = Math.min(wpy, waypoints[i + 1][1]);
                if (point[0] == wpx && parseInt(point[1]) >= parseInt(smaller) && parseInt(point[1]) <= parseInt(larger)) {
                    return true;
                }
            } else if (point[1] == wpy && wpy == waypoints[i + 1][1].toString()) {
                var larger = Math.max(wpx, waypoints[i + 1][0]);
                var smaller = Math.min(wpx, waypoints[i + 1][0]);
                if (point[1] == wpy && parseInt(point[0]) >= parseInt(smaller) && parseInt(point[0]) <= parseInt(larger)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function traversablePointInRoom(room, point, objects) {
    var lowerBound = room.origin;
    var upperBound = [room.origin[0] + room.bounds.rows - 1, room.origin[1] + room.bounds.columns - 1];
    if (point[0] >= lowerBound[0] && point[0] <= upperBound[0] && point[1] >= lowerBound[1] && point[1] <= upperBound[1]) {
        var rowInRoom = point[0] - room.origin[0];
        var colInRoom = point[1] - room.origin[1];
        if (room.layout[rowInRoom][colInRoom] == 0) {
            return false;
        } else if (room.layout[rowInRoom][colInRoom] == 1 || room.layout[rowInRoom][colInRoom] == 2) {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].type == "key") {
                    var keyLoc = objects[i].position;
                    if (point.toString() == keyLoc.toString()) {
                        return "key";
                    }
                } else if (objects[i].type == "exit") {
                    var exitLoc = objects[i].position;
                    if (point.toString() == exitLoc.toString()) {
                        return "exit";
                    }
                }
            }
            return true;
        }
    } else {
        return false;
    }
}

function anyMovesListNone(listOfMoves) {
    for (var i = 0; i < listOfMoves.length; i++) {
        if (listOfMoves[i].length == 0) {
            return true;
        }
    }
    return false;
}

function makeMoves(playerList, adversaryList, listOfMoves, natural, state, managerTrace) {
    for (var i = 0; i < natural; i++) {
        if (anyMovesListNone(listOfMoves) || playerList.length == 0) {
            return [state, managerTrace];
        }
        for (var j = 0; j < playerList.length; ) {
            moves: for (var k = 0; k < listOfMoves[j].length; ) {
                if (isValidMove(playerList[j], listOfMoves[j][k], state)) {
                    if (listOfMoves[j][k].to === null) {
                        managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "OK"];
                        listOfMoves[j].splice(k, 1);
                        j++;
                    } else if (isOnKey(listOfMoves[j][k], state)) {
                        state["exit-locked"] = false;
                        state = removeKey(state);
                        managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "Key"];
                        movePlayer(state, playerList[j].name, listOfMoves[j][k]);
                        listOfMoves[j].splice(k, 1);
                        j++;
                    } else if (isOnExit(listOfMoves[j][k], state) && isExitUnlocked(state)) {
                        managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "Exit"];
                        movePlayer(state, playerList[j].name, listOfMoves[j][k]);
                        playerList.splice(j, 1);
                        listOfMoves.splice(j, 1);
                        j++;
                    } else if (isEjected(listOfMoves[j][k], state)) {
                        managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "Eject"];
                        state = ejectPlayer(playerList[j], state);
                        playerList.splice(j, 1);
                        listOfMoves.splice(j, 1);
                    } else {
                        managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "OK"];
                        movePlayer(state, playerList[j].name, listOfMoves[j][k]);
                        listOfMoves[j].splice(k, 1);
                        j++;
                    }
                    managerTrace.push(managerTraceEntry);
                    break moves;
                } else {
                    managerTraceEntry = [playerList[j].name, listOfMoves[j][k], "Invalid"];
                    managerTrace.push(managerTraceEntry);
                    listOfMoves[j].splice(k, 1);
                }
            }
            managerTrace = makePlayerUpdates(playerList, adversaryList, state, managerTrace);
            if ((anyMovesListNone(listOfMoves) && j !== playerList.length) || playerList.length == 0) {
                return [state, managerTrace];
            }
        }
    }
    return [state, managerTrace];
}

function removeKey(state) {
    for (var i = 0; state.level.objects.length; i++) {
        if (state.level.objects[i].type == "key") {
            state.level.objects.splice(i, 1);
            return state;
        }
    }
}

function isValidMove(player, dest, state) {
    if (dest.to === null) {
        return true;
    }
    var playerPos = player.position;
    var otherPlayersOnDest = isOtherPlayerOnDest(player.name, state.players, dest.to);
    var traversableDest = isTraversableDest(state.level.rooms, state.level.hallways, dest.to, state.level.objects);
    if (Math.abs(playerPos[0] - dest.to[0]) + Math.abs(playerPos[1] - dest.to[1]) <= 2 && !otherPlayersOnDest) {
        if (traversableDest === true || traversableDest === "key" || traversableDest === "exit") {
            return true;
        }
    } else {
        return false;
    }
}

function getKey(state) {
    for (var i = 0; i < state.level.objects.length; i++) {
        if (state.level.objects[i].type === "key") {
            return state.level.objects[i].position;
        }
    }
    return null;
}

function getExit(state) {
    for (var i = 0; i < state.level.objects.length; i++) {
        if (state.level.objects[i].type === "exit") {
            return state.level.objects[i].position;
        }
    }
    return null;
}

function isOnKey(dest, state) {
    var keyLoc = getKey(state);
    if (keyLoc === null) {
        return false;
    }
    if (dest.to[0] === keyLoc[0] && dest.to[1] === keyLoc[1]) {
        return true;
    }
    return false;
}

function isOnExit(dest, state) {
    var exitLoc = getExit(state);
    if (exitLoc === null) {
        return false;
    }
    if (dest.to[0] === exitLoc[0] && dest.to[1] === exitLoc[1]) {
        return true;
    }
    return false;
}

function isExitUnlocked(state) {
    return !state["exit-locked"];
}

function isEjected(dest, state) {
    for (var i = 0; i < state["adversaries"].length; i++) {
        if (state.adversaries[i].position.toString() == dest.to.toString()) {
            return true;
        }
    }
    return false;
}

function movePlayer(state, playerName, dest) {
    for (var i = 0; state.players.length; i++) {
        if (state.players[i].name == playerName) {
            state.players[i].position = dest.to;
            return state;
        }
    }
}

function ejectPlayer(player, state) {
    for (var i = 0; state.players.length; i++) {
        if (state.players[i].name == player.name) {
            state.players.splice(i, 1);
            return state;
        }
    }
}

function createPlayerList(players, playerLocations) {
    var playerPositionList = [];
    for (var i = 0; i < players.length; i++) {
        var pObj = new Object();
        pObj["type"] = "player";
        pObj["name"] = players[i];
        pObj["position"] = playerLocations[i];
        playerPositionList.push(pObj);
    }
    return playerPositionList;
}

function createAdversaryList(adversaryLocations) {
    var adversaryPositionList = [];
    for (var i = 0; i < adversaryLocations.length; i++) {
        var aObj = new Object();
        aObj["type"] = "ghost";
        aObj["name"] = "ghost" + (i + 1);
        aObj["position"] = adversaryLocations[i];
        adversaryPositionList.push(aObj);
    }
    return adversaryPositionList;
}
