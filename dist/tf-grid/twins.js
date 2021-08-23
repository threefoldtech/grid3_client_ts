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
        this.client = client;
    }
    create(ip, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.createTwin(ip, callback);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const twin = yield this.client.getTwinByID(id);
            return twin;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const twins = yield this.client.listTwins();
            return twins;
        });
    }
    delete(id, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.deleteTwin(id, callback);
        });
    }
    createTwinEntity(twinID, entityID, signature, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.addTwinEntity(twinID, entityID, signature, callback);
        });
    }
    deleteTwinEntity(twinID, entityID, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.removeTwinEntity(twinID, entityID, callback);
        });
    }
}
exports.Twins = Twins;
