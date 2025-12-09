import mongoose from "mongoose"; // Importing the mongoose package

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Connecting to the MongoDB database using the connection string from environment variables
        console.log('MongoDB connected successfully'); // Logging a success message if the connection is successful
    } catch (error) {
        console.log(error); // Logging an error message if the connection fails
    }
}
export default connectDB; // Exporting the connectDB function for use in other parts of the application