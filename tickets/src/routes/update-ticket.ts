import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFound } from '@motickets/common';
import { Ticket } from '../database/models/ticket';
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
    if (ticket.userId !== req.currentUser.id) {
      return res
        .status(401)
        .send({ errors: [{ message: 'you must own this ticket' }] });
    }

    // update ticket
    ticket.set({ title, price });
    await ticket.save();
    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
