import { log } from "./logger"; // adjust path if needed

describe("Logger", () => {
    let logSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
        logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("info logs with console.log", () => {
        log.info("test message");

        expect(logSpy).toHaveBeenCalledTimes(1);
        const call = logSpy.mock.calls[0][0];

        expect(call).toContain("[INFO]");
        expect(call).toContain("test message");
    });

    test("debug logs with console.log", () => {
        log.debug("debug message");

        expect(logSpy).toHaveBeenCalledTimes(1);
        const call = logSpy.mock.calls[0][0];

        expect(call).toContain("[DEBUG]");
        expect(call).toContain("debug message");
    });

    test("warn logs with console.warn", () => {
        log.warn("warning!");

        expect(warnSpy).toHaveBeenCalledTimes(1);
        const call = warnSpy.mock.calls[0][0];

        expect(call).toContain("[WARN]");
        expect(call).toContain("warning!");
    });

    test("error logs with console.error", () => {
        log.error("something failed");

        expect(errorSpy).toHaveBeenCalledTimes(1);
        const call = errorSpy.mock.calls[0][0];

        expect(call).toContain("[ERROR]");
        expect(call).toContain("something failed");
    });

    test("fatal logs with console.error", () => {
        log.fatal("fatal crash");

        expect(errorSpy).toHaveBeenCalledTimes(1);
        const call = errorSpy.mock.calls[0][0];

        expect(call).toContain("[FATAL]");
        expect(call).toContain("fatal crash");
    });

    test("logger includes context when passed", () => {
        const ctx = { userId: 123 };

        log.info("hello", ctx);

        expect(logSpy).toHaveBeenCalledTimes(1);

        const [message, contextArg] = logSpy.mock.calls[0];

        expect(message).toContain("hello");
        expect(contextArg).toEqual(ctx);
    });

    test("logger adds ISO timestamp", () => {
        log.info("timestamp test");

        const call = logSpy.mock.calls[0][0];

        // Should match ISO date format
        const isoRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
        expect(call).toMatch(isoRegex);
    });
});