import { TFClient } from "./tf-grid/client"


async function main() {
    const mnemonic = "false boss tape wish talent pool ghost token exhibit response hedgehog invite";
    const url = "wss://explorer.devnet.grid.tf/ws"
    const tf_client = new TFClient(url, mnemonic)
    await tf_client.connect()
    tf_client.contracts.cancelContract(84);
}
main()