import type { Argument } from "./kinds/Argument";
import { getRuntime, type RuntimeType } from "./runtime";

import FlagArgument from "./kinds/FlagArgument";
import StringArgument from "./kinds/StringArgument";
import { type QualifiedOptions, type UmaiOpts, validateOptions } from "./opts";

export const UmaiState = Symbol.for("__umai_state__");

type SemVer = `${number}.${number}.${number}`;

type ValueState = unknown & {
	[UmaiState]: {
		version: SemVer;
		runtime: RuntimeType;
	};
};

/**
 * The class that makes the magic happen.
 */
class Umai {
	VERSION: SemVer = "0.1.0";
	values: ValueState = {
		[UmaiState]: {
			version: this.VERSION,
			runtime: getRuntime(),
		},
	};
	options: QualifiedOptions;

	args: Argument[];

	/**
	 * Application name. Used in help command.
	 */
	name?: string;

	/**
	 * Application version. Used in help command.
	 */
	version?: string;

	/**
	 * Application description. Used in help command.
	 */
	description?: string;

	/**
	 * Initialize a new application, with all of your arguments.
	 */
	constructor(args: Argument[] = [], opts: UmaiOpts = {}) {
		this.options = validateOptions(opts);
		this.args = args;
	}

	defineArgument(argument: Argument) {
		this.args.push(argument);
	}

	addArg = this.defineArgument;

	/**
	 * Using the arguments provided, take the input source and conver it
	 * into values stored in the `values` key
	 */
	parse() {
		if (this.args.length > 0) {
			if (!Array.isArray(this.options.source))
				this.options.source = this.options.source.split(" ");
			for (const argId in this.args) {
				const arg = this.args[argId];

				if (arg.name === undefined)
					console.log("Argument cannot be processed, no name...");
				else if (arg.name === "__quarrel")
					throw new Error(
						"Illegal argument name: '__quarrel', name reserved for internal usages.",
					);
				else {
					this.values[arg.name] = arg.process(this.options.source);
				}
			}
		}
	}
}

export default {
	FlagArgument: FlagArgument,
	StringArgument: StringArgument,
	Umai,
};

export type { LogLevel } from "./logger";
export type { EnumKey, EnumValue } from "./enums";
