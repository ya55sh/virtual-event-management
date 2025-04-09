require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"Wee Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
