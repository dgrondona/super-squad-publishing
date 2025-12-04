import { error, info } from "console";
import fs from "fs";
import path from "path";

export type logLevel = "info" | "debug" | "trace" | "warn" | "error" | "fatal";

export interface logContext {
    [key: string]: any;
}

export interface logEntry {
    timestamp: string;
    level: logLevel;
    message: string;
    context?: logContext;
    stack?: string[];
}

export interface loggerOptions {
    level?: logLevel;
    context?: logContext;
    outputFile?: string | null;
}

class Log {
    private level: logLevel;
    private context: logContext;
    private outputFile: string | null;
    private levels: logLevel[] = ["trace", "info", "debug", "warn", "error", "fatal"];

    // class constructor
    constructor(options: loggerOptions = {}) {
        this.level = options.level ?? "info";
        this.context = options.context ?? {};
        this.outputFile = options.outputFile ?? null;

        // overwrite log file on startup
        if(this.outputFile) {
            const dir = path.dirname(this.outputFile);
            if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
            fs.writeFileSync(this.outputFile, "");
        }
    }

    // get stack trace from where we are logging
    private stackTrace(maxLines = 5) {
        const err = new Error();
        if (!err.stack) return undefined;

        return err.stack.split("\n").slice(2, 2 + maxLines).map(line => line.trim());
    }

    // build the log
    private buildLog(level: logLevel, message: string, context?: logContext): logEntry {
        
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: { ...this.context, ...context },
            stack: this.stackTrace(),
        };

    }

    // print to console
    private printHandler(log: logEntry) {
        
    }

    // write to logs
    private write(log: logEntry) {

    }

    // core logging
    private log(level: logLevel, msg: string, ctx?: logContext) {
        if(!this.level.includes(level)) {
            throw new Error(`Invalid log level: ${level}`);
        }

        const entry = this.buildLog(level, msg, ctx);
        this.write(entry);

    }

    // public interface
    trace(msg: string, ctx?: logContext) { this.log("trace", msg, ctx); }
    info(msg: string, ctx?: logContext) { this.log("info", msg, ctx); }
    debug(msg: string, ctx?: logContext) { this.log("debug", msg, ctx); }
    warn(msg: string, ctx?: logContext) { this.log("warn", msg, ctx); }
    error(msg: string, ctx?: logContext) { this.log("error", msg, ctx); }
    fatal(msg: string, ctx?: logContext) { this.log("fatal", msg, ctx); }
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

function formatStackLine(line: string) {
    const funcMatch = line.match(/at (.+?) \(/); // function name
    const pathMatch = line.match(/\((.+):(\d+):(\d+)\)/); // file:line:col

    let funcName = funcMatch ? `\x1b[93m${funcMatch[1]}\x1b[0m` : '';
    let filePath = '';
    if (pathMatch) {
        const [_, file, lineNum, col] = pathMatch;
        const shortFile = file.replace(process.cwd(), '.'); // shorten absolute path
        filePath = `\x1b[33m${shortFile}\x1b[0m:\x1b[90m${lineNum}:${col}\x1b[0m`;
    }

    return `\x1b[90m    at \x1b[0m${funcName} (${filePath})`;

}

function getStackTrace(maxLines = 5): string {
    const err = new Error();
    if (!err.stack) return "";

    const stack = err.stack.split("\n").slice(4, 4 + maxLines);

    // format lines
    const yellow = "\x1b[93m";
    const reset = "\x1b[0m";

    return stack.map(formatStackLine).join("\n");
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
    } else if (level == "error" || level == "fatal") {
        const stack = "\n" + getStackTrace() + "\n";

        return context ? [`${prefix}${message}`, contextString, stack] : [`${prefix}${message}`, stack];
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