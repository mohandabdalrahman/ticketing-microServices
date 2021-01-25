import CustomError from './CustomError';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode: number = 500;
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}