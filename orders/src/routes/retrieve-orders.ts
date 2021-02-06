import express, { Request, Response } from 'express';
import { Order } from '../database/models/order';
import { NotFound, requireAuth } from '@motickets/common';
const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser.id,
  }).populate('ticket')
  if (!orders) {
    throw new NotFound();
  }
  res.status(200).send(orders);
});

export { router as fetchAllOrders };
