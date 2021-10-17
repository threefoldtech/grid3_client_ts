"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFCHAIN_URL = exports.MNEMONICS = exports.TWIN_ID = void 0;
const TWIN_ID = process.env.TWIN_ID || "0";
exports.TWIN_ID = TWIN_ID;
const MNEMONICS = process.env.MNEMONICS || "";
exports.MNEMONICS = MNEMONICS;
const TFCHAIN_URL = process.env.TFCHAIN_URL || "wss://tfchain.dev.threefold.io";
exports.TFCHAIN_URL = TFCHAIN_URL;
