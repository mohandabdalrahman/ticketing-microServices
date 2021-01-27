import CustomError from './CustomError';

class NotFound extends CustomError {
  statusCode = 404;
  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, NotFound.prototype);
  }
  serializeErrors() {
    return [{ message: 'Route not found' }];
  }
}

export default NotFound;
