import { app } from './app';

app.listen(5000, () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must defined');
  }
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must defined');
  }
  console.log('Listening on port 5000!!!! 🚀');
});
