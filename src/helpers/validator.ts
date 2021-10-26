import { validate } from "class-validator";

async function validateObject(obj) {
    const errors = await validate(obj);
    // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("Validation failed. errors:", errors);
        throw Error(`Validation failed. errors: ${errors}`);
    } else {
        console.log("Validation succeed");
    }
}

export { validateObject };
