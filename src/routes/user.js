const express=require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter=express.Router();
const ConnectionRequestModel=require("../models/connectionRequest")
const UserModel=require("../models/user")
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";



//get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequestModel.find({
              toUserId:loggedInUser._id,
              status:"interested"
        }).populate("fromUserId",["firstName", "lastName", "age", "gender", "photoUrl", "about"])


    res.json({message:"Data fetched successfully!",
        data:connectionRequests
    })
    } catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
    
})


//who is connected to me who has accepted my rquest
userRouter.get("/user/connections", userAuth, async(req,res)=>{
try {
const loggedInUser=req.user;
//how to find all connections who are my connections
//ex akshay=>elon=>accepted
//elon=>mark=>accepted
//suppose I am finding out all the connections of elon
//then I ahve to check all database in which elon is to user or from user
//but status should always be accepted


const connectionRequests=await ConnectionRequestModel.find({
   $or:[
    {toUserId:loggedInUser._id,status:"accepted"},
    {fromUserId:loggedInUser._id,status:"accepted"}
   ] 
}).populate("fromUserId",USER_SAFE_DATA)
.populate("toUserId",USER_SAFE_DATA)

const data=connectionRequests.map((row)=>
{
    if(row.fromUserId._id.toString()===loggedInUser._id.toString())
     {
       return  row.toUserId;
     }
    return row.fromUserId;
});

res.json({"connections are":data})

}catch(err){

    res.status(400).send({message:err.message})
}


})


userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        
//user should not see all user cards except
//1.his own card
//2.his connections
//3.ignored people
//4.already sent the request

//example : rahul(new),[a,b,c,d]
// raul->a->rejected, r->b->accepted

        const loggedInUser = req.user; // Assuming req.user contains the logged-in user's information

        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;




        // Fetch connection requests involving the logged-in user
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id }, // Requests sent by the user
                { toUserId: loggedInUser._id }    // Requests received by the user
            ]
        }).select("fromUserId toUserId")
        // .populate("fromUserId","firstName")
        // .populate("toUserId","firstName"); 



//hidden users are the users whom loggedIn user want to hide from feed
    const hideUserFromFeed=new Set();//stores uniques enteries
connectionRequests.forEach((req)=>{
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
})

// console.log(hideUserFromFeed)
const feedusers=await UserModel.find({
    $and:[

        {_id:{$nin:Array.from(hideUserFromFeed)}},
        {_id:{$ne:loggedInUser._id}}
    ]
    //Array.from(hideUserFromFeed) it convert set into array
}).select(USER_SAFE_DATA).skip(skip).limit(limit);
// console.log(feedusers);



        // You might want to filter or modify the response here if needed
        res.json(feedusers); // Send the connection requests as JSON
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle any errors
    }
});


module.exports=userRouter;