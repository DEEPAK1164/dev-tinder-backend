const mongoose=require("mongoose");
//connectting with mongoose culuster not db
//note mongoose.connect return us a promise
//so use async await
// mongoose.connect("mongodb+srv://1164dkm:urpwd@namastenode.xfqk0.mongodb.net/")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    } catch (err) {
        console.error("Database cannot be connected!", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

