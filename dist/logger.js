"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var levelColors = {
    info: "\x1b[92m", // green
    debug: "\x1b[36m", // cyan
    trace: "\x1b[90m", // gray
    warn: "\x1b[93m", // yellow
    error: "\x1b[31m", // red
    fatal: "\x1b[31m\x1b[103m", // red
};
function getTimeStamp() {
    return new Date().toISOString();
}
function formatStackLine(line) {
    var funcMatch = line.match(/at (.+?) \(/); // function name
    var pathMatch = line.match(/\((.+):(\d+):(\d+)\)/); // file:line:col
    var funcName = funcMatch ? "\u001B[93m".concat(funcMatch[1], "\u001B[0m") : '';
    var filePath = '';
    if (pathMatch) {
        var _ = pathMatch[0], file = pathMatch[1], lineNum = pathMatch[2], col = pathMatch[3];
        var shortFile = file.replace(process.cwd(), '.'); // shorten absolute path
        filePath = "\u001B[33m".concat(shortFile, "\u001B[0m:\u001B[90m").concat(lineNum, ":").concat(col, "\u001B[0m");
    }
    return "\u001B[90m    at \u001B[0m".concat(funcName, " (").concat(filePath, ")");
}
function getStackTrace(maxLines) {
    if (maxLines === void 0) { maxLines = 5; }
    var err = new Error();
    if (!err.stack)
        return "";
    var stack = err.stack.split("\n").slice(4, 4 + maxLines);
    // format lines
    var yellow = "\x1b[93m";
    var reset = "\x1b[0m";
    return stack.map(formatStackLine).join("\n");
}
function formatContext(ctx) {
    if (!ctx)
        return "";
    var gray = "\x1b[90m";
    var reset = "\x1b[0m";
    // Convert each key/value pair to a "key=value" string
    var parts = Object.entries(ctx).map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, ": ").concat(value);
    });
    // Join all parts with a space so it stays on one line
    return gray + parts.join("  ") + reset;
}
function generatePrefix(level) {
    var timestamp = getTimeStamp();
    var bold = "\x1b[1m";
    var reset = "\x1b[0m";
    if (level == "trace") {
        return "".concat(levelColors[level], "[").concat(timestamp, "] [").concat(level.toUpperCase(), "]:").concat(reset, " ");
    }
    return "".concat(levelColors[level]).concat(bold, "[").concat(timestamp, "] [").concat(level.toUpperCase(), "]:").concat(reset, " ");
}
function generateArgs(level, message, context) {
    var color = levelColors[level];
    var gray = "\x1b[90m";
    var reset = "\x1b[0m";
    var prefix = generatePrefix(level);
    var contextString = formatContext(context);
    if (level == "trace") {
        return context ? ["".concat(prefix).concat(color).concat(message).concat(reset), contextString] : ["".concat(prefix).concat(color).concat(message).concat(reset)];
    }
    else if (level == "error" || level == "fatal") {
        var stack = "\n" + getStackTrace() + "\n";
        return context ? ["".concat(prefix).concat(message), contextString, stack] : ["".concat(prefix).concat(message), stack];
    }
    return context ? ["".concat(prefix).concat(message), contextString] : ["".concat(prefix).concat(message)];
}
function createLogger() {
    var log = function (level, message, context) {
        var args = generateArgs(level, message, context);
        switch (level) {
            case "info":
            case "debug":
            case "trace":
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
        trace: function (msg, ctx) { return log("trace", msg, ctx); },
        warn: function (msg, ctx) { return log("warn", msg, ctx); },
        error: function (msg, ctx) { return log("error", msg, ctx); },
        fatal: function (msg, ctx) { return log("fatal", msg, ctx); },
    };
}
exports.log = createLogger();
