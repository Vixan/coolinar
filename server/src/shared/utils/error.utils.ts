import { ValidationError } from "class-validator";

export abstract class ErrorUtils {
    public static createErrors(errors: ValidationError[]): any {
        const errorCollector = (object: any, result: any) => {
            if (object && object.hasOwnProperty("constraints")) {
                result[object.property] = Object.values(object.constraints);
            }

            for (const key of Object.keys(object || {})) {
                if (typeof object[key] === "object") {
                    errorCollector(object[key], result);
                }
            }
        };

        const constraintErrors = {};

        errors.forEach(error => {
            errorCollector(error, constraintErrors);
        });

        return constraintErrors;
    }
}
