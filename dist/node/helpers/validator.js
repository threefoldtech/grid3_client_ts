"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = exports.validateObject = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
async function validateObject(obj) {
    const errors = await (0, class_validator_1.validate)(obj);
    // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("Validation failed. errors:", errors);
        throw Error(`Validation failed. errors: ${errors}`);
    }
    else {
        console.log("Validation succeed");
    }
}
exports.validateObject = validateObject;
// used as decorator
function validateInput(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
        const types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        for (let i = 0; i < args.length; i++) {
            const input = (0, class_transformer_1.plainToInstance)(types[i], args[i], { excludeExtraneousValues: true });
            await validateObject(input);
        }
        return await method.apply(this, args);
    };
}
exports.validateInput = validateInput;
