const Client = require('tfgrid-api-client')
import { Contracts } from './contracts'


class TFClient {
    client: any;
    contracts: any;

    constructor(url, mnemonic) {
        this.client = new Client(url, mnemonic);
        this.contracts = new Contracts(this.client);
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