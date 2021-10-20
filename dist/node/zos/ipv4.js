"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIP = void 0;
const workload_base_1 = require("./workload_base");
class PublicIP extends workload_base_1.WorkloadBaseData {
    challenge() {
        return "";
    }
}
exports.PublicIP = PublicIP;
