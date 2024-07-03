import mongoose from 'mongoose';

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectToDatabase;