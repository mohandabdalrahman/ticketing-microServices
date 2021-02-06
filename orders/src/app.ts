import express from 'express';

import { NotFound, errorHandler, currentUser } from '@motickets/common';
import connectDatabase from './database/db';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { fetchOrder } from './routes/fetch-order';
import { deleteOrder } from './routes/delete-order'
import { createOrder } from './routes/create-order'
import { fetchAllOrders } from './routes/retrieve-orders'
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
app.use(fetchAllOrders);
app.use(createOrder);
app.use(deleteOrder);
app.use(fetchOrder);
// Handle not found route
app.all('*', () => {
  throw new NotFound();
});

app.use(errorHandler);

export { app };
