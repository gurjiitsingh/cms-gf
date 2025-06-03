'use client';

import React, { useState } from 'react';

const coupons = [
  {
    code: 'MT250505',
    discount: '€5 off',
    message: 'Use this code on your next order',
  },
  {
    code: 'MT250510',
    discount: '€10 off',
    message: 'Big savings await you!',
  },
];

const CouponDesignSelector = () => {
  const [selectedDesign, setSelectedDesign] = useState<'design1' | 'design2'>('design1');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Select a Coupon Design</h1>

      <div className="flex justify-center mb-6 gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="design"
            value="design1"
            checked={selectedDesign === 'design1'}
            onChange={() => setSelectedDesign('design1')}
          />
          Design 1
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="design"
            value="design2"
            checked={selectedDesign === 'design2'}
            onChange={() => setSelectedDesign('design2')}
          />
          Design 2
        </label>
      </div>

      {selectedDesign === 'design1' ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150x50?text=Your+Logo"
              alt="Logo"
              className="mx-auto mb-4"
            />
            <h2 className="text-red-600 text-xl font-bold">🎁 You've Got Coupons!</h2>
          </div>
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-md"
            >
              <p className="text-gray-700">Use code:</p>
              <p className="text-lg font-bold text-red-700">{c.code}</p>
              <p>{c.discount} — {c.message}</p>
            </div>
          ))}
          <div className="text-center mt-4">
            <p>Scan to shop now:</p>
            <img
              src="https://via.placeholder.com/120.png?text=QR+Code"
              alt="QR Code"
              className="mx-auto mt-2"
            />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-6 shadow-lg">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150x50?text=Your+Logo"
              alt="Logo"
              className="mx-auto mb-4"
            />
            <h2 className="text-pink-700 text-xl font-bold">🌟 Special Coupon Drop!</h2>
          </div>
          <div className="grid gap-4 mt-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-white p-4 rounded-md shadow-sm border border-pink-200">
                <p className="text-gray-800 font-medium">Your Code:</p>
                <p className="text-xl text-pink-600 font-bold">{c.code}</p>
                <p>{c.discount} – {c.message}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p>Tap the QR to start shopping:</p>
            <img
              src="https://via.placeholder.com/120.png?text=QR+Code"
              alt="QR Code"
              className="mx-auto mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponDesignSelector;
