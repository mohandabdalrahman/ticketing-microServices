import { ValidationError } from 'express-validator';
import CustomError from './CustomError';
export class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[], public statusCode: number) {
    super();
    // when extend build in class for your class work fine
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      };
    });
  }
}
