import mongoose from 'mongoose';
import { OrderStatus } from '@motickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order } from './order';
const { Schema, model } = mongoose;

interface TicketAttrs {
  title: string;
  price: number;
  id: string;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<any> {
  build(ticketAttrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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


ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    version: attrs.version
  });
};

// methods
ticketSchema.methods.isReserved = async function () {
  // ensure the ticket is not reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Completed,
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
