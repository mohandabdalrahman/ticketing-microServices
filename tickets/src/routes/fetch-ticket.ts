import express, { Request, Response } from 'express';
import { Ticket } from '../database/models/ticket';
import { NotFound } from '@motickets/common';
const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFound();
  }

  return res.status(200).send(ticket);
});

export { router as fetchTicketRouter };
