var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
function validateObject(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = yield validate(obj);
        // errors is an array of validation errors
        if (errors.length > 0) {
            console.log("Validation failed. errors:", errors);
            throw Error(`Validation failed. errors: ${errors}`);
        }
        else {
            console.log("Validation succeed");
        }
    });
}
// used as decorator
function validateInput(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
            for (let i = 0; i < args.length; i++) {
                const input = plainToInstance(types[i], args[i], { excludeExtraneousValues: true });
                yield validateObject(input);
            }
            return yield method.apply(this, args);
        });
    };
}
export { validateObject, validateInput };
