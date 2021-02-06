import express, { Request, Response } from 'express';
import { NotFound, requireAuth } from '@motickets/common';
import { Order } from '../database/models/order';
const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      throw new NotFound();
    }
    if (order.userId !== req.currentUser.id) {
      throw new Error('not authorized');
    }
    res.status(200).send(order);
  }
);

export { router as fetchOrder };
