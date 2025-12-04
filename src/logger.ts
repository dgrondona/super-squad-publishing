import { error } from "console";

type logLevel = "info" | "debug" | "trace" | "warn" | "error" | "fatal";

interface logContext {
    [key: string]: any;
}

const levelColors: Record<logLevel, string> = {
    info:  "\x1b[92m", // green
    debug: "\x1b[36m", // cyan
    trace: "\x1b[90m", // gray
    warn:  "\x1b[93m", // yellow
    error: "\x1b[31m", // red
    fatal: "\x1b[31m\x1b[103m", // red
}

function getTimeStamp() {

    return new Date().toISOString();

}

function formatContext(ctx?: logContext) {
  if (!ctx) return "";

  const gray = "\x1b[90m";
  const reset = "\x1b[0m";

  // Convert each key/value pair to a "key=value" string
  const parts = Object.entries(ctx).map(([key, value]) => `${key}: ${value}`);

  // Join all parts with a space so it stays on one line
  return gray + parts.join("  ") + reset;
}

function generatePrefix(level: logLevel){
    const timestamp = getTimeStamp();

    const bold = "\x1b[1m";
    const reset = "\x1b[0m";

    if(level == "trace") {
        return `${levelColors[level]}[${timestamp}] [${level.toUpperCase()}]:${reset} `;
    }

    return `${levelColors[level]}${bold}[${timestamp}] [${level.toUpperCase()}]:${reset} `;

}

function generateArgs(level: logLevel, message: string, context?: logContext) {
    const color = levelColors[level];
    const gray = "\x1b[90m";
    const reset = "\x1b[0m";

    const prefix = generatePrefix(level);
    const contextString = formatContext(context);

    if(level == "trace") {
        return context ? [`${prefix}${color}${message}${reset}`, contextString] : [`${prefix}${color}${message}${reset}`];
    }

    return context ? [`${prefix}${message}`, contextString] : [`${prefix}${message}`];

}

function createLogger() {

    const log = (level: logLevel, message: string, context?: logContext) => {
        const args = generateArgs(level, message, context);

        switch(level) {
            case "info":
            case "debug":
            case "trace":
                console.log(...args);
                break;
            case "warn":
                console.warn(...args);
                break;
            case "error":
            case "fatal":
                console.error(...args);
                break;
        }

    };

    return {
        info: (msg: string, ctx?: logContext) => log("info", msg, ctx),
        debug: (msg: string, ctx?: logContext) => log("debug", msg, ctx),
        trace: (msg: string, ctx?: logContext) => log("trace", msg, ctx),
        warn: (msg: string, ctx?: logContext) => log("warn", msg, ctx),
        error: (msg: string, ctx?: logContext) => log("error", msg, ctx),
        fatal: (msg: string, ctx?: logContext) => log("fatal", msg, ctx),
    };

}

export const log = createLogger();