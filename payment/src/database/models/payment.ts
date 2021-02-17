import mongoose from 'mongoose';

const { Schema, model } = mongoose;

interface paymentAttrs {
  orderId: string;
  stripeId: string;
}

interface paymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<any> {
  build(paymentAttrs: paymentAttrs): paymentDoc;
}

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
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

paymentSchema.statics.build = (attrs: paymentAttrs) => {
  return new Payment(attrs);
};

const Payment = model<paymentDoc, PaymentModel>('payment', paymentSchema);

export { Payment };
