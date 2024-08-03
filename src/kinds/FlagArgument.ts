import type { Argument } from "./Argument";

/**
 * A Flag argument is a way to parse user input into boolean values
 *
 * @example
 * ```ts
 * let flag = new Flag()
 *              .withName("flag")
 * ```
 */
export default class FlagArgument implements Argument {
	name: string | undefined;
	id: string | undefined;
	short: string | undefined;
	required = false;
	default?: boolean;

	constructor(
		name?: string,
		id?: string,
		shortId?: string,
		required?: boolean,
		defaultValue?: boolean,
	) {
		this.name = name;
		this.id = id;
		this.short = shortId;
		this.required = required ? required : false;
		this.default = defaultValue ? defaultValue : undefined;
	}

	/**
	 * Sets the argument name, this is a required method, otherwise the argument will be skipped over.
	 * @param name
	 * @returns The updated value of this argument.
	 */
	withName(name: string): FlagArgument {
		this.name = name;
		return this;
	}

	/**
	 * Sets the argument id, allowing us to search the input for `--<id>` parameters.
	 * @param id
	 * @returns The updated value of this argument.
	 */
	withIdentifier(id: string): FlagArgument {
		this.id = id;
		return this;
	}

	/**
	 * Sets the argument id, allowing us to search the input for `-<shortId>` parameters.
	 * @param shortId
	 * @returns The updated value of this argument.
	 */
	withShortIdentifier(shortId: string): FlagArgument {
		this.short = shortId;
		return this;
	}

	/**
	 * Sets whether or not the argument is required. If required but not present,
	 * the application will log an error and then exit
	 * @param required
	 * @returns The updated value of this argument.
	 */
	setRequired(required = true): FlagArgument {
		this.required = required;
		return this;
	}

	/**
	 * Set the default value to return if `required` is set,
	 * but the flag is not present.
	 * @param value
	 * @returns The updated value of this argument.
	 */
	setDefault(value = false): FlagArgument {
		this.default = value;
		return this;
	}

	/**
	 * Takes an array of strings (split at whitespace), and parses them into the resulting arguments based off of internal values set using the builder methods.
	 * @param input
	 * @returns A boolean representing if the flag is present.
	 */
	process(input: string[]): boolean | null {
		if (this.id) {
			if (input.includes(`--${this.id}`)) return true;
		} else {
			if (input.includes(`--${this.name}`)) return true;
		}

		if (this.short) {
			if (input.includes(`-${this.short}`)) return true;
		}

		if (this.default !== undefined) return this.default;
		if (this.required) {
			const display = this.id ? this.id : this.name;
			console.log(
				`\x1b[31mError\x1b[0m: The argument '${display}' is required.\nTo prevent further errors, this process will now exit`,
			);
			if (!process.env.TEST_PREVENT_EXIT) {
				process.exit();
			} else return null;
		}
		return false;
	}
}
