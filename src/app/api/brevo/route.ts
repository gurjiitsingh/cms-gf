import { NextRequest, NextResponse } from "next/server";
import { getTemplateHtml } from "@/components/templates/emailTemplates";

const API_KEY = process.env.BREVO_API_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const { to, subject, coupons, templateId } = await req.json();

    if (!to || !subject || !coupons || !templateId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results = [];

    for (const recipient of to) {
      const htmlTemplate = getTemplateHtml(templateId, coupons, recipient);

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "masala-bs.de",
            email: "info@masalabs.store", // must be verified sender in Brevo
          },
          to:  [{ email: recipient }],
          subject,
          htmlContent: htmlTemplate,
          customHeaders: [
            {
              name: "List-Unsubscribe",
              value: "<https://masala-gf.de/unsubscribe>",
            },
          ],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Brevo send error for", recipient, ":", result);
        results.push({ email: recipient, error: result });
      } else {
        results.push({ email: recipient, result });
      }

      // Throttle to avoid API rate limits
      await new Promise((r) => setTimeout(r, 250));
    }

    return NextResponse.json({ message: "Emails sent successfully", results });
  } catch (error) {
    console.error("Brevo error:", error);
    return NextResponse.json(
      { error: "Failed to send emails", details: error },
      { status: 500 }
    );
  }
}
