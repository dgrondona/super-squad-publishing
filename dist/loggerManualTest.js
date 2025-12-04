"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
// Info / Debug / Trace
logger_1.log.info("This is an info message");
logger_1.log.debug("This is a debug message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
logger_1.log.trace("This is a trace message");
// Warnings
logger_1.log.warn("This is a warning message", { user: "draven" });
// Errors
logger_1.log.error("This is an error message");
logger_1.log.fatal("This is a fatal message", { code: 500 });
