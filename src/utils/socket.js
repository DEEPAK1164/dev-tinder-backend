const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`📌 Joining Room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async({ firstName,lastName, userId, targetUserId, text }) => {
    
      try{
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(`📤 Message from ${firstName}: ${text} in room ${roomId}`);

        //check if userId and targetUserId are friend or not ? HW


         //here save msg to DB
         let chat=await Chat.findOne({
          participants:{$all:[userId,targetUserId]},
         });
if(!chat)
{
  chat=new Chat({
    participants:[userId,targetUserId],
    messages:[],
  })
}
        chat.messages.push({
          senderId:userId,
          text,
        })
await chat.save();
io.to(roomId).emit("messageReceived", {firstName,lastName, text});
      }catch(err){
            console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
