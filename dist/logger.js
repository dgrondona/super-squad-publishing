"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var levelColors = {
    info: "\x1b[0m", // default
    debug: "\x1b[0m", // default
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    fatal: "\x1b[31m", // red
};
function getTimeStamp() {
    return new Date().toISOString();
}
function createLogger() {
    var log = function (level, message, context) {
        var timestamp = getTimeStamp();
        var color = levelColors[level] || "\x1b[0m";
        var bold = "\x1b[1m";
        var reset = "\x1b[0m";
        var prefix = "".concat(color).concat(bold, "[").concat(timestamp, "] [").concat(level.toUpperCase(), "]:").concat(reset, " ");
        var args = context ? ["".concat(prefix).concat(message), context] : ["".concat(prefix).concat(message)];
        switch (level) {
            case "info":
            case "debug":
                console.log.apply(console, args);
                break;
            case "warn":
                console.warn.apply(console, args);
                break;
            case "error":
            case "fatal":
                console.error.apply(console, args);
                break;
        }
    };
    return {
        info: function (msg, ctx) { return log("info", msg, ctx); },
        debug: function (msg, ctx) { return log("debug", msg, ctx); },
        warn: function (msg, ctx) { return log("warn", msg, ctx); },
        error: function (msg, ctx) { return log("error", msg, ctx); },
        fatal: function (msg, ctx) { return log("fatal", msg, ctx); },
    };
}
exports.log = createLogger();
