import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

console.log("Email Config - User:", EMAIL_USER);
console.log("Email Config - Pass (prefix):", EMAIL_PASS ? (EMAIL_PASS.substring(0, 3) + "****") : "MISSING");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  debug: true,
  logger: true
});

console.log("Verifying Mail Transporter...");
const verifyTimeout = setTimeout(() => {
  console.error("⚠️ Transporter verification is taking too long (15s)... possible network block.");
}, 15000);

transporter.verify(function (error, success) {
  clearTimeout(verifyTimeout);
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
      from: `"JusBill" <${EMAIL_USER}>`,
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
