"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObject = void 0;
const class_validator_1 = require("class-validator");
async function validateObject(obj) {
    const errors = await (0, class_validator_1.validate)(obj);
    // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("Validation failed. errors:", errors);
        throw Error(`Validation failed. errors: ${errors}`);
    }
    else {
        console.log('Validation succeed');
    }
}
exports.validateObject = validateObject;
