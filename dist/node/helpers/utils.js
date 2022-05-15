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
exports.log = exports.randomNonce = exports.randomSecretAsHex = exports.randomSecret = exports.randomChoice = exports.getRandomNumber = exports.generateString = void 0;
const tweetnacl_1 = __importStar(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
function generateString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateString = generateString;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomNumber = getRandomNumber;
function randomChoice(choices) {
    const random = Math.floor(Math.random() * choices.length);
    return choices[random];
}
exports.randomChoice = randomChoice;
function randomSecret() {
    return (0, tweetnacl_1.randomBytes)(tweetnacl_1.default.box.secretKeyLength);
}
exports.randomSecret = randomSecret;
function randomSecretAsHex() {
    return tweetnacl_util_1.default.encodeBase64(randomSecret());
}
exports.randomSecretAsHex = randomSecretAsHex;
function randomNonce() {
    return (0, tweetnacl_1.randomBytes)(tweetnacl_1.default.box.nonceLength);
}
exports.randomNonce = randomNonce;
function log(message) {
    console.log(JSON.stringify(message, null, 2));
}
exports.log = log;
