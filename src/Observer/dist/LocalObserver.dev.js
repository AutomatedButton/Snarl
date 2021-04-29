"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import Render from "../Game/Render.js";
var Render = require("../Game/Render.js");
/**
 * @desc LocalObserver receives game updates and shows the observer that information
 */


var LocalObserver =
/*#__PURE__*/
function () {
  function LocalObserver() {
    _classCallCheck(this, LocalObserver);
  }
  /**
   * @desc Updates the local observer with information about the game
   * @param gamestate: the current gamestate
   */


  _createClass(LocalObserver, [{
    key: "receiveUpdates",
    value: function receiveUpdates(gamestate, window) {
      var rend = new Render(gamestate, window, "Observer");
      rend.RenderInit();
    }
  }]);

  return LocalObserver;
}();

module.exports = LocalObserver; // export default LocalObserver;