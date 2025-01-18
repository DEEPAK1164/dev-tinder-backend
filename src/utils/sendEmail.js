const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");


const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: `<h1>${body}</h1>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is text format email.",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  

  
const run = async (subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
      //note my ses account is in sandbox mode and
      //in sandbox mode i can only send email to 2001dmcode@gmail.com
      //but if we get production access then we can make it dynamic also by just taking
      //const run = async (subject, body,toEmailId)
      //and replace 2001dmcode@gmail.com with toEmailId 
      //the mail will go to toEmailId from deepak@dev-tinder.com
      "2001dmcode@gmail.com",
      "deepak@dev-tinder.com",
      subject,
      body
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
       
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports={ run };