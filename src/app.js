const express = require('express');
const connectDB = require('./config/database'); // Import the database connection
const cors=require("cors");
const app = express();
const http=require("http");
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
const userRouter=require("./routes/user");
const chatRouter=require('./routes/chat');
const inilizeSocket = require('./utils/socket');


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);


//create socket server over existing express app
//use server.listen instead of app.listen
//thsi is the configuration needed for socket
//i need this server for the configuration (initialisation) of socket.io
const server=http.createServer(app);
inilizeSocket(server);



connectDB().then(()=>{
console.log("DB connected successfully!");
server.listen(process.env.PORT,()=>{
  console.log("Server is running on port 7777...")
})
}).catch((err)=>{
console.error("DB can't be connected");
})
