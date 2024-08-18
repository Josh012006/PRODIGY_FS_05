import mongoose from "mongoose";


let isConnected = false;

const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
};

const connectDB = async () => {

    mongoose.set('strictQuery', true); // Permet de s'assurer que les requêtes respectent le format des models.

    if(!process.env.MONGO_URI) return console.log('MONGO_URI required');
    if(isConnected) return console.log("Already connected!");

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!, options);

        isConnected = true;

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error while connecting database " + error);
    }
};


export default connectDB;