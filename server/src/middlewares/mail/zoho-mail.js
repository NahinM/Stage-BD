import {nodemailer} from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // Use port 465 for secure: true (SSL)
  secure: true, // true for 465, false for other ports (e.g., 587)
  auth: {
    user: process.env.ZOHO_EMAIL, // Your full Zoho email address
    pass: process.env.ZOHO_APP_PASSWORD,   // Your Zoho app password
  },
});

export const sendEmail = async (to, subject, text) => {

    const mailOptions = {
        from: `"StageBD verify" <${process.env.ZOHO_EMAIL}>`, // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}; 