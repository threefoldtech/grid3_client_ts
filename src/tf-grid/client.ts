const Client = require('tfgrid-api-client')
import { Contracts } from './contracts'
import { Twins } from "./twins"


class TFClient {
    client: any;
    contracts: Contracts;
    twins: Twins

    constructor(url, mnemonic) {
        this.client = new Client(url, mnemonic);
        this.contracts = new Contracts(this.client);
        this.twins = new Twins(this.client)
    }
    async connect() {
        try {
            await this.client.init();
        } catch (err) {
            console.error(err);
        }
    }
    disconnect() {
        this.client.api.disconnect();
    }

}
export { TFClient }