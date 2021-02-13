import { Listener, TicketCreatedEvent, Subjects } from '@motickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../database/models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = Ticket.build({ title, price, id, version });
    await ticket.save();
    // * success process event
    msg.ack();
  }
}
