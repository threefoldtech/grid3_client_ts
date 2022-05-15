"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crop = void 0;
function crop(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        const x = args[0].split("grid3_client/");
        args[0] = x.length === 2 ? x[1] : x[0];
        return method.apply(this, args);
    };
}
exports.crop = crop;
