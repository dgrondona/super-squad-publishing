import { log } from "./logger";

// Info / Debug / Trace
log.info("This is an info message");
log.debug("This is a debug message");

log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");
log.trace("This is a trace message");


// Warnings
log.warn("This is a warning message", { user: "draven" });

// Errors
log.error("This is an error message");
log.fatal("This is a fatal message", { code: 500 });