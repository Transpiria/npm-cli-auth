import { UserLoginResponse } from "./models/responses/UserLoginResponse";
import { WhoamiResponse } from "./models/responses/WhoamiResponse";

export class NpmClient {

    public async whoami(registry: string, token: string) {
        var endpoint = this.buildRegistryUrl(registry) + `-/whoami`;
        var response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        let result = await response.json() as WhoamiResponse;
        result.status = response.status;
        return result;
    }

    public async authenticate(registry: string, name: string, password: string) {
        var endpoint = this.buildRegistryUrl(registry) + `-/user/org.couchdb.user:${name}`;
        var response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                password,
            }),
        });
        let result = await response.json() as UserLoginResponse;
        result.status = response.status;
        return result;
    }

    private buildRegistryUrl(registry: string) {
        if (!registry.startsWith("http")) {
            registry = `https://${registry}`;
        }
        if (!registry.endsWith("/")) {
            registry += "/";
        }
        return registry;
    }
}
