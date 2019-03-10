import { ValidationError } from 'class-validator';

export abstract class ErrorUtils {
  public static toErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }

  public static createErrors(errors: ValidationError[]) {
    const errorCollector = (object: any, result: any[]) => {
      if (object.hasOwnProperty('constraints')) {
        result.push({ [object.property]: Object.values(object.constraints) });
      }

      for (const key of Object.keys(object)) {
        if (typeof object[key] === 'object') {
          errorCollector(object[key], result);
        }
      }
    };

    const contraintErrors = [];

    errors.forEach(error => {
      errorCollector(error, contraintErrors);
    });

    return contraintErrors;
  }
}
