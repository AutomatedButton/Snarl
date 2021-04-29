// import Render from "../Game/Render.js";
const Render = require("../Game/Render.js")
/**
 * @desc LocalObserver receives game updates and shows the observer that information
 */
class LocalObserver {
    constructor() {}

    /**
     * @desc Updates the local observer with information about the game
     * @param gamestate: the current gamestate
     */
    receiveUpdates(gamestate, window) {
        var rend = new Render(gamestate, window, "Observer");
        rend.RenderInit();
    }
}
module.exports = LocalObserver;
// export default LocalObserver;
