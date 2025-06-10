export async function POST(req: Request) {
  const { to, subject, coupons,template } = await req.json();

  // Remove data:image/png;base64, header if present
  console.log("to, subject, coupons,template,---",to, subject, coupons,template)

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: 'masala-bs.de', email: 'info@masalabs.store' },
        to: [
          { email: "gurjiitsingh2@gmail.com", name: "Gurjit Singh" }
        ],
        subject,
        htmlContent: "this it test",
      
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Brevo API error:', errorData);
      return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
    }

    

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
