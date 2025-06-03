export function getTemplateHtml(
  templateId: number,
  coupons: { code: string; discount: number | string; minSpend?: number }[],
 
) {
  if (!coupons || coupons.length === 0) {
    return '<p>No coupons selected.</p>';
  }

  const renderMinSpend = (minSpend?: number) =>
    minSpend && minSpend > 0
      ? `<span style="display: block; font-size: 12px; margin-top: 4px; color:#777777;">Mindestbestellwert: €${minSpend}</span>`
      : '';

  if (templateId === 1) {
    return `
     <div className="flex flex-col items-center">
    <div style="background: #f3f4f6; padding: 30px 0;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="display: block; margin: 0 auto 16px auto; width: 80px;" />
          <h1 style="font-size: 24px; font-weight: bold; color: #dc2626;">🎁 Sie haben Gutscheine!</h1>
          <p style="color: #374151; margin-top: 8px;">Vielen Dank, dass Sie ein geschätzter Kunde sind. Verwenden Sie die folgenden Codes bei Ihrer nächsten Bestellung und erhalten Sie einen Rabatt.</p>
        </div>

        ${coupons.map(c => `
          <p style="background: #fef3c7; border-left: 4px solid #facc15; padding: 12px; margin: 0 0 12px 0; border-radius: 6px; font-size: 14px; font-family: sans-serif; line-height: 1.4;">
            <span style="display: block; font-size: 18px; font-weight: bold; color: #b91c1c;">
              <span style="color: #374151;">Gutscheincode: </span>${c.code}
            </span>
            <span style="color: #1f2937; font-weight: 500;">
              Erhalten Sie <strong>€${c.discount}</strong> Rabatt auf Ihre Bestellung
            </span>
            ${renderMinSpend(c.minSpend)}
          </p>
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
      <!-- Unsubscribe section -->
    
      </div>
    `;
  }
  return '<p>No template found.</p>';
}
