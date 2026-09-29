import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Mongoose connected to MongoDB!");
    return mongoose.connection;
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}