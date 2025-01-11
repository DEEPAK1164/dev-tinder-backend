const express=require("express");
const User = require('../models/user');
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const jwt=require("jsonwebtoken");
const{validateEditProfileData}=require("../utils/validation");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "D**p@k*1164t"; // Set this securely





// profileRouter.get("/profile/view",userAuth,async(req,res)=>{
//     try{
//       const user=req.user;
//       res.send(user);
//     }
//     catch(err){
//     res.status(400).send("Error :"+err.message);
//     }
    
    
//     try{
//       const cookies=req.cookies;//gives all cookies
//       // console.log(cookies);// undefined to read 
//       //cookie we need npm lib cookie parser
//       //https://www.npmjs.com/package/cookie-parser
//        const{token}=cookies;
//     if(!token)
//     {
//       throw new Error("Invalid Token");
//     }
//     //validate token
//     const decodedMsg=await jwt.verify(token,"D**p@k*1164");
//     // console.log(decodedMsg);
//     const{_id}=decodedMsg;
//     // console.log("Logged in user is "+_id);
//     const user=await User.findById(_id);
//     if(!user)
//     {
//       throw new Error("User does not exists or try again token might get expired.")
//     }
    
//       res.send(user);
//     }catch(err){
//     res.send("ERROR :"+err.message)
//     }
    
    
//     })

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // This comes from userAuth middleware if authenticated
    const cookies = req.cookies;

    if (!cookies?.token) {
      throw new Error("Invalid Token");
    }

    // Validate the token
    const decodedMsg = await jwt.verify(cookies.token, "D**p@k*1164");
    const { _id } = decodedMsg;
    const userData = await User.findById(_id);

    if (!userData) {
      throw new Error("User does not exist, or the token may have expired.");
    }

    res.send(userData); // Send user data response if everything is fine
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


    

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
  try{

  if(!validateEditProfileData(req))
  {
   throw new Error("Invalid Edit Request.");
  
  }
 
  const loggedInUser=req.user;

  // console.log(loggedInUser);
  Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
  // console.log(loggedInUser);
    await loggedInUser.save();
res.send("Edit was successfull!");


  }catch(err){

  res.status(400).send("ERROR :"+ err?.message);

  }


})



// Route: Change Password for Logged-in User
profileRouter.post("/profile/change-password", userAuth, async (req, res) => {
  try {
  
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, loggedInUser.password);
    if (!isMatch) throw new Error("Current password is incorrect.");

    // Hash new password and save
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    res.send("Password changed successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});







module.exports=profileRouter;