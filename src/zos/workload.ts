import { Znet } from "./znet";
import { Zmount, ZmountResult } from "./zmount";
import { Zmachine, ZmachineResult } from "./zmachine";
import { Zdb, ZdbResult } from "./zdb";
import { PublicIP } from "./ipv4";
import { GatewayFQDNProxy, GatewayNameProxy, GatewayResult } from "./gateway";

enum ResultStates {
	error = "error",
	ok = "ok",
	deleted = "deleted"
}

enum WorkloadTypes {
	zmachine = "zmachine",
	zmount = "zmount",
	network = "network",
	zdb = "zdb",
	ipv4 = "ipv4",
	gatewayfqdnproxy = "gatewayfqdnproxy",
	gatewaynameproxy = "gatewaynameproxy"
}


enum Right {
	restart,
	delete,
	stats,
	logs
}

// Access Control Entry
class ACE {
	// the administrator twin id
	twin_ids: number[];
	rights: Right[];
}


class DeploymentResult {
	created: number;
	state: ResultStates;
	error: string = "";
	data: string = ""; // also json.RawMessage
}

class Workload {
	version: number;
	// unique name per Deployment
	name: string;
	type: WorkloadTypes;
	// this should be something like json.RawMessage in golang
	data: Zmount | Znet | Zmachine | Zdb | PublicIP | GatewayFQDNProxy | GatewayNameProxy; // serialize({size: 10}) ---> "data": {size:10},

	metadata: string;
	description: string;

	// list of Access Control Entries
	// what can an administrator do
	// not implemented in zos
	// acl []ACE

	result: DeploymentResult;

	challenge() {
		let out = "";
		out += this.version;
		out += this.type.toString();
		out += this.metadata;
		out += this.description;
		out += this.data.challenge();

		return out
	}

}



type WorkloadData = Zmount | Zdb | Zmachine | Znet | GatewayFQDNProxy | GatewayNameProxy
type WorkloadDataResult = ZmountResult | ZdbResult | ZmachineResult | GatewayResult

// pub fn(mut w WorkloadData) challenge() string {
// 	return w.challenge()
// }

export { Workload, WorkloadTypes, WorkloadData, WorkloadDataResult }