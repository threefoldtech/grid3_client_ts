"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appPath = exports.updatejson = exports.dumpToFile = exports.loadFromFile = void 0;
const FS = __importStar(require("fs"));
const PATH = __importStar(require("path"));
const appdata_path_1 = __importDefault(require("appdata-path"));
const appsPath = (0, appdata_path_1.default)();
const appPath = PATH.join(appsPath, "grid3_client");
exports.appPath = appPath;
function loadFromFile(path) {
    if (!FS.existsSync(PATH.dirname(path))) {
        FS.mkdirSync(PATH.dirname(path));
    }
    if (!FS.existsSync(path)) {
        dumpToFile(path, {});
    }
    const data = FS.readFileSync(path);
    return JSON.parse(data.toString());
}
exports.loadFromFile = loadFromFile;
function dumpToFile(path, data) {
    FS.writeFileSync(path, JSON.stringify(data));
}
exports.dumpToFile = dumpToFile;
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
exports.updatejson = updatejson;
