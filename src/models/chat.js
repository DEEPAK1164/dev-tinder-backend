const mongoose=require('mongoose');


const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    },
{
    timestamps:true})


const chatSchema=new mongoose.Schema({
participants:[
  {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
],
messages:[messageSchema],

})

const Chat=mongoose.model("Chat",chatSchema); 

module.exports={Chat};

// {
//     "_id": "65c1b3c5e8904f001234abcd",
//     "participants": ["65c1a2b4e7893f0012345678", "65c1a2b4e7893f0098765432"],
//     "messages": [
//       {
//         "_id": "65c1c4d6e9015f001234dcba",
//         "senderId": "65c1a2b4e7893f0012345678",
//         "text": "Hey Rahul!",
//         "createdAt": "2025-02-09T12:30:00Z",
//         "updatedAt": "2025-02-09T12:30:00Z"
//       }
//     ]
//   }
  