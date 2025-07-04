'use client';

import React from 'react';

export default function EmailTemplatePreview() {
  return (
    <div className="max-w-[600px] mx-auto bg-white p-6 rounded-lg font-sans shadow">
      {/* Header */}
      <div className="text-center mb-6">
        <img
          src="https://www.masala-gf.de/logo.jpg"
          alt="Logo"
          className="mx-auto mb-4 w-20"
        />
        <h1 className="text-2xl font-bold text-orange-600">🧡 Willkommen bei Masala!</h1>
        <p className="text-gray-700 mt-2">
          Vielen Dank, dass Sie ein geschätzter Kunde sind. Entdecken Sie jetzt unsere neuen Angebote.
        </p>
      </div>

      {/* Center Banner Image */}
      <div className="text-center my-6">
        <img
          src="https://www.masala-gf.de/banner.jpg"
          alt="Angebot"
          className="w-full max-w-[520px] mx-auto rounded-lg"
        />
      </div>

      {/* QR Code */}
      <div className="text-center mt-8">
        <p className="text-gray-500">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
        <img
          src="https://www.masala-gf.de/masala-gf-qr.png"
          alt="QR-Code"
          className="mx-auto mt-2"
        />
      </div>

      {/* Button */}
      <div className="text-center mt-8">
        <a
          href="https://www.masala-gf.de/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-600 text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 transition"
        >
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mt-10">
        <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  );
}
