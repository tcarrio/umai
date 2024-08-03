import DefaultHelper from "./helper";
import type { Argument } from "./kinds/Argument";

export type HelpFunction = (args: Argument[]) => void;

export interface QualifiedOptions {
	source: string | string[];
	// TODO: Add help support
	help: HelpFunction;
}

// Docs coming soon
export interface UmaiOpts {
	source?: string | string[];
	// TODO: Add help support
	help?: HelpFunction;
}

export const DefaultOptions: UmaiOpts = {
	source: process.argv,
	help: DefaultHelper,
};

// Converts the user-provided options from the UmaiOpts format to
// the QualifiedOptions format, used internally for logic and parsing.
export function validateOptions(opts: UmaiOpts): QualifiedOptions {
	const final: QualifiedOptions = {
		source: process.argv,
		help: DefaultHelper,
	};

	if (opts.source) final.source = opts.source;

	return final;
}
