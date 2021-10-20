import { WorkloadBaseData } from "./workload_base";
class PublicIP extends WorkloadBaseData {
    challenge() {
        return "";
    }
}

export { PublicIP };
