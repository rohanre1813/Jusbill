import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  family: 4
});

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing.");
      return;
    }

    const mailOptions = {
      from: `"JusBill" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments: [{ filename, content: attachmentBuffer }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email Error:', error.message);
  }
};
