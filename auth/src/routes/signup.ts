import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').notEmpty().isEmail().withMessage('Email must be valid'),
    body('password')
      .notEmpty()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    /** handle errors */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array(), 400);
    }
    const { email, password } = req.body;
    // creating user
    res.send({});
  }
);

export { router as signUpRouter };
