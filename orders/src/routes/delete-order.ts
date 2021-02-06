import express, { Request, Response } from 'express';
import { Order } from '../database/models/order';
import { requireAuth, OrderStatus, NotFound } from '@motickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.delete(
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
    order.status = OrderStatus.Cancelled;
    await order.save();
    // publish event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrder };
