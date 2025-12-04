import { log } from "./logger";

// Info / Debug
log.info("This is an info message");
log.debug("This is a debug message");

// Warnings
log.warn("This is a warning message", { user: "draven" });

// Errors
log.error("This is an error message");
log.fatal("This is a fatal message", { code: 500 });