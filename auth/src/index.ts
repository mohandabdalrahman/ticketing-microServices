import { app } from './app';

app.listen(4000, () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must defined');
  }
  console.log('Listening on port 4000!!!! 🚀');
});
