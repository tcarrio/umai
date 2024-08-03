import { describe, expect, it } from "bun:test";
import { umai } from "../deps";

const { StringArgument, Umai } = umai;

describe("StringArgument#constructor", () => {
	it("Creates a new empty string argument.", () => {
		expect(new StringArgument().name).toBe(undefined);
	});
});

describe("StringArgument.withName -> StringArgument", () => {
	it("the name for this flag, used to define it's output in 'Umai.values'", () => {
		const string = new StringArgument().withName("test");

		expect(string.name).toBe("test");
	});
});

describe("StringArgument.withIdentifier -> StringArgument", () => {
	it("the argument identifier to search for (uses name if not set)", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument");

		expect(string.id).toBe("testArgument");
	});
});

describe("StringArgument.withShortIdentifier -> StringArgument", () => {
	it("the short argument to search for, if identifier isn't found", () => {
		const string = new StringArgument()
			.withName("test")
			.withShortIdentifier("t");

		expect(string.short).toBe("t");
	});
});

describe("StringArgument.process (single word)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument")
			.withShortIdentifier("t");

		const testLong = new Umai([string], { source: "--testArgument variable" });
		const testShort = new Umai([string], { source: "-t variable" });
		const testAbsent = new Umai([string]);

		testLong.parse();
		testShort.parse();
		testAbsent.parse();

		expect(testLong.values.test).toBe("variable");

		expect(testShort.values.test).toBe("variable");

		expect(testAbsent.values.test).toBe(null);
	});
});

describe("StringArgument.setRequired -> StringArgument", () => {
	it("ensures the argument is required, or optional, depending on it's value", () => {
		const string = new StringArgument().withName("test").setRequired(true);
		StringArgument;
		const string2 = new StringArgument().withName("test");

		expect(string.required).toBe(true);

		expect(string2.required).toBe(false);
	});
});

describe("StringArgument.setDefault -> StringArgument", () => {
	it("sets the default value to return if the argument is not present", () => {
		const string = new StringArgument().withName("test").setDefault("default");

		const string2 = new StringArgument().withName("test");

		expect(string.default).toBe("default");

		expect(string2.default).toBe(undefined);
	});
});

describe("StringArgument.process (double quotes)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument")
			.withShortIdentifier("t");

		const testLong = new Umai([string], {
			source: '--testArgument "longer variable"',
		});
		const testShort = new Umai([string], { source: '-t "longer variable"' });
		const testAbsent = new Umai([string]);

		testLong.parse();
		testShort.parse();
		testAbsent.parse();

		expect(testLong.values.test).toBe("longer variable");

		expect(testShort.values.test).toBe("longer variable");

		expect(testAbsent.values.test).toBe(null);
	});
});

describe("StringArgument.process (double quotes no ending)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument")
			.withShortIdentifier("t");

		const testLong = new Umai([string], {
			source: '--testArgument "longer variable with no end',
		});
		const testShort = new Umai([string], {
			source: '-t "longer variable with no end',
		});
		const testAbsent = new Umai([string]);

		testLong.parse();
		testShort.parse();
		testAbsent.parse();

		expect(testLong.values.test).toBe("longer variable with no end");

		expect(testShort.values.test).toBe("longer variable with no end");

		expect(testAbsent.values.test).toBe(null);
	});
});

describe("StringArgument.process (required no default)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument")
			.withShortIdentifier("t")
			.setRequired(true);

		const testAbsent = new Umai([string]);

		console.log(
			"\x1b[32mTHIS TEST SHOULD 'THROW' AN ERROR, BUT NOT EXIT (AND SHOULD PASS)\x1b[0m",
		);

		testAbsent.parse();

		expect(testAbsent.values.test).toBe(null);
	});
});

describe("StringArgument.process (required with default)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.withIdentifier("testArgument")
			.withShortIdentifier("t")
			.setRequired(true)
			.setDefault("testing");

		const testAbsent = new Umai([string]);

		testAbsent.parse();

		expect(testAbsent.values.test).toBe("testing");
	});
});

describe("StringArgument.onMissing (with Illegal Async)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		let errored = false;
		try {
			const string = new StringArgument()
				.withName("test")
				.setRequired(true)
				.onMissing(async (text: string[]) => {
					console.log(text);
				});
		} catch (e) {
			console.log("IllegalAsyncCallback error threw as expected");
			errored = true;
		}

		expect(errored).toBe(true);
	});
});

describe("StringArgument.process (with callback)", () => {
	it("returns the value of the argument requested, or null if unavailable", () => {
		const string = new StringArgument()
			.withName("test")
			.setRequired(true)
			.onMissing((_text: string[]) => {
				return null;
			});

		const testAbsent = new Umai([string]);

		testAbsent.parse();

		expect(testAbsent.values.test).toBe(null);
	});
});
