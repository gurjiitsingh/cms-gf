import { NextRequest, NextResponse } from "next/server";
import SendPulse from "sendpulse-api";
import { getTemplateHtml } from "@/components/templates/emailTemplates"; // Adjust to your actual path

const API_USER_ID = process.env.SENDPULSE_USER_ID!;
const API_SECRET = process.env.SENDPULSE_SECRET!;
const TOKEN_STORAGE = "/tmp/"; // Use a writable directory

//npm install sendpulse-api form-data

sendpulseInit();

function sendpulseInit() {
  SendPulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, () => {
    console.log("SendPulse initialized");
  });
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, coupons, templateId } = await req.json();

    if (!to || !subject || !coupons || !templateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const results = [];

    for (const recipient of to) {
      const unsubscribeUrl = `https://masala-gf.de/unsubscribe?email=${recipient}`;
      const html = getTemplateHtml(templateId, coupons, recipient);

      const emailData = {
        html,
        text: "This is an HTML email", // required, even if just a placeholder
        subject,
        from: { name: "Masala GF", email: "info@masala-gf.shop" },
        to: [{ email: recipient, name: recipient }],
      };

      const result = await new Promise((resolve, reject) => {
        SendPulse.smtpSendMail(emailData, (response: any) => {
          resolve({ email: recipient, result: response });
        });
      });

      results.push(result);
      await new Promise((res) => setTimeout(res, 250)); // throttle to avoid rate limits
    }

    return NextResponse.json({ message: "Emails sent successfully", results });
  } catch (error) {
    console.error("SendPulse error:", error);
    return NextResponse.json(
      { error: "Failed to send emails", details: error },
      { status: 500 }
    );
  }
}
