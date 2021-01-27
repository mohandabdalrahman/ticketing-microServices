import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../database/models/user';
import jwt from 'jsonwebtoken';
import Password from '../services/Password';
import validateRequest from '../middleWares/validate-request';
const router = express.Router();

router.post(
  '/api/users/signin',
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

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // throw new BadRequestError('Email in use');
      return res
        .status(400)
        .send({ errors: [{ message: 'Invalid credentials' }] });
    }
    // validate password
    const isPasswordValid = await Password.compare(
      existingUser.password,
      password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ errors: [{ message: 'Invalid credentials' }] });
    }
    // generate token
    const userToken = jwt.sign(
      { email, id: existingUser.id },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userToken,
    };
    return res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
