import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@motickets/common';
import { Ticket } from '../database/models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post(
  '/api/tickets',
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
    const ticket = Ticket.build({ title, price, userId: req.currentUser.id });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });
    return res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
