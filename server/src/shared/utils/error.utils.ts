import { ValidationError } from 'class-validator';

export abstract class ErrorUtils {
  public static toErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }
}
