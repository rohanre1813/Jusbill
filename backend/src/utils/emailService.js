import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) console.error("Transporter Verification Error:", error);
});

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    const mailOptions = {
      from: `"JusBill" <${process.env.EMAIL_USER}>`,
      to, subject, text,
      attachments: [{ filename, content: attachmentBuffer }]
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
