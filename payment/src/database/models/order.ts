import mongoose from 'mongoose';
import { OrderStatus } from '@motickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const { Schema, model } = mongoose;

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
  id: string;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
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
    price: {
      type: Number,
      required: true,
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    status: attrs.status,
    userId: attrs.userId,
  });
};

const Order = model<OrderDoc, TicketModel>('Order', orderSchema);

export { Order };
