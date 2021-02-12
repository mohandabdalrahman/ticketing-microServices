import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
const connectNatsServer = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('nats connection closed');
      process.exit();
    });
    // start listeners
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen()

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (error) {
    console.log(
      '🚀 ~ file: index.ts ~ line 8 ~ connectNatsServer ~ error',
      error
    );
  }
};

connectNatsServer();

app.listen(5000, () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must defined');
  }
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must defined');
  }
  console.log('Listening on port 5000!!!! 🚀');
});
