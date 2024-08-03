import { describe, expect, it } from "bun:test";

import { TestItem, VERSION, umai } from "./deps";
import { UmaiState } from "../src/umai";

const { StringArgument, Umai } = umai;

describe("Umai.values state version", () => {
	it("stores the package version", () => {
		expect(TestItem.values[UmaiState].version).toBe(VERSION);
	});
});

describe("Umai.values state runtime", () => {
	it("informs the package which methods to use for processing", () => {
		expect(TestItem.values[UmaiState].runtime).toBe("Bun");
	});
});

describe("Umai.constructor", () => {
	it("Accepts values for configuration as well as arguments to parse", () => {
		expect(TestItem.args.length).toBe(0);
	});
});

describe("Umai.defineArgument", () => {
	it("Accepts values for configuration as well as arguments to parse", () => {
		const arg = new String("testArg", "testArg", "t", true, "eco");

		const bakery = new Umai();
		expect(bakery.args.length).toBe(0);

		bakery.defineArgument(arg);

		expect(bakery.args.length).toBe(1);
	});
});

describe("Umai.addArg", () => {
	it("alias for defineArgument", () => {
		const arg = new String("testArg", "testArg", "t", true, "eco");

		const bakery = new Umai();
		expect(bakery.args.length).toBe(0);

		bakery.addArg(arg);

		expect(bakery.args.length).toBe(1);
	});
});
