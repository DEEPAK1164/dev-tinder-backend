const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//reference to the user collection fromUserId is a field in the connectionRequestSchema that stores the ID of a user.
        required:true
    },
    
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true,
})

//never use arrow fn with pre 
connectionRequestSchema.pre("save",function(next){
const connectionRequest=this;
//check if the fromUserId is same as toUserId
if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
{
    throw new Error("Can't send connection request to yourself")
}
//always call next with pre
next();
})



// Define compound indexes to optimize queries for connection requests
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

//model always starts with capital letter
const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;