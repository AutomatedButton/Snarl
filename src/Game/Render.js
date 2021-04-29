class Render {
    constructor(gamestate, canvas, player) {
        this.canvas = canvas;
        this.context = null;
        this.size = 900;
        this.buffer = 0;
        this.gamestate = gamestate;
        if (!player) {
            this.playerLocation = null;
        } else if (player.name != undefined) {
            this.playerLocation = player.location;
        } else if (player === "observer") {
            this.playerLocation = "Observer";
        }
        // this.playerLocation = playerLocation;
    }

    // Initializes all of the drawing elements
    RenderInit() {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.context = this.canvas.getContext("2d");
        this.buffer = this.size / this.gamestate.layout.length;
        this.draw();
        this.drawKey();
        this.drawExit();
        this.drawPlayers();
        this.drawAdversaries();
    }
    /**
     * @desc Loops over the level and draws a 5x5 grid around the current player
     **/
    draw() {
        for (var row = 0; row < this.gamestate.layout.length; row++) {
            for (var col = 0; col < this.gamestate.layout.length; col++) {
                var tile = this.gamestate.layout[row][col];
                if (this.playerLocation) {
                    if (
                        (Math.abs(this.playerLocation.row - row) <= 2 && Math.abs(this.playerLocation.col - col) <= 2) ||
                        this.playerLocation === "Observer"
                    ) {
                        if (tile.tileType == "wall") {
                            this.context.fillStyle = "#888888";
                            this.context.strokeStyle = "#000000";
                            // this.context.lineWidth = 1;
                        } else if (tile.tileType == "floor") {
                            this.context.fillStyle = "#FFFFFF";
                            this.context.strokeStyle = "#000000";
                            // this.context.lineWidth = 1;
                        } else if (tile.tileType == "hallway") {
                            this.context.fillStyle = "#45B6FE";
                            this.context.strokeStyle = "#000000";
                            // this.context.lineWidth = 1;
                        }
                        this.context.fillRect(col * this.buffer, row * this.buffer, this.buffer, this.buffer);
                        this.context.strokeRect(col * this.buffer, row * this.buffer, this.buffer, this.buffer);
                    }
                }
            }
        }
    }
    /**
     * @desc Draws all of the players on the gameboard that are in a 5x5 grid around the current player
     */
    drawPlayers() {
        for (let value of Object.values(this.gamestate.players)) {
            if (this.playerLocation) {
                if (
                    (Math.abs(this.playerLocation.row - value.location.row) <= 2 &&
                        Math.abs(this.playerLocation.col - value.location.col) <= 2) ||
                    this.playerLocation === "Observer"
                ) {
                    if (!value.exited) {
                        this.context.fillStyle = "#ADD8E6";
                        this.context.strokeStyle = "#000000";
                        // this.context.lineWidth = 1;
                        this.context.fillRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                        this.context.strokeRect(
                            value.location.col * this.buffer,
                            value.location.row * this.buffer,
                            this.buffer,
                            this.buffer
                        );
                    }
                }
            }
        }
    }
    /**
     * @desc Draws all of the adversaries on the game board that are in a 5x5 grid around the current player
     */
    drawAdversaries() {
        for (let value of Object.values(this.gamestate.adversaries)) {
            if (this.playerLocation) {
                if (
                    (Math.abs(this.playerLocation.row - value.location.row) <= 2 &&
                        Math.abs(this.playerLocation.col - value.location.col) <= 2) ||
                    this.playerLocation === "Observer"
                ) {
                    this.context.fillStyle = "#FF0000";
                    this.context.strokeStyle = "#000000";
                    // this.context.lineWidth = 1;
                    this.context.fillRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                    this.context.strokeRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                }
            }
        }
    }

    /**
     * @desc Draws the key on the game board if it is in a 5x5 grid around the current player
     */

    drawKey() {
        if (this.gamestate.objects["key"]) {
            var value = this.gamestate.objects["key"];
            if (this.playerLocation) {
                if (
                    (Math.abs(this.playerLocation.row - value.location.row) <= 2 &&
                        Math.abs(this.playerLocation.col - value.location.col) <= 2) ||
                    this.playerLocation === "Observer"
                ) {
                    this.context.fillStyle = "#FFFF00";
                    this.context.strokeStyle = "#000000";
                    this.context.fillRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                    this.context.strokeRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                }
            }
        }
    }

    /**
     * @desc Draws the exit on the game board if it is in a 5x5 grid around the current player
     */

    drawExit() {
        var value = this.gamestate.objects["exit"];
        if (this.playerLocation) {
            if (
                (Math.abs(this.playerLocation.row - value.location.row) <= 2 &&
                    Math.abs(this.playerLocation.col - value.location.col) <= 2) ||
                this.playerLocation === "Observer"
            ) {
                this.context.fillStyle = "#00FF00";
                this.context.strokeStyle = "#000000";
                this.context.fillRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
                this.context.strokeRect(value.location.col * this.buffer, value.location.row * this.buffer, this.buffer, this.buffer);
            }
        }
    }
}
module.exports = Render;
