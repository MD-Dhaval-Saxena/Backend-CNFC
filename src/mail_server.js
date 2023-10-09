const nodemailer = require("nodemailer");

 const sendEmails = async (_msg) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "justice.schaefer@ethereal.email",
        pass: "AHqDcqvN4EppyWuz2p",
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

module.exports={sendEmails}
