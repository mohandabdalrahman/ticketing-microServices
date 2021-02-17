import express from 'express';

import { NotFound, errorHandler, currentUser } from '@motickets/common';
import connectDatabase from './database/db';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';
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

// Middleware
app.use(currentUser);

/** routes */
app.use(createChargeRouter);
// Handle not found route
app.all('*', () => {
  throw new NotFound();
});

app.use(errorHandler);

export { app };
