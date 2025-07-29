import mongoose from 'mongoose';


const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://rahulthakur:rahulpratapsingh@cluster0.n7i8h0f.mongodb.net/');
}

connectDB().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
    