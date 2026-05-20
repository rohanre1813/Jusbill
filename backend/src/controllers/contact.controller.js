import Contact from "../models/contact.js";
import { sendContactEmail } from "../utils/emailService.js";

export const submitContactMessage = async (req, res) => {
  try {
    const { name, businessName, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: "All fields except business name are mandatory" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: "Please provide a valid email address" });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ msg: "Message must be at least 10 characters long" });
    }

    const contactMessage = await Contact.create({
      name,
      businessName,
      email,
      subject,
      message
    });

    // Attempt to dispatch support email notification via Mailjet
    try {
      await sendContactEmail(name, email, subject, message, businessName);
    } catch (emailError) {
      console.error("⚠️ Failed to dispatch contact email notification:", emailError.message);
    }

    res.status(201).json({
      success: true,
      msg: "Message received successfully",
      data: contactMessage
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
