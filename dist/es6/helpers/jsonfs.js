import * as FS from "fs";
import * as PATH from "path";
import getAppDataPath from "appdata-path";
const appsPath = getAppDataPath();
const appPath = PATH.join(appsPath, "grid3_client");
function loadFromFile(path) {
    if (!FS.existsSync(PATH.dirname(path))) {
        FS.mkdirSync(PATH.dirname(path), { recursive: true });
    }
    if (!FS.existsSync(path)) {
        dumpToFile(path, {});
    }
    const data = FS.readFileSync(path);
    return JSON.parse(data.toString());
}
function dumpToFile(path, data) {
    FS.writeFileSync(path, JSON.stringify(data));
}
function updatejson(path, name, data = null, action = "add") {
    const storedData = loadFromFile(path);
    if (action === "add") {
        storedData[name] = data;
    }
    else if (action === "delete") {
        delete storedData[name];
    }
    dumpToFile(path, storedData);
}
export { loadFromFile, dumpToFile, updatejson, appPath };
