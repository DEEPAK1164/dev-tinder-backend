const mongoose=require("mongoose");
var validator = require('validator');
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4
    },
    lastName:{
        type:String

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true  ,//avoid spaces before in and after while entering email
        validate(value){
            if(!validator.isEmail(value))
            {
               throw new Error("Invalid Email Address!")
            }
        },
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){//note validate fn will only work if insert new object not input or patch so use run validators:true in this cases
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Gender is not valid data")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png"
    },
    about:{
       type:String,
       default:"This is a default about of the user!" //it automatically get inserted by default
    },
    skills:{
        type:[String]  //array of skills
    }
},
{
    timestamps:true,//it tells when user registered
}
);


//Must not use arrow fn ever just below
userSchema.methods.getJWT = async function() {
    const user = this;
    
    try {
        const token = await jwt.sign({ _id: user._id.toString() }, "D**p@k*1164", { expiresIn: "1d" });
       
        return token;
    } catch (error) {
        console.error("Error in generating JWT:", error.message);
        throw new Error("Token generation failed.");
    }
};


const User=mongoose.model("User",userSchema);


module.exports=User;
