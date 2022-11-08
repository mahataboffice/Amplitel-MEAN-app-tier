const nodemailer = require("nodemailer");
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = '652653662121-okbtmt4gr534bcaelvck26oqdrmag1e9.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04eqO5tQ7Xc0gCgYIARAAGAQSNwF-L9IrxDN3pIHmjFi0yQgWjP-GmpdFb1AEvNloaRD0I2KXQP8Va0XVqv_2-XIgagiCUTOljfA';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function wrapedSendPasswordResetMail(email, link,username){
    return new Promise(async(resolve,reject)=>{
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                type: "OAuth2",
                user: "code2@phicode.io",
                clientId: "652653662121-okbtmt4gr534bcaelvck26oqdrmag1e9.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//04eqO5tQ7Xc0gCgYIARAAGAQSNwF-L9IrxDN3pIHmjFi0yQgWjP-GmpdFb1AEvNloaRD0I2KXQP8Va0XVqv_2-XIgagiCUTOljfA",
                accessToken: accessToken,
              }
            });
            transport.sendMail({
                from: "code2@phicode.io",
                to: email,
                subject: "Password reset for telstra platform",
                html: `<b>Hello, <strong>${username}</strong>, Your password reset link is:\n<b>${link}</b>Expires within 60 seconds</p>`,
              }, function(error, info){
            if (error) {
                console.log("error is "+error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            } 
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        })
     })
   }

const sendPasswordResetMail = async(email, link,username) => {
    let resp= await wrapedSendPasswordResetMail(email, link,username);
    return resp;
}

module.exports = { sendPasswordResetMail }