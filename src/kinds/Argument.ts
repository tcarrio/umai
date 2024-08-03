/**
 * An interface defining the requirements of all Argument prototypes
 */
export interface Argument {
	name?: string;
	description?: string;
	shortDescription?: string;
	required: boolean;
	default?: unknown;

	process(input: string[]): unknown;
}

export interface AdvancedArgument extends Argument {
	missing?: EventCallback;

	onMissing?(callback: EventCallback): unknown;
}

/**
 * Callback method which accepts an array of strings, and returns the
 * data type you provide, or null depending on what the callback method returns.
 *
 * The callback is only called when the AdvancedArgument's settings define it as a required argument with no default value.
 */
export type EventCallback = (input: string[]) => unknown | null;
