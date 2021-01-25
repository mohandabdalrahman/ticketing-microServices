import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import NotFoundError from './errors/NotFound';
import 'express-async-errors'
const app = express();
app.use(express.json());

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

app.listen(4000, () => console.log('Listening on port 4000!!!! 🚀'));
