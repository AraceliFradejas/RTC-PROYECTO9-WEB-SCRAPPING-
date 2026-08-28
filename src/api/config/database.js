import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Falta MONGODB_URI en las variables de entorno.");
  }

  await mongoose.connect(mongoUri);
  console.log(`🍃 MongoDB conectada: ${mongoose.connection.name}`);
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("🍃 Conexión con MongoDB cerrada");
  }
};
