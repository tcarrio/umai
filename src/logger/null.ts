import type { Logger } from "./types";

export class NullLogger implements Logger {
	debug(...data: unknown[]): void {}
	error(...data: unknown[]): void {}
	info(...data: unknown[]): void {}
	trace(...data: unknown[]): void {}
	warn(...data: unknown[]): void {}
}
