import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("Email Config - User:", process.env.EMAIL_USER);
console.log("Email Config - Pass (prefix):", process.env.EMAIL_PASS ? (process.env.EMAIL_PASS.substring(0, 3) + "****") : "MISSING");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log("Verifying Mail Transporter...");
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Transporter Verification Error:", error);
  } else {
    console.log("✅ Mail Transporter Ready");
  }
});

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    console.log(`Sending email to ${to} with attachment ${filename}...`);
    const mailOptions = {
      from: `"JusBill" <${process.env.EMAIL_USER}>`,
      to, subject, text,
      attachments: [{ filename, content: attachmentBuffer }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email info messageId:", info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};
