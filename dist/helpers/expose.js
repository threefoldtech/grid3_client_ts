"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExposed = exports.expose = void 0;
require("reflect-metadata");
const metadataKey = "exposeDecorator";
function expose(target, propertyKey) {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}
exports.expose = expose;
function isExposed(instance, propertyKey) {
    return Reflect.hasMetadata(metadataKey, instance, propertyKey);
}
exports.isExposed = isExposed;
