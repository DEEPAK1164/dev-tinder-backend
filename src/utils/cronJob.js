const cron = require('node-cron');
const{subDays,startOfDay,endOfDay}=require("date-fns");
const ConnectionRequestModel = require('../models/connectionRequest');
const sendEmail=require("./sendEmail");


//sec,min,hour, day, month,year
cron.schedule('0 8 * * *', async() => {
//console.log("Hello World, "+new Date());
//sending email at 8 AM to people who got request previous day.
try{
const yesterday=subDays(new Date(),1);
// console.log(yesterday);
const yesterdayStart=startOfDay(yesterday);
// console.log(yesterdayStart)
const yesterdayEnd=endOfDay(yesterday);
// console.log(yesterdayEnd);

const pendingRequests=await ConnectionRequestModel.find({
    status:"interested",
    createdAt:{
        $gte:yesterdayStart,
        $lte:yesterdayEnd
    }
}).populate("fromUserId toUserId");


//list of emails whom I want to send reminders (toUserId)<-store it uniquely in set?
///[...new Set()] of array of elements which are in set
const listOEmails=[...new Set(pendingRequests.map(req=>req.toUserId.emailId))];
for(const email of listOEmails){
//send email
try{  

    //run(sub,body)
    const res=await sendEmail.run("New Friend Request pending for "+ email,"There are so many requests accept them and start chatting.")
   console.log(res);
}
catch(err){
  console.err(err);
}


}
}
catch(err){
    console.error(err);
}


});

