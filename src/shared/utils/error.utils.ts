import { ValidationError } from "class-validator";

/**
 * Utility class to deal with validation errors.
 *
 * @abstract
 * @class ErrorUtils
 */
export abstract class ErrorUtils {
    /**
     * Collect nested validation errors recursively
     * and append to a return object.
     *
     * @static
     * @param {ValidationError[]} errors
     * @returns {*}
     * @memberof ErrorUtils
     */
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
