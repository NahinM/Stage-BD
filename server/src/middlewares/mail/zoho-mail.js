import nodemailer from 'nodemailer';

import { zohoEmail, zohoAppPassword } from '../../config/config.js';

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: zohoEmail,
    pass: zohoAppPassword,
  },
});

export const sendEmail = async (to, subject, text) => {
  if (!zohoEmail || !zohoAppPassword) {
    console.error('Missing ZOHO_EMAIL or ZOHO_APP_PASSWORD in environment variables.');
    return false;
  }

  const mailOptions = {
    from: `"StageBD verify" <${zohoEmail}>`,
    to: to, // List of recipients
    subject: subject, // Subject line
    text: text, // Plain text body
  };
  
  if(true){
    console.log('email sending is disabled for testing purposes');
    return false;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
    }
}; 