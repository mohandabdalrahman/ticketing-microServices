import { Listener, OrderCreatedEvent, Subjects } from '@motickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../database/models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      userId,
      version,
      status,
      ticket: { price },
    } = data;
    const order = Order.build({ id, userId, version, status, price });
    await order.save();

    msg.ack()
  }
}
