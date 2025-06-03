export function getTemplateHtml(
  templateId: number,
  coupons: { code: string; discount: number | string; minSpend?: number }[]
) {
  if (!coupons || coupons.length === 0) {
    return '<p>No coupons selected.</p>';
  }

  const renderMinSpend = (minSpend?: number) =>
    minSpend && minSpend > 0
      ? `<p style="font-size: 14px;">Mindestbestellwert: €${minSpend}</p>`
      : '';

  if (templateId === 1) {
    return `
    <div style="background: #f3f4f6; padding: 30px 0;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="display: block; margin: 0 auto 16px auto; width: 80px;" />
          <h1 style="font-size: 24px; font-weight: bold; color: #dc2626;">🎁 Sie haben Gutscheine!</h1>
          <p style="color: #374151; margin-top: 8px;">Vielen Dank, dass Sie ein geschätzter Kunde sind. Verwenden Sie die folgenden Codes bei Ihrer nächsten Bestellung und erhalten Sie einen Rabatt.</p>
        </div>

        ${coupons.map(c => `
          <div style="background: #fef3c7; border-left: 4px solid #facc15; padding: 16px; margin-bottom: 16px; border-radius: 6px;">
            <p style="color: #374151;">Gutscheincode:</p>
            <p style="font-size: 18px; font-weight: bold; color: #b91c1c;">${c.code}</p>
            <p style="color: #1f2937; font-weight: 500;">Erhalten Sie <strong>€${c.discount}</strong> Rabatt auf Ihre Bestellung</p>
            ${renderMinSpend(c.minSpend)}
          </div>
        `).join('')}

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #6b7280;">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
          <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR-Code" style="margin-top: 8px;" />
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://www.masala-gf.de/" target="_blank" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Or click https://www.masala-gf.de 
          </a>
        </div>

        <div style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 32px;">
          <p>&copy; 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </div>
    `;
  }

  if (templateId === 2) {
    return `
    <div style="background: #f3f4f6; padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="display: block; margin: 0 auto 16px auto; width: 80px;" />
          <h1 style="font-size: 24px; font-weight: bold; color: #dc2626;">🎁 You've Got Coupons!</h1>
          <p style="color: #374151; margin-top: 8px;">Thank you for being a valued customer. Use the codes below on your next order, and get discount.</p>
        </div>

        ${coupons.map(c => `
          <div style="background: #fef3c7; border-left: 4px solid #facc15; padding: 16px; margin-bottom: 16px; border-radius: 6px;">
            <p style="color: #374151;">Use code:</p>
            <p style="font-size: 18px; font-weight: bold; color: #b91c1c;">${c.code}</p>
            <p style="color: #1f2937; font-weight: 500;">Get <strong>€${c.discount}</strong> off your order</p>
            ${renderMinSpend(c.minSpend)}
          </div>
        `).join('')}

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #6b7280;">Scan the QR code to shop now:</p>
          <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR Code" style="margin-top: 8px;" />
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://www.masala-gf.de/" target="_blank" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Or click https://www.masala-gf.de 
          </a>
        </div>

        <div style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 32px;">
          <p>&copy; 2025 Masala Taste Of India. All rights reserved.</p>
        </div>
      </div>
    </div>
    `;
  }

  if (templateId === 3) {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 2px dashed #4ade80; padding: 20px;">
        <h2 style="color: #4ade80;">🌟 Exclusive Coupons Just for You!</h2>
        <ul>
          ${coupons.map(c => `
            <li style="margin: 10px 0;">
              <strong>${c.code}</strong> - €${c.discount}
              ${c.minSpend && c.minSpend > 0 ? ` (Min spend: €${c.minSpend})` : ''}
            </li>
          `).join('')}
        </ul>
        <p>Don't miss out – shop today!</p>
        <p style="font-size: 12px; color: gray;">Masala Store | Thank you for your support</p>
      </div>
    `;
  }
}
