import * as fs from "fs"
import * as path from "path"
import * as os from "os"

export class NpmConfig {

    public setValue(key: string, value?: string, namespace?: string) {
        var fullKey = key;
        if (namespace) {
            fullKey = `${namespace}:${fullKey}`;
        }
        var rcPath = path.join(os.homedir(), ".npmrc");
        var content = "";
        if (fs.existsSync(rcPath)) {
            content = fs.readFileSync(rcPath, { encoding: "utf8" });
        }
        content += `${fullKey}=${value}\n`;
        fs.writeFileSync(rcPath, content);
    }

}
