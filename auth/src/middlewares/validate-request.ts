import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  /** handle errors */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array(), 400);
  }
  next()
};


export default validateRequest;