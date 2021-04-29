"use strict";

var sock = io();
var level = null;
sock.on('message', function (level) {});