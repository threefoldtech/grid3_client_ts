import "reflect-metadata";
const metadataKey = "exposeDecorator";
function expose(target, propertyKey) {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}
function isExposed(instance, propertyKey) {
    return Reflect.hasMetadata(metadataKey, instance, propertyKey);
}
export { expose, isExposed };
