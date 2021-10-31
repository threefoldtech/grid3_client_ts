import * as FS from "fs";
import * as PATH from "path";
import getAppDataPath from "appdata-path";

const appsPath = getAppDataPath();
const appPath = PATH.join(appsPath, "grid3_client");

function loadFromFile(path: string) {
    if (!FS.existsSync(PATH.dirname(path))) {
        FS.mkdirSync(PATH.dirname(path), { recursive: true });
    }
    if (!FS.existsSync(path)) {
        dumpToFile(path, {});
    }
    const data = FS.readFileSync(path);
    return JSON.parse(data.toString());
}

function dumpToFile(path: string, data): void {
    FS.writeFileSync(path, JSON.stringify(data));
}

function updatejson(path: string, name: string, data = null, action = "add"): void {
    const storedData = loadFromFile(path);
    if (action === "add") {
        storedData[name] = data;
    } else if (action === "delete") {
        delete storedData[name];
    }
    dumpToFile(path, storedData);
}

export { loadFromFile, dumpToFile, updatejson, appPath };
