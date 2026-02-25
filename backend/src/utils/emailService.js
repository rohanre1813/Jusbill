import dotenv from 'dotenv';

dotenv.config();

const POSTMARK_SERVER_TOKEN = (process.env.POSTMARK_SERVER_TOKEN || "").trim();
const FROM_EMAIL = (process.env.FROM_EMAIL || "jusbill.contact@gmail.com").trim();

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    if (!POSTMARK_SERVER_TOKEN) {
      console.warn("⚠️ POSTMARK_SERVER_TOKEN is missing. Email skipped.");
      return;
    }

    console.log(`Sending email to ${to} via Postmark...`);

    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN
      },
      body: JSON.stringify({
        From: `JusBill <${FROM_EMAIL}>`,
        To: to,
        Subject: subject,
        TextBody: text,
        Attachments: [
          {
            Name: filename,
            Content: attachmentBuffer.toString('base64'),
            ContentType: 'application/pdf'
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.Message || "Failed to send email via Postmark");
    }

    console.log("✅ Email sent successfully via Postmark:", data.MessageID);
    return data;
  } catch (error) {
    console.error('❌ Postmark Error:', error.message);
  }
};
