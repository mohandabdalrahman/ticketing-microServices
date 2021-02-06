import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }); 
    console.log(`Connected To MongoDB 👍`)
  } catch (error) {
    console.log('🚀 ~ file: db.ts ~ line 11 ~ connectDatabase ~ error', error);
  }
};

export default connectDatabase;