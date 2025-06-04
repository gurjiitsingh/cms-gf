import mailgun from 'mailgun.js';
import formData from 'form-data';

import { NextRequest, NextResponse } from 'next/server';
const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const API_KEY = process.env.MAILGUN_API_KEY as string;

import { getTemplateHtml } from '@/components/templates/emailTemplates'; // adjust your path

export async function POST(req: NextRequest) {
  try {
    const { to, subject, coupons, templateId } = await req.json();

    if (!to || !subject || !coupons || !templateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mg = new mailgun(formData);
    const client = mg.client({
      username: 'api',
      key: API_KEY,
      url: 'https://api.eu.mailgun.net',
    });

    const results = [];

    for (const recipient of to) {
      const unsubscribeUrl = `https://masala-gf.de/`; // or wherever your route is
      const htmlTemplate = getTemplateHtml(templateId, coupons, recipient);

  console.log("coupons------------", htmlTemplate)
const result = await client.messages.create(DOMAIN, {
  from: 'info@masala-gf.shop',
  to: [recipient],
  subject,
  html: htmlTemplate, // <-- Plain HTML email
});
   

      results.push({ email: recipient, result });
      await new Promise((res) => setTimeout(res, 250));
    }

    return NextResponse.json({ message: 'Emails sent successfully', results });
  } catch (error) {
    console.error('Mailgun error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails', details: error },
      { status: 500 }
    );
  }
}
