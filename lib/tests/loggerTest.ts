import { log } from "../logger.js"; // adjust path

console.log("\n=== SIMPLE LOGGER TEST ===\n");

// Info
log.info("This is an info message");
log.info("Info with context", { user: "Alice", id: 1 });

// Warn
log.warn("Warning: Something might be wrong");
log.warn("Warning with context", { disk: "95%" });

// Error
log.error("Something broke!");
log.error("Error with context", { route: "/artist/draven-grondona" });

// Fatal
log.fatal("Critical failure!!");
log.fatal("Fatal with context", { service: "Sanity CMS" });

// Debug
log.debug("Debug message");
log.debug("Debug with context", { value: 42 });

console.log("\n=== END OF LOGGER TEST ===\n");
