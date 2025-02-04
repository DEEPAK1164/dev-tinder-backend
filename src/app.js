const express = require('express');
const connectDB = require('./config/database'); // Import the database connection
const cors=require("cors");
const app = express();
var cookieParser = require('cookie-parser')
require('dotenv').config()

//as soon as our application load below file will 
//get load and cron would get scheduled.
require("./utils/cronJob");



// Middleware (if any)
app.use(express.json()); // Example middleware to handle JSON requests
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user")


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)





connectDB().then(()=>{
console.log("DB connected successfully!");
app.listen(process.env.PORT,()=>{
  console.log("Server is running on port 7777...")
})
}).catch((err)=>{
console.error("DB can't be connected");
})
