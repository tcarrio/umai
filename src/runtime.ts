import type { EnumValue } from "./enums";

export function getRuntime(): RuntimeType {
	switch (true) {
		case typeof Bun !== "undefined":
			return Runtime.Bun;

		// @ts-ignore
		case typeof Deno !== "undefined":
			logWarning(Runtime.Deno);
			return Runtime.Deno;

		default:
			logWarning(Runtime.Node);
			return Runtime.Node;
	}
}

export type RuntimeType = EnumValue<typeof Runtime>;
export const Runtime = {
	Bun: "Bun",
	Deno: "Deno", // Not Supported
	Node: "Node", // Not Supported
} as const;

function logWarning(runtime: RuntimeType) {
	switch (runtime) {
		case Runtime.Deno: {
			// @ts-ignore
			if (Deno.isTTY()) {
				console.log(
					"\x1b[33mWARNING\x1b[0m - Umai is not supported in Deno.\nThis library will not work as expected, if at all.",
				);
			} else {
				console.log(
					"WARNING - Umai is not supported in Deno.\nThis library will not work as expected, if at all.",
				);
			}
			break;
		}
		case Runtime.Node: {
			// @ts-ignore
			if (process.stdout.isTTY()) {
				console.log(
					"\x1b[33mWARNING\x1b[0m - Umai is not supported in Node.\nThis library will not work as expected, if at all.",
				);
			} else {
				console.log(
					"WARNING - Umai is not supported in Node.\nThis library will not work as expected, if at all.",
				);
			}
		}
	}
}
