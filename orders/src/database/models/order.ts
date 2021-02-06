import mongoose, { Date } from 'mongoose';
import { OrderStatus } from '@motickets/common';
import { TicketDoc } from './ticket';
const { Schema, model } = mongoose;

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expireAt: any;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expireAt: any;
  ticket: TicketDoc;
}

interface TicketModel extends mongoose.Model<any> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expireAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, TicketModel>('Order', orderSchema);

export { Order };
