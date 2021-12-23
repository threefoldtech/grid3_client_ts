import { GridClient } from "../client";
import { TFClient } from "../clients/tf-grid/client";

// used as decorator
function checkBalance(target, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
        const { substrateURL, mnemonic, storePath, keypairType } = GridClient.config;
        const tfclient = new TFClient(substrateURL, mnemonic, storePath, keypairType);
        const balances = await tfclient.balance.getMyBalance();
        if (balances["free"] < 1) {
            throw Error("Balance is not enough to apply an extrinsic");
        }
        return await method.apply(this, args);
    };
}

export { checkBalance };
