import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
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
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
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
