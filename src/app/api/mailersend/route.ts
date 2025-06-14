// app/api/send-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { getTemplateHtml } from "@/components/templates/emailTemplates";

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { to, subject, coupons, templateId } = await req.json();
    if (!to || !subject || !coupons || !templateId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const results = [];
    const sender = new Sender("info@masala-gf.shop", "Masala Taste Of India");

    for (const recipientEmail of to) {
     // const recipient = new Recipient(recipientEmail, recipientEmail);
      const recipients = [new Recipient("gagurjiitsingh@gmail.com", "Admin")];

      const html = getTemplateHtml(templateId, coupons, recipientEmail);
      const text = "Your email client does not support HTML emails.";

      const emailParams = new EmailParams()
        .setFrom(sender)                      // ✅ correct
        .setTo(recipients)                  // ✅ correct
        .setSubject(subject)
        .setHtml(html)
        .setText(text);

      const response = await mailersend.email.send(emailParams);
      results.push({ email: recipientEmail, response });
      await new Promise((r) => setTimeout(r, 300)); // throttle
    }

    return NextResponse.json({ message: "Sent!", results });
  } catch (error: any) {
    console.error("MailerSend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
