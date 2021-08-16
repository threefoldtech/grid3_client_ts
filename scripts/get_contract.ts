import { TFClient } from "../tf-grid/client"


async function main() {
    const mnemonic = "fiscal play spin all describe because stem disease coral call bronze please";
    const url = "wss://explorer.devnet.grid.tf/ws"
    const tf_client = new TFClient(url, mnemonic)
    await tf_client.connect()
    tf_client.contracts.getContract(5);
}
main()
