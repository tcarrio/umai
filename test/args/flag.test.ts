import { describe, expect, it } from "bun:test";
import { umai } from "../deps";

const { FlagArgument, Umai } = umai;

describe("Flag#constructor", () => {
	it("Creates a new empty flag argument.", () => {
		expect(new FlagArgument().name).toBe(undefined);
	});
});

describe("Flag.withName -> Flag", () => {
	it("the name for this argument, used to define it's output in 'Umai.values'", () => {
		const flag = new FlagArgument().withName("test");

		expect(flag.name).toBe("test");
	});
});

describe("Flag.withIdentifier -> Flag", () => {
	it("the argument identifier to search for (uses name if not set)", () => {
		const flag = new FlagArgument().withName("test").withIdentifier("testflag");

		expect(flag.id).toBe("testflag");
	});
});

describe("Flag.setRequired -> Flag", () => {
	it("ensures the argument is required, or optional, depending on it's value", () => {
		const flag = new FlagArgument().withName("test").setRequired(true);

		const flag2 = new FlagArgument().withName("test");

		expect(flag.required).toBe(true);

		expect(flag2.required).toBe(false);
	});
});

describe("Flag.setDefault -> Flag", () => {
	it("sets the default value to return if the flag is not present", () => {
		const flag = new FlagArgument().withName("test").setDefault(true);

		const flag2 = new FlagArgument().withName("test");

		expect(flag.default).toBe(true);

		expect(flag2.default).toBe(undefined);
	});
});

describe("Flag.withShortIdentifier -> Flag", () => {
	it("the short argument to search for, if identifier isn't found", () => {
		const flag = new FlagArgument().withName("test").withShortIdentifier("t");

		expect(flag.short).toBe("t");
	});
});

describe("Flag.process -> Boolean", () => {
	it("returns true if flag is present in input", () => {
		const flag = new FlagArgument()
			.withName("test")
			.withIdentifier("testflag")
			.withShortIdentifier("t");

		const testLong = new Umai([flag], { source: "--testflag" });
		const testShort = new Umai([flag], { source: "-t" });
		const testAbsent = new Umai([flag]);

		testLong.parse();
		testShort.parse();
		testAbsent.parse();

		expect(testLong.values.test).toBe(true);

		expect(testShort.values.test).toBe(true);

		expect(testAbsent.values.test).toBe(false);
	});
});

describe("Flag.process (required) -> Boolean", () => {
	it("returns true if flag is present in input", () => {
		const flag = new FlagArgument()
			.withName("test")
			.withIdentifier("testflag")
			.withShortIdentifier("t")
			.setRequired(true)
			.setDefault(true);
		const testAbsent = new Umai([flag]);

		testAbsent.parse();

		expect(testAbsent.values.test).toBe(true);
	});
});

describe("Flag.process (required no defualt) -> Boolean", () => {
	it("returns true if flag is present in input", () => {
		const flag = new FlagArgument()
			.withName("test")
			.withIdentifier("testflag")
			.withShortIdentifier("t")
			.setRequired(true);
		const testAbsent = new Umai([flag]);

		console.log(
			"\x1b[32mTHIS TEST SHOULD 'THROW' AN ERROR, BUT NOT EXIT (AND SHOULD PASS)\x1b[0m",
		);

		testAbsent.parse();

		expect(testAbsent.values.test).toBe(null);
	});
});
