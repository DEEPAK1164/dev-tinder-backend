
const validator=require("validator");


const validateSignUpData=(req)=>{
    const{firstName,lastName,emailId,password}=req.body;

if(!firstName || !lastName)
{
    throw new Error("Please Enter full Name.")
}

else if(firstName.length<4 && firstName.length>50){
  throw new Error("firstName should be of length 4 to 50 characters.")
}
else if(!validator.isEmail(emailId))
{
  throw new Error("Email is not valid.")
}
else if(!validator.isStrongPassword(password))
{
    throw new Error("Please enter a strong password.")
}

}


const validateEditProfileData=(req)=>{
  const allowedEditFields=[
  "age",
  "firstName",
  "lastName",
  "emailId",
  "photoUrl",
  "gender",
  "about",
  "skills"
  ]


  const isEditAllowed=Object.keys(req.body).every((field)=>
   allowedEditFields.includes(field)
);

return isEditAllowed;
}

module.exports={
    validateSignUpData,
    validateEditProfileData
}