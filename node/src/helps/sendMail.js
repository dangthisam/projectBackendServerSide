const nodemailer = require('nodemailer');
const accountSid=process.env.TWILIO_ACCOUNT_SID;
const authToken=process.env.TWILIO_ACCOUNT_TOKEN;
const client = require('twilio')(accountSid, authToken);
const textbelt = require('textbelt');
module.exports.sendEmail = (email, subject , html) => {
   
    const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
    }
});



const mailOptions = {
    from:process.env.SMTP_MAIL,
    to: email,
    subject: subject,
   html: html
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error sending email: ', error);
    }
    console.log('Email sent: ', info.response);
});
}



 async function sendSMS(otp) {
try {
const message = await client.messages.create({
body: `Hello from Node.js ${otp}!`,
from: '+12345678901', // Your Twilio phone number
to: '+0359200508' // Recipient's phone number
});
console.log('Message sent:', message.sid);
} catch (error) {
console.error('Error sending message:', error);
}
}

module.exports.sendSMS=sendSMS;