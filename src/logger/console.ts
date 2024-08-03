import type { EnumValue } from "../enums";
import type { Logger, LogLevelType } from "./types";
import { WrappedLogger } from "./wrapped";

export class ConsoleLogger extends WrappedLogger implements Logger {
	constructor(logLevel: EnumValue<LogLevelType>) {
		super(console, logLevel);
	}
}
