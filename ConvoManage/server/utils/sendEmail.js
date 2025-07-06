const nodemailer = require("nodemailer");

const sendEmail = async (to, subject,text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
    await transporter.sendMail({
      from: `"ConvoManage Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
};

module.exports = sendEmail;

