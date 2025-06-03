import mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextRequest, NextResponse } from 'next/server';

const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const API_KEY = process.env.MAILGUN_API_KEY as string;

export async function POST(req: NextRequest) {
  try {
  //  const { to, subject, html } = await req.json();
 const { to, subject, template } = await req.json();

    // if (!to || !subject || !html) {
    //   return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    // }

    const mg = new mailgun(formData);
    const client = mg.client({
      username: 'api',
      key: API_KEY,
      url: 'https://api.eu.mailgun.net',
    });

    const customerMail = await client.messages.create(DOMAIN, {
      from: 'info@masala-gf.shop',
      to,
      subject,
      html:template,
    });

    return NextResponse.json({ message: 'Email sent successfully', customerMail });
  } catch (error) {
    console.error('Mailgun error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error },
      { status: 500 }
    );
  }
}
