enum ZdbModes {
	seq = "seq",
	user = "user"
}

enum DeviceTypes {
	hdd = "hdd",
	ssd = "ssd"
}

class Zdb {
	namespace: string = "";
	// size in bytes
	size: number;
	mode: ZdbModes = ZdbModes.seq;
	password: string = "";
	disk_type: DeviceTypes = DeviceTypes.hdd;
	public: boolean = false;

	challenge() {

		let out = "";
		out += this.size || "";
		out += this.mode.toString();
		out += this.password;
		out += this.disk_type.toString();
		out += this.public.toString();

		return out

	}
}



class ZdbResult {
	name: string = "";
	namespace: string = "";
	ips: string[];
	port: number = 0;
}


export { Zdb, ZdbResult }