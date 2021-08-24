"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twins = void 0;
class Twins {
    constructor(client) {
        this.tfclient = client;
    }
    create(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.createTwin, [ip], "tfgridModule", "TwinStored");
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.client.getTwinByID(id);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.client.listTwins();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tfclient.applyExtrinsic(this.tfclient.client.deleteTwin, [id], "tfgridModule", "TwinDeleted");
        });
    }
}
exports.Twins = Twins;
