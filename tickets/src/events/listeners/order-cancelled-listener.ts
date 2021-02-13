import { Listener, OrderCancelledEvent, Subjects } from '@motickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../database/models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const {
      ticket: { id: ticketId },
    } = data;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });
    msg.ack();
  }
}
