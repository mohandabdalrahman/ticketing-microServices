import express, { Request, Response } from 'express';
import { Ticket } from '../database/models/ticket';
import { NotFound } from '@motickets/common';
const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  if (!tickets) {
    throw new NotFound();
  }

  return res.status(200).send(tickets);
});

export { router as retrieveTicketsRouter };
