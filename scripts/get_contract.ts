import { TFClient } from "../tf-grid/client"


async function main() {
    const mnemonic = "muscle error ocean company away boat grape twin sister source mammal enable";
    const url = "wss://explorer.devnet.grid.tf/ws"
    const tf_client = new TFClient(url, mnemonic)
    await tf_client.connect()
    tf_client.contracts.getContract(53);
}
main()