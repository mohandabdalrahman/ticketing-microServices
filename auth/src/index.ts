import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleWares/error-handler';
import NotFoundError from './errors/NotFound';
import connectDatabase from './database/db';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// Start database
connectDatabase();

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

/** routes */
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
// Handle not found route
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(4000, () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must defined');
  }
  console.log('Listening on port 4000!!!! 🚀');
});
