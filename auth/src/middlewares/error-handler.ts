import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/CustomError';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log('error here')
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.log(`Something went wrong ${err}`);
  res.status(500).send({ errors: [{ message: err.message }] });
};
