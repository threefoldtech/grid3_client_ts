declare class Deployment {
    version: number;
    twinId: number;
    metadata: string;
    description: string;
    contractId: number;
    expiration: number;
    workloads: Workload[];
    loadFromJSON(d: Record<string, unknown>): void;
    loadWorkloadsFromJSON(a: Record<string, unknown>[]): Workload[];
}
declare class Workload {
    version: number;
    name: string;
    type: WorkloadTypes;
    data: Record<string, unknown>;
    result: WorkloadResult;
    loadFromJSON(w: Record<string, unknown>): void;
}
declare class WorkloadResult {
    created: number;
    state: WorkloadState;
    message: string;
    data: Record<string, unknown>;
    loadFromJSON(r: Record<string, unknown>): void;
}
declare enum WorkloadTypes {
    network = 0,
    zmount = 1,
    zmachine = 2,
    K8S = 3,
    zdb = 4
}
declare enum WorkloadState {
    ok = 0,
    error = 1,
    deleted = 2
}
export { WorkloadTypes, WorkloadState, WorkloadResult, Deployment, Workload };
//# sourceMappingURL=models.d.ts.map