'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function TemplateSelector() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { setTemplate, coupons } = useAppContext();
  const router = useRouter();

  const fillTemplate = (templateId: number) => {
    if (!coupons || coupons.length === 0) {
      return '<p>No coupons selected.</p>';
    }

    if (templateId === 1) {
      return `
        <div style="background: #f3f4f6; padding: 40px 0;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://www.masala-gf.de/logo.webp" alt="Logo" style="display: block; margin: 0 auto 16px auto; width: 80px;" />
              <h1 style="font-size: 24px; font-weight: bold; color: #dc2626;">🎁 You've Got Coupons!</h1>
              <p style="color: #374151; margin-top: 8px;">Thank you for being a valued customer. Use the codes below on your next order.</p>
            </div>

            ${coupons.map(c => `
              <div style="background: #fef3c7; border-left: 4px solid #facc15; padding: 16px; margin-bottom: 16px; border-radius: 6px;">
                <p style="color: #374151;">Use code:</p>
                <p style="font-size: 18px; font-weight: bold; color: #b91c1c;">${c.code}</p>
<p style="color: #1f2937; font-weight: 500;">Get <strong>€${c.discount}</strong> off your order</p>

              </div>
            `).join('')}

            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #6b7280;">Scan the QR code to shop now:</p>
              <img src="https://via.placeholder.com/120x120.png?text=QR+Code" alt="QR Code" style="margin-top: 8px;" />
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://www.masala-gf.de/" target="_blank" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Visit Now https://www.masala-gf.de <br> to get discount
              </a>
            </div>

            <div style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 32px;">
              <p>&copy; 2025 Masala Taste Of India. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 2px dashed #4ade80; padding: 20px;">
          <h2 style="color: #4ade80;">🌟 Exclusive Coupons Just for You!</h2>
          <ul>
            ${coupons.map(c => `
              <li style="margin: 10px 0;">
                <strong>${c.code}</strong> - ${c.discount}
              </li>
            `).join('')}
          </ul>
          <p>Don't miss out – shop today!</p>
          <p style="font-size: 12px; color: gray;">Masala Store | Thank you for your support</p>
        </div>
      `;
    }
  };

  const handleSelect = (id: number) => {
    setSelectedTemplateId(id);
    const html = fillTemplate(id);
    setTemplate(html);
    router.push('/campaigns');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📧 Choose an Email Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((id) => (
          <div
            key={id}
            className={`border-2 rounded-lg p-4 shadow-md cursor-pointer ${
              selectedTemplateId === id ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => handleSelect(id)}
          >
            <h2 className="text-lg font-semibold mb-2">Template {id}</h2>
            <div className="h-48 overflow-auto bg-gray-50 text-sm p-2 rounded">
              <div dangerouslySetInnerHTML={{ __html: fillTemplate(id) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
