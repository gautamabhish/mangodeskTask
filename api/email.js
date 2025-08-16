import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { recipients, subject, body } = req.body;

  if (!recipients?.length) {
    return res.status(400).json({ error: "Recipients required" });
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Notes Bot <no-reply@example.com>",
      to: recipients,
      subject: subject || " Summary",
      text: body,
    });

    res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error("Email API error:", error);
    res.status(500).json({ error: "Email send failed" });
  }
}
