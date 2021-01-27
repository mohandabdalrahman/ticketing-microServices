import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../database/models/user';
import jwt from 'jsonwebtoken';
import validateRequest from '../middleWares/validate-request';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // check user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // throw new BadRequestError('Email in use');
      return res.status(400).send({ errors: [{ message: 'Email in use' }] });
    }
    // creating user
    const user = User.build({ email, password });
    await user.save();

    // generate jwt token
    const userJwt = jwt.sign({ email, id: user.id }, process.env.JWT_KEY!);

    // store on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
