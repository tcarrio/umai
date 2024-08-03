import { IllegalAsyncCallback } from "../errors";
import { isNullish } from "../nullish";
import type { AdvancedArgument, EventCallback } from "./Argument";

/**
 * A String argument is a way to convert user input into a string which can be processed by your application.
 *
 * It implements the AdvancedArgument model, which adds a method that gets called if `default` is undefined, __and__ `required` is `true`
 *
 * @example
 * ```ts
 * let file = new String()
 *              .withName("file")
 * ```
 */
export default class StringArgument implements AdvancedArgument {
	name: string | undefined;
	id: string | undefined;
	short: string | undefined;
	required = false;
	default?: string;
	missing?: EventCallback;

	constructor(
		name?: string,
		id?: string,
		shortId?: string,
		required?: boolean,
		defaultValue?: string,
	) {
		this.name = name;
		this.id = id;
		this.short = shortId;
		this.required = required ?? false;
		this.default = defaultValue ?? undefined;
	}

	/**
	 * Sets the argument name, this is a required method, otherwise the argument will be skipped over.
	 * @param name
	 * @returns The updated value of this argument.
	 */
	withName(name: string): StringArgument {
		this.name = name;
		return this;
	}

	/**
	 * Sets the argument id, allowing us to search the input for `--<id>` parameters.
	 * @param id
	 * @returns The updated value of this argument.
	 */
	withIdentifier(id: string): StringArgument {
		this.id = id;
		return this;
	}

	/**
	 * Sets the argument id, allowing us to search the input for `-<shortId>` parameters.
	 * @param shortId
	 * @returns The updated value of this argument.
	 */
	withShortIdentifier(id: string): StringArgument {
		this.short = id;
		return this;
	}

	/**
	 * Sets whether or not the argument is required. If required but not present,
	 * the application will log an error and then exit
	 * @param required
	 * @returns The updated value of this argument.
	 */
	setRequired(required = true): StringArgument {
		this.required = required;
		return this;
	}

	/**
	 * Set the default value to return if `required` is set,
	 * but the flag is not present.
	 * @param value
	 * @returns The updated value of this argument.
	 */
	setDefault(value = ""): StringArgument {
		this.default = value;
		return this;
	}

	onMissing(cb: EventCallback): StringArgument {
		const isAsync = cb.constructor.name === "AsyncFunction";

		if (isAsync) {
			throw new IllegalAsyncCallback(
				"\x1b[33mAdvancedArgument#onMissing\x1b[0m may only be provided with a synchronous method.",
			);
		}

		this.missing = cb;
		return this;
	}

	/**
	 * Takes an array of strings (split at whitespace), and parses them into the resulting arguments based off of internal values set using the builder methods.
	 * @param input
	 * @returns A string representing the value of the flag, if present, or `null` if not.
	 */
	process(input: string[]): string | null {
		let value = null;
		if (this.id) {
			value = returnValue(input, input.indexOf(`--${this.id}`));
		} else {
			value = returnValue(input, input.indexOf(`--${this.name}`));
		}

		if (this.short && isNullish(value)) {
			value = returnValue(input, input.indexOf(`-${this.short}`));
		}

		if (isNullish(value) && this.default !== undefined) return this.default;
		if (isNullish(value) && this.required) {
			if (this.missing) {
				value = this.missing(input);
			} else {
				const display = this.id ? this.id : this.name;
				console.log(
					`\x1b[31mError\x1b[0m: The argument '${display}' is required.\nTo prevent further errors, this process will now exit`,
				);
				if (!process.env.TEST_PREVENT_EXIT) {
					process.exit();
				}

				return null;
			}
		}
		return value;
	}
}

// takes the input array, and the position the flag was detected at,
// and uses this information to extract the argument value.
function returnValue(input: string[], position: number): string | null {
	// check if the argument was actually located
	if (position > -1) {
		// pre-set the value to be the index of the flag + 1
		let value = input[position + 1];
		let offset = 2;

		// If the flag contains a double quote, keep on appending the next entry in the
		// array until it either reaches `length` or finds another double quote.
		while (value.split('"').length === 2 && position + offset < input.length) {
			value += ` ${input[position + offset]}`;
			offset += 1;
		}

		// Strip value of any double quotes and return it in a single string format.
		return value.split('"').join("");
	}

	return null;
}
