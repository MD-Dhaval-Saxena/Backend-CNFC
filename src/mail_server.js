require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmails = async (_msg) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: 587,
      secure: false,
      auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_pass,
      },
    });

    let info = await transporter.sendMail({
      from: "justice.schaefer@ethereal.email",
      to: "demofree874@gmail.com",
      subject: "Token Received",
      html: _msg,
    });
    console.log(`Message Sent : ${info.messageId}`);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { sendEmails };
