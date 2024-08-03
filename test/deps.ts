import umai from "../src/umai";

// Package version, keep in line with package.json, and src/quarrel.ts,
// otherwise tests will fail;
const VERSION: string = "0.1.0";

// TestItem, used for all static tests (eg: tests which require no input processing)
const TestItem = new umai.Umai();

export { VERSION, TestItem, umai };

process.env.TEST_PREVENT_EXIT = "true";
