import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim();

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    if (!RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing. Email skipped.");
      return;
    }

    console.log(`Sending email to ${to} via Resend...`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'JusBill <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: text,
        attachments: [
          {
            filename: filename,
            content: attachmentBuffer.toString('base64'),
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Resend");
    }

    console.log("✅ Email sent successfully via Resend:", data.id);
    return data;
  } catch (error) {
    console.error('❌ Resend Email Error:', error.message);
    // We don't throw here to keep it "background" as requested, 
    // but the controller will handle its own try/catch if needed.
  }
};
