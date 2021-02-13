import {
  Listener,
  ExpirationCompletedEvent,
  Subjects,
  OrderStatus,
} from '@motickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../database/models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;
  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('order not found');
    }
    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }
    order.set({ order: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
