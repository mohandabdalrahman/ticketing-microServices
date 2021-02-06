import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  requireAuth,
  validateRequest,
  NotFound,
  OrderStatus,
  BadRequestError,
} from '@motickets/common';
import { body } from 'express-validator';
import { Order } from '../database/models/order';
import { Ticket } from '../database/models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket that user try to order in database
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
      throw new NotFound();
    }

    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }
    // calc expire date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() * EXPIRATION_WINDOW_SECONDS);

    // build order & save in database
    const order = Order.build({
      expireAt: expiration,
      userId: req.currentUser.id,
      ticket,
      status: OrderStatus.Created,
    });
    await order.save();
    // publish event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      expiresAt: order.expireAt.toISOString(),
      userId: order.userId,
      id: order.id,
      status: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrder };
