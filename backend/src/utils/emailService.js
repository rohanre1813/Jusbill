import dotenv from 'dotenv';

dotenv.config();

const MAILJET_API_KEY = (process.env.MAILJET_API_KEY || "").trim();
const MAILJET_SECRET_KEY = (process.env.MAILJET_SECRET_KEY || "").trim();
const FROM_EMAIL = (process.env.FROM_EMAIL || "jusbill.contact@gmail.com").trim();

export const sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
  try {
    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
      console.warn("⚠️ Mailjet credentials missing. Email skipped.");
      return;
    }

    console.log(`Sending email to ${to} via Mailjet API...`);

    const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: FROM_EMAIL,
              Name: "JusBill"
            },
            To: [
              {
                Email: to,
                Name: "Valued Customer"
              }
            ],
            Subject: subject,
            TextPart: text,
            Attachments: [
              {
                ContentType: "application/pdf",
                Filename: filename,
                Base64Content: attachmentBuffer.toString('base64')
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.Messages?.[0]?.Errors?.[0]?.ErrorMessage || "Mailjet API Error");
    }

    console.log("✅ Email sent successfully via Mailjet");
    return data;
  } catch (error) {
    console.error('❌ Mailjet Error:', error.message);
  }
};

export const sendContactEmail = async (name, email, subject, message, businessName = "") => {
  try {
    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
      console.warn("⚠️ Mailjet credentials missing. Email skipped.");
      return;
    }

    console.log(`Sending contact email notification to support (${FROM_EMAIL}) via Mailjet...`);

    const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');

    const businessInfo = businessName ? `Business/Shop Name: ${businessName}\n` : "";
    const emailBody = `
You have received a new contact message from the JusBill Contact Us form:

Name: ${name}
Email: ${email}
${businessInfo}
Subject: ${subject}

Message:
------------------------------------------
${message}
------------------------------------------

Please reply directly to the customer at their email address: ${email}
    `;

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: FROM_EMAIL,
              Name: "JusBill Contact Form"
            },
            To: [
              {
                Email: FROM_EMAIL,
                Name: "JusBill Support"
              }
            ],
            ReplyTo: {
              Email: email,
              Name: name
            },
            Subject: `[Contact Form] ${subject} - from ${name}`,
            TextPart: emailBody
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.Messages?.[0]?.Errors?.[0]?.ErrorMessage || "Mailjet API Error");
    }

    console.log("✅ Contact email notification sent successfully via Mailjet");
    return data;
  } catch (error) {
    console.error('❌ Mailjet Contact Email Error:', error.message);
  }
};
