const Node = require("./Node.js");
/**
 * @desc this class holds the information of a single adversary
 * @param type: Specifies the type of the adversary
 * @param location: Specifies the location of the tile as an object ({row:4, col:12})
 * @constructor Create an adversary by specifying the location in the game it is on and the type
 */
class Adversary {
    constructor(id, type, location, layout, objects, rooms) {
        if (type === undefined && location === undefined && layout === undefined && objects === undefined && rooms === undefined) {
            id && Object.assign(this, id);
        } else {
            this.id = id;
            this.type = type;
            this.location = location;
            this.playerLocations = [];
            this.layout = layout;
            this.objects = objects;
            this.rooms = rooms;
            if (type === "Zombie") {
                this.health = 30;
                this.attack = 12;
            } else {
                this.health = 20;
                this.attack = 10;
            }
        }
    }

    /**
     * @desc Updates the player locations based on what is passed into the function
     */
    updatePlayerLocations(playerLocations) {
        this.playerLocations = playerLocations;
    }

    /**
     * @desc Chooses a tile destination based on the adversary type and player locations
     */
    chooseDestination() {
        var room = this.getAdversaryRoom();
        var hallway = this.getAdversaryHallway();
        if (room) {
            var player = this.getClosestPlayer(room);
            if (player) {
                return this.getShortestPath(player, room)[0];
            } else {
                if (this.type === "Ghost") {
                    var player = this.getClosestPlayer(this.layout);
                    if (player) {
                        var path = this.getShortestPath(player, this.layout);
                        if (!(path.length > 7)) {
                            return path[0];
                        }
                    }
                    return this.moveToWall(room)[0];
                } else if (this.type === "Zombie") {
                    return this.randomValidMove(room);
                }
            }
        } else if (hallway) {
            // Adversary not in room
            if (this.type === "Ghost") {
                var player = this.getClosestPlayer(this.layout);
                if (player) {
                    return this.getShortestPath(player, this.layout)[0];
                } else {
                    return this.moveToWall(room)[0];
                }
            }
        }
    }

    /**
     * @desc Returns shortest path towards a wall tile
     */
    moveToWall() {
        var q = Array();
        var src = new Node(this.location, null);
        q.push(src);
        var dr = [-1, 1, 0, 0, 1, -1, -1, 1];
        var dc = [0, 0, 1, -1, 1, -1, 1, -1];
        var sr = this.location.row;
        var sc = this.location.col;
        var visited = [];
        visited[sr] = [];
        visited[sr][sc] = true;
        while (q.length !== 0) {
            var curr = q.shift();
            var r = curr.location.row;
            var c = curr.location.col;

            if (this.layout[r][c].tileType === "wall") {
                var next = curr;
                var path = [];
                while (next.parent != null) {
                    path.push(next.location);
                    next = next.parent;
                }

                return path.reverse();
            }

            for (var i = 0; i < 8; i++) {
                var rr = r + dr[i];
                var cc = c + dc[i];

                if (rr < 0 || cc < 0) {
                    continue;
                }
                if (
                    rr > this.layout[this.layout.length - 1][0].location.row ||
                    cc > this.layout[0][this.layout[0].length - 1].location.col
                ) {
                    continue;
                }
                if (visited[rr] !== undefined) {
                    if (visited[rr][cc]) {
                        continue;
                    }
                }

                var next = new Node({ row: rr, col: cc }, curr);
                // key = { row: rr, col: cc };

                if (visited[rr] !== undefined) {
                    if (visited[rr][cc]) {
                        continue;
                    }
                }
                q.push(next);
                if (visited[rr] === undefined) {
                    visited[rr] = [];
                }
                visited[rr][cc] = true;
            }
        }
        return null;
    }

    /**
     * @desc Returns a random valid move
     */
    randomValidMove(room) {
        var dr = [-1, 1, 0, 0, 1, -1, -1, 1];
        var dc = [0, 0, 1, -1, 1, -1, 1, -1];
        var valid = false;
        var r = this.location.row;
        var c = this.location.col;
        var origin = room[0][0].location;
        var rr;
        var cc;
        while (!valid) {
            var randElem = Math.floor(Math.random() * dr.length);
            rr = r + dr[randElem];
            cc = c + dc[randElem];
            if (rr < origin.row || cc < origin.col) {
                dr.splice(randElem, 1);
                dc.splice(randElem, 1);
                continue;
            }
            if (rr > room[room.length - 1][0].location.row || cc > room[0][room[0].length - 1].location.col) {
                dr.splice(randElem, 1);
                dc.splice(randElem, 1);
                continue;
            }
            if (room[rr - origin.row][cc - origin.col].tileType === "wall") {
                dr.splice(randElem, 1);
                dc.splice(randElem, 1);
                continue;
            }
            valid = true;
        }
        return { row: rr, col: cc };
    }

    /**
     * @desc Gets the shortest path from this adversary to the given player in the given room
     * @param player: Given player adversary is trying to move towards
     * @param room: Given room that the player and adversary are in
     */
    getShortestPath(player, room) {
        var q = Array();
        var src = new Node(this.location, null);
        q.push(src);
        var dr = [-1, 1, 0, 0, 1, -1, -1, 1];
        var dc = [0, 0, 1, -1, 1, -1, 1, -1];
        var sr = this.location.row;
        var sc = this.location.col;
        var visited = [];
        visited[sr] = [];
        visited[sr][sc] = true;
        var origin = room[0][0].location;
        while (q.length !== 0) {
            var curr = q.shift();
            var r = curr.location.row;
            var c = curr.location.col;

            if (r === player.location.row && c === player.location.col) {
                var next = curr;
                var path = [];
                while (next.parent != null) {
                    path.push(next.location);
                    next = next.parent;
                }

                return path.reverse();
            }

            for (var i = 0; i < 8; i++) {
                var rr = r + dr[i];
                var cc = c + dc[i];

                var origin = room[0][0].location;

                if (rr < origin.row || cc < origin.col) {
                    continue;
                }
                if (rr > room[room.length - 1][0].location.row || cc > room[0][room[0].length - 1].location.col) {
                    continue;
                }
                if (visited[rr] !== undefined) {
                    if (visited[rr][cc]) {
                        continue;
                    }
                }
                if (room[rr - origin.row][cc - origin.col].tileType === "wall") {
                    continue;
                }

                var next = new Node({ row: rr, col: cc }, curr);
                // key = { row: rr, col: cc };

                if (visited[rr] !== undefined) {
                    if (visited[rr][cc]) {
                        continue;
                    }
                }
                q.push(next);
                if (visited[rr] === undefined) {
                    visited[rr] = [];
                }
                visited[rr][cc] = true;
            }
        }
        return null;
    }

    /**
     * @desc Returns the room that the adversary is in, else returns null;
     */
    getAdversaryRoom() {
        var room = null;
        rooms: for (var i = 0; i < this.rooms.length; i++) {
            var origin = this.rooms[i][0][0].location;
            var rows = this.rooms[0].length;
            var cols = this.rooms[0][0].length;
            if (
                this.location.row >= origin.row &&
                this.location.row < origin.row + rows &&
                this.location.col >= origin.col &&
                this.location.col < origin.col + cols
            ) {
                room = this.rooms[i];
                break rooms;
            }
        }
        return room;
    }

    /**
     * @desc Returns true if the adversary is in a hallway
     */
    getAdversaryHallway() {
        for (var row = 0; row < this.layout.length; row++) {
            for (var col = 0; col < this.layout.length; col++) {
                if (this.location.row === row && this.location.col === col) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @desc Returns the player in the same room as the adversary
     * @param layout: the layout that the player is in
     */
    getClosestPlayer(layout) {
        var players = [];
        var origin = layout[0][0].location;
        var rows = layout.length;
        var cols = layout[0].length;
        for (let value of Object.values(this.playerLocations)) {
            if (
                value.location.row >= origin.row &&
                value.location.row < origin.row + rows &&
                value.location.col >= origin.col &&
                value.location.col < origin.col + cols &&
                !(value.exited)
            ) {
                players.push(value);
            }
        }

        if (players.length === 0) {
            return false;
        } else if (players.length === 1) {
            return players[0];
        }

        var curMin = this.getShortestPath(players[0], layout).length;
        var curPlayer = players[0];
        for (var i = 1; i < players.length; i++) {
            var curDist = this.getShortestPath(players[i], layout).length;
            if (curDist < curMin) {
                curMin = curDist;
                curPlayer = players[i];
            }
        }

        return curPlayer;
    }
}

module.exports = Adversary;
