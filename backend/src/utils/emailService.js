import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing. Email skipped.");
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
    console.log("✅ Email sent successfully via SMTP:", info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Nodemailer Error:', error.message);
  }
};
