import { error } from "console";

type logLevel = "info" | "debug" | "warn" | "error" | "fatal";

interface logContext {
    [key: string]: any;
}

const levelColors: Record<logLevel, string> = {
    info:  "\x1b[0m", // default
    debug: "\x1b[0m", // default
    warn:  "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    fatal: "\x1b[31m", // red
}

function getTimeStamp() {

    return new Date().toISOString();

}

function createLogger() {

    const log = (level: logLevel, message: string, context?: logContext) => {
        const timestamp = getTimeStamp();

        const color = levelColors[level] || "\x1b[0m";
        const reset = "\x1b[0m";

        const prefix = `${color}[${timestamp}] [${level.toUpperCase()}]:${reset} `;
        const args = context ? [`${prefix}${message}`, context] : [`${prefix}${message}`];

        switch(level) {
            case "info":
            case "debug":
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
        warn: (msg: string, ctx?: logContext) => log("warn", msg, ctx),
        error: (msg: string, ctx?: logContext) => log("error", msg, ctx),
        fatal: (msg: string, ctx?: logContext) => log("fatal", msg, ctx),
    };

}

export const log = createLogger();