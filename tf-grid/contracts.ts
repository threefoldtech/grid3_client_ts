import { callback } from './utils'

class Contracts {
    client: any;

    constructor(client) {
        this.client = client;
    }
    async createContract(nodeID, hash, data, publicIPs, callback) {
        const innerCallback = (res) => {
            if (res instanceof Error) {
                console.log(res)
                process.exit(1)
            }
            const { events = [], status } = res
            if (status.isFinalized) {
                // Loop through Vec<EventRecord> to display all events
                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log("section>>>", section, "method>>>", method, "data>>>>>", data)

                    if (section === 'system' && method === 'ExtrinsicFailed') {
                        console.log('Failed')
                        // process.exit(1)
                    } else if (section === 'smartContractModule' && method === 'ContractCreated') {
                        return callback(data.toJSON()[0]);
                    }
                })
            }
        }
        return this.client.createContract(nodeID, data, hash, publicIPs, innerCallback)
    }

    async updateContract(id, data, hash) {

        return this.client.updateContract(id, data, hash, callback)
    }

    async cancelContract(id) {

        return this.client.cancelContract(id, callback)
    }

    async getContract(id) {

        const contract = await this.client.getContractByID(id, callback)
        console.log(contract)
    }
}
export { Contracts }
