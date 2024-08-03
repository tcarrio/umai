import umai from "@0xc/umai";
import type { LogLevel, EnumKey } from "@0xc/umai";
import type { LogLevelType } from "../src/logger";

interface CliArgs {
	clientId: string;
	baseUrl: string;
	scopes: string;
	audience: string;
	copy: boolean;
	logLevel: EnumKey<typeof LogLevel>;
}

export function parseCliArgs(): CliArgs {
	const clientId = new umai.StringArgument()
		.withName("clientId")
		.withIdentifier("client-id")
		.withShortIdentifier("i")
		.setRequired(true)
		.setDefault(process.env.OAUTH_CLIENT_ID);

	const baseUrl = new umai.StringArgument()
		.withName("baseUrl")
		.withIdentifier("base-url")
		.withShortIdentifier("u")
		.setRequired(true)
		.setDefault(process.env.OAUTH_BASE_URL);

	const scopes = new umai.StringArgument()
		.withName("scopes")
		.withIdentifier("scopes")
		.withShortIdentifier("s")
		.setRequired(true)
		.setDefault(process.env.OAUTH_SCOPES);

	const audience = new umai.StringArgument()
		.withName("audience")
		.withIdentifier("audience")
		.withShortIdentifier("a")
		.setRequired(true)
		.setDefault(process.env.OAUTH_AUDIENCE);

	const logLevel = new umai.StringArgument()
		.withName("logLevel")
		.withIdentifier("log-level")
		.withShortIdentifier("L")
		.setRequired(true)
		.setDefault(
			process.env.LOG_LEVEL ?? ("Info" satisfies EnumKey<LogLevelType>),
		);

	const copy = new umai.FlagArgument()
		.withName("copy")
		.withIdentifier("copy")
		.withShortIdentifier("c")
		.setDefault(false);

	const client = new umai.Umai([
		clientId,
		baseUrl,
		scopes,
		audience,
		logLevel,
		copy,
	]);

	client.parse();

	return client.values;
}
