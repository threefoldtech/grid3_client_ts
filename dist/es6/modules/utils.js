var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GridClient } from "../client";
import { TFClient } from "../clients/tf-grid/client";
// used as decorator
function checkBalance(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { substrateURL, mnemonic, storePath, keypairType } = GridClient.config;
            const tfclient = new TFClient(substrateURL, mnemonic, storePath, keypairType);
            const balances = yield tfclient.balance.getMyBalance();
            if (balances["free"] < 1) {
                throw Error("Balance is not enough to apply an extrinsic");
            }
            return yield method.apply(this, args);
        });
    };
}
export { checkBalance };
