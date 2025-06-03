'use client';

import React from 'react';

const CouponEmailTemplate = () => {
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md font-sans">
      <div className="text-center mb-6">
        <img
          src="https://via.placeholder.com/150x50?text=Your+Logo"
          alt="Logo"
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-red-600">🎁 You've Got Coupons!</h1>
        <p className="text-gray-700 mt-2">Thank you for being a valued customer. Use the codes below on your next order.</p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
        <p className="text-gray-700">Use code:</p>
        <p className="text-lg font-bold text-red-700">MT250505</p>
        <p className="text-gray-800 font-medium">Get <strong>€5 off</strong> your order</p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
        <p className="text-gray-700">Use code:</p>
        <p className="text-lg font-bold text-red-700">MT250510</p>
        <p className="text-gray-800 font-medium">Get <strong>€10 off</strong> your order</p>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">Scan the QR code to shop now:</p>
        <img
          src="https://via.placeholder.com/120x120.png?text=QR+Code"
          alt="QR Code"
          className="mx-auto mt-2"
        />
      </div>

      <div className="text-center text-gray-400 text-sm mt-8">
        <p>&copy; 2025 Masala Store. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CouponEmailTemplate;
