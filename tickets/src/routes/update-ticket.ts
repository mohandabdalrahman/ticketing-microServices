import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFound,
  BadRequestError,
} from '@motickets/common';
import { Ticket } from '../database/models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().isString().withMessage('Title must be provide'),
    body('price')
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFound();
    }
    if (ticket.orderId) {
      throw new BadRequestError('can not edit reserved Ticket');
    }
    if (ticket.userId !== req.currentUser.id) {
      return res
        .status(401)
        .send({ errors: [{ message: 'you must own this ticket' }] });
    }

    // update ticket
    ticket.set({ title, price });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });
    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
