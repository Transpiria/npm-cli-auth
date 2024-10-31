import { ConsoleColors } from "./ConsoleColors";
import { UserLoginResponse } from "./models/responses/UserLoginResponse";
import { NpmClient } from "./npmClient";
import { NpmConfig } from "./NpmConfig";

export async function login(registry: string, user: string, password: string) {
    var registryUrl = registry;
    if (!registryUrl.startsWith("http")) {
        registryUrl = `https://${registryUrl}`;
    }
    if (!registryUrl.endsWith("/")) {
        registryUrl += "/";
    }
    registry = registryUrl.split("://", 2)[1];

    console.info(`Authenticating with ${registry}`);
    var client = new NpmClient();
    let token = password;
    let whoami = await client.whoami(registry, token);
    let result: UserLoginResponse | null = null;
    if (!whoami.username || whoami.username == "anonymous") {
        result = await client.authenticate(registryUrl, user, password);
        if (result.ok && result.token) {
            token = result.token;
            whoami = await client.whoami(registry, token);
        } else {
            console.error(ConsoleColors.red, `Failed to authenticate ${result.status}`);
            if (result.errors) {
                for (const error of result.errors) {
                    console.error(ConsoleColors.red, error.message);
                }
            } else if (result.error) {
                console.error(ConsoleColors.red, result.error);
            } else if (result.message) {
                console.error(ConsoleColors.red, result.message);
            }
            return false;
        }
    }

    console.info(ConsoleColors.green, `Successfully authenticated ${whoami.username}`);
    const config = new NpmConfig();
    config.setValue("_authToken", token, `//${registry}`);
    return true;
}

const helpText = `npm-cli-auth

Usage:  npm-cli-auth [options]

Command options:
  -r, --registry        registry to authenticate with
  -u, --user            user name
  -p, --password        password or token for user
`;

export async function run() {
    var registry = process.env.NPM_REGISTRY ?? "registry.npmjs.org";
    var user = process.env.NPM_USER;
    var password = process.env.NPM_PASSWORD;

    let showHelp = false;
    for (let index = 0; index < process.argv.length; index++) {
        const argument = process.argv[index];
        switch (argument) {
            case "--registry":
            case "-r":
                registry = process.argv[++index];
                break;
            case "--user":
            case "-u":
                user = process.argv[++index];
                break;
            case "--password":
            case "-u":
                password = process.argv[++index];
                break;
            case "--help":
                showHelp = true;
                break;
            default:
                break;
        }
    }

    let validated = true;
    if (!registry && !showHelp) {
        validated = false;
        console.error(ConsoleColors.red, "Missing registry");
    }
    if (!user && !showHelp) {
        validated = false;
        console.error(ConsoleColors.red, "Missing user");
    }
    if (!password && !showHelp) {
        validated = false;
        console.error(ConsoleColors.red, "Missing password");
    }

    if (validated && !showHelp && user && password) {
        try {
            var success = await login(registry, user, password);
            process.exitCode = success ? 0 : 1;
        } catch (error) {
            console.log(ConsoleColors.red, error);
            process.exitCode = 3;
        }
    } else {
        if (!validated) {
            process.exitCode = 1;
        }
        console.info(helpText);
    }
}

run();
