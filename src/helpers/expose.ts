import "reflect-metadata";

const metadataKey = "exposeDecorator";

function expose(target, propertyKey: string): void {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}

function isExposed<T>(instance: T, propertyKey: string): boolean {
    return Reflect.hasMetadata(metadataKey, instance, propertyKey);
}
export { expose, isExposed };
