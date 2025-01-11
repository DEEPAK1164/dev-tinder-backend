const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const ConnectionRequestModel=require("../models/connectionRequest");
const User=require("../models/user");



requestRouter.post("/request/send/:status/:toUserId",
  userAuth,
  //note req.user will give info about logged in user (req.user) it is same person 
  //who is sending the request
  async(req,res)=>{
     try{
const fromUserId=req.user._id;
const toUserId=req.params.toUserId;
const status=req.params.status

const allowedStatus=["ignored","interested"];
if(!allowedStatus.includes(status))
{
   return res.status(400).json({
    message:"Invalid status type :"+status
   })
}

const toUser=await User.findById(toUserId);
if(!toUser)
{
  return res.status(404).json({
    message:"User not found!"
  })
}


//if there is an existing ConnectionRequest
//if conn req from p1 to p1 already exist or
//if there is con req already pending from b to a
//in both cases user not allowed to send con request
const existingConnectionRequest=await ConnectionRequestModel.findOne({
  $or:[
  {fromUserId,toUserId},
  {fromUserId:toUserId,toUserId:fromUserId}
  ]
})

if(existingConnectionRequest)
{
  return res.status(400).send({message:"Connection Request Already Exists!"})
}








const connectionRequest=new ConnectionRequestModel({
  fromUserId,
  toUserId,
  status
})

const data=await connectionRequest.save();
res.json({
  message:"Connection Request :"+req.params.status,
  data,
})
     }catch(err){
       res.status(400).send("Error :"+err.message);
     }


    })


requestRouter.post("/request/review/:status/:requestId",
  userAuth,
  async(req,res)=>{
try{
//validate the status
//pre check req id invalid or not
const loggedInUser=req.user;
const{status,requestId}=req.params;
const allowedStatus=["accepted","rejected"];
if(!allowedStatus.includes(status)){
  return res.status(400).json({message:"Status not allowed!"});
}

const connectionRequest=await ConnectionRequestModel.findOne({
  _id:requestId,
  toUserId:loggedInUser._id,
  status:"interested",
})

if(!connectionRequest){
  return res.status(404).json({message:"Connection request not found!."})
}
connectionRequest.status=status;
const data=await connectionRequest.save();

res.json({message:"Connection request "+status, data});


//if akshay is sending req=>elon (interested state must be)
//check if elon is loggedIn user so logged person can accept or reject the con req
//if akshay is sending req=>elon (interested state) in this case receiver(elon) should be logged in user to accept or reject the 
//connection request.

//so, toUserId (loggenInUser), con request status(interested)


}catch(err){
  res.status(400).send("Error :"+err.message);
}



});


// requestRouter.post("/request/review/:status/:requestId",
//   userAuth,
//   async (req, res) => {
//     try {
//       // Retrieve logged-in user and request parameters
//       const loggedInUser = req.user;
//       const { status, requestId } = req.params;

//       // Validate the status parameter
//       const allowedStatus = ["accepted", "rejected"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({ message: "Status not allowed!" });
//       }

//       // Check if the connection request exists with "interested" status for this user
//       const connectionRequest = await ConnectionRequestModel.findOne({
//         _id: requestId,
//         toUserId: loggedInUser._id,
//         status: "interested",
//       });

//       // If not found, return a 404 error
//       if (!connectionRequest) {
//         return res.status(404).json({ message: "Connection request not found." });
//       }

//       // Update the status if connection request is found
//       connectionRequest.status = status;
//       const data = await connectionRequest.save();

//       // Send response with updated data
//       res.json({ message: `Connection request ${status}`, data });
//     } catch (err) {
//       // Catch any errors and respond with a 400 status
//       res.status(400).json({ message: "Error: " + err.message });
//     }
//   }
// );








module.exports=requestRouter;