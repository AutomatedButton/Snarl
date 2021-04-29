const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  var givenInput = "";
  rl.on("line", (input) => {
    givenInput = givenInput + input;
    if(isValidJSONString(givenInput)) {
        rl.close();
        testOutput(givenInput);
    } else {
        rl.resume()
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
    var output = {};
    var jsonInput = JSON.parse(input);
    var point = jsonInput[1];
    var rooms = jsonInput[0].rooms;
    var hallways = jsonInput[0].hallways;
    var objects = jsonInput[0].objects;
    output["traversable"] = isRoomsTraversable(rooms, point);
    output["object"] = isKeyOrExit(objects, point);
    var gameType = roomHallwayVoid(rooms, hallways, point)
    output["type"] = gameType[0]
    var reachable = []
    if (gameType[0].toString() == "room") {
        reachable = getReachableRoom(hallways, rooms, gameType[1])
    } else if (gameType[0].toString() == "hallway") {
        reachable = getReachableHallway(rooms, gameType[1])
    }
    output["reachable"] = reachable;
    console.log(JSON.stringify(output))
}

function isRoomsTraversable(rooms, point) {
    for (var i=0; i<rooms.length; i++) {
        if ((isTraversable(rooms[i], point))) {
            return true;
        }
    }
    return false;
}

function isTraversable(room, point) {
    if (pointInRoom(room, point)) {
        if ((isFloorOrDoor(room, point))) {
            return true
        }
    }
    return false
}

function pointInRoom(room, point) {
    var lowerBound = room.origin;
    var upperBound = [room.origin[0] + room.bounds.rows-1, room.origin[1] + room.bounds.columns-1];
    if (point[0] >= lowerBound[0] && point[0] <= upperBound[0] && point[1] >= lowerBound[1] && point[1] <= upperBound[1]) {
            return true;
    } else {
        return false;
    }
}

function pointInHallway(hallway, point) {
    waypoints = [hallway.from].concat(hallway.waypoints);
    waypoints.push(hallway.to);

    for(var i=0; i<waypoints.length; i++) {
        wpx = waypoints[i][0].toString();
        wpy = waypoints[i][1].toString();
        if (waypoints[i+1] != null) {
            if (wpx == waypoints[i+1][0].toString()) {
                if (point[0] == wpx && parseInt(point[1]) >= parseInt(wpy) && parseInt(point[1]) <= parseInt(waypoints[i+1][1])) {
                    return true;
                }
            } else if (point[1] == wpy && wpy == waypoints[i+1][1].toString()) {
                if (point[1] == wpy && parseInt(point[0]) >= parseInt(wpx) && parseInt(point[0]) <= parseInt(waypoints[i+1][0])) {
                    return true;
                }
            }    
        }
    }
    return false;
}

function isFloorOrDoor(input, point) {
    var pointRoomRow = point[0] - input.origin[0];
    var pointRoomCol = point[1] - input.origin[1];
    var layout = input.layout;
    if (layout[pointRoomRow][pointRoomCol] == 1 || layout[pointRoomRow][pointRoomCol] == 2 ) {
        return true;
    } 
    return false;
}

function isKeyOrExit(objects, point) {
    for (var i=0; i<objects.length; i++) {
        if (objects[i].position.toString() == point.toString()) {
            return objects[i].type.toString();
        }
    }
    return null;
}

function roomHallwayVoid(rooms, hallways, point) {
    for (var i=0; i<rooms.length; i++) {
        if (pointInRoom(rooms[i], point)) {
            return ["room", rooms[i]];
        }
    }
    for (var j=0; j<hallways.length; j++) {
        if (pointInHallway(hallways[j], point)) {
            return ["hallway", hallways[j]]
        }
    }
    return ["void"]
}

function getRoomOrigin(rooms, point) {
    for (var i=0; i<rooms.length; i++) {
        if (pointInRoom(rooms[i], point)) {
            return rooms[i].origin;
        }
    }
}

function getReachableRoom(hallways, rooms, room) {
    var reachable = [];
    for (var i=0; i<hallways.length; i++) {
        if (pointInRoom(room, hallways[i].from)) {
            var origin = getRoomOrigin(rooms, hallways[i].to);
            reachable.push(origin)
        } else if (pointInRoom(room, hallways[i].to)) {
            var origin = getRoomOrigin(rooms, hallways[i].from);
            reachable.push(origin)
        }
    }
    return reachable;
}

function getReachableHallway(rooms, hallway) {
    var reachable = [];
    for (var i=0; i<rooms.length; i++) {
        if (pointInRoom(rooms[i], hallway.from) || (pointInRoom(rooms[i], hallway.to))) {
            reachable.push(rooms[i].origin)
        }
    }
    return reachable;
}