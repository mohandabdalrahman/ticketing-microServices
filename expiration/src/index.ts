import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

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

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.log(
      '🚀 ~ file: index.ts ~ line 8 ~ connectNatsServer ~ error',
      error
    );
  }
};

connectNatsServer();
