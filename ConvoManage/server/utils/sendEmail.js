const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html = null) => {
  try {
    //Create mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //Default ConvoManage logo and template
    const logoUrl =
      "https://raw.githubusercontent.com/Abhishek-Sharma-00/ConvoManage-Project/refs/heads/main/ConvoManage/client/assets/appLogo.png";

    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="text-align: center; background-color: #1a73e8; padding: 20px;">
            <img src="${logoUrl}" alt="ConvoManage" style="max-width: 25px;" />
            <h2 style="color: #fff; margin-top: 10px;">ConvoManage</h2>
          </div>

          <!-- Body -->
          <div style="padding: 25px; color: #333;">
            <h3 style="color: #1a73e8;">${subject}</h3>
            <p style="font-size: 15px; line-height: 1.6;">${text}</p>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://convomanage.com/dashboard" 
                style="background-color: #1a73e8; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Open ConvoManage
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f3f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>You're receiving this email from <strong>ConvoManage</strong> because you're part of a registered event.</p>
            <p>
              <a href="https://convomanage.com/unsubscribe" style="color: #777; text-decoration: none;">Unsubscribe</a> |
              <a href="https://convomanage.com/feedback" style="color: #777; text-decoration: none;">Give Feedback</a>
            </p>
          </div>
        </div>
      </div>
    ;`

    //Send email
    await transporter.sendMail({
      from: `"ConvoManage Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: defaultHtml || html,
    });

    console.log(`Email sent successfully to: ${to}`);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};

module.exports = sendEmail;



// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject,text, html = null) => {
//   try {
//     const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
//     await transporter.sendMail({
//       from: `"ConvoManage Support" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });
//   } catch (err) {
//     console.error("Email send error:", err);
//   }
// };

// module.exports = sendEmail;
