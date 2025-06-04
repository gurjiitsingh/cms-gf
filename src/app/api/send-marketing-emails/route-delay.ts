import mailgun from 'mailgun.js';
import formData from 'form-data';
import { NextRequest, NextResponse } from 'next/server';

const DOMAIN = process.env.MAILGUN_DOMAIN as string;
const API_KEY = process.env.MAILGUN_API_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const { to, subject, template } = await req.json();

    if (!Array.isArray(to) || to.length === 0 || !subject || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mg = new mailgun(formData);
    const client = mg.client({
      username: 'api',
      key: API_KEY,
      url: 'https://api.eu.mailgun.net',
    });

    const results: any[] = [];

    for (const recipient of to) {
      try {
        const res = await client.messages.create(DOMAIN, {
          from: 'info@masala-gf.shop',
          to: recipient,
          subject,
          html: template,
        });

        results.push({ to: recipient, success: true, id: res.id });
      } catch (err) {
        console.error(`❌ Failed for ${recipient}:`, err);

        let errorMsg = 'Unknown error';
        if (err instanceof Error) {
          errorMsg = err.message;
        } else if (typeof err === 'string') {
          errorMsg = err;
        }

        results.push({ to: recipient, success: false, error: errorMsg });
      }
    }

    return NextResponse.json({
      message: 'Processed all recipients',
      results,
    });
  } catch (error) {
    console.error('Mailgun error:', error);

    let errorMsg = 'Failed to send email';
    if (error instanceof Error) {
      errorMsg = error.message;
    }

    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
