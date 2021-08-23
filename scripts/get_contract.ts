import { TFClient } from "../src/tf-grid/client"


async function main() {
    const mnemonic = "fiscal play spin all describe because stem disease coral call bronze please";
    const url = "wss://explorer.devnet.grid.tf/ws"
    const tf_client = new TFClient(url, mnemonic)
    await tf_client.connect()
    tf_client.contracts.get(5);
}
main()
