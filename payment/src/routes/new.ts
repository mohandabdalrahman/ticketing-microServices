import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  NotFound,
  BadRequestError,
  OrderStatus,
} from '@motickets/common';
import { Order } from '../database/models/order';
import { stripe } from '../stripe';
import { Payment } from '../database/models/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFound();
    }
    if (order.userId !== req.currentUser.id) {
      throw new Error('user not authorized');
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('can not buy for cancelled order');
    }
    // charge user
    const { id } = await stripe.charges.create({
      currency: 'usd',
      amount: order.price,
      source: token,
    });
    // store payment in database
    const payment = Payment.build({
      orderId,
      stripeId: id,
    });

    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
