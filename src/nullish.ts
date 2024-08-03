export function isNullish(value: unknown): value is null | undefined {
	return typeof value === "undefined" || value === null;
}
