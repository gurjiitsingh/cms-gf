// app/coupon-template/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

export default function CouponTemplatePage() {
  const searchParams = useSearchParams();
  const couponIds = searchParams.getAll('couponIds');
  const [coupons, setCoupons] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (couponIds.length === 0) return;
      const q = query(collection(db, 'coupons'), where('__name__', 'in', couponIds));
      const snapshot = await getDocs(q);
      setCoupons(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCoupons();
  }, [couponIds]);

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-green-700">Exclusive Coupons Just for You!</div>
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            Logo
          </div>
        </div>

        <p className="mb-6 text-gray-700">
          Use one of these special coupons on your next order and save big:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="border border-green-600 p-4 rounded-lg bg-green-100">
              <h3 className="text-xl font-semibold text-green-800">Code: {coupon.code}</h3>
              <p className="text-green-700 font-medium">Discount: {coupon.discount}</p>
              <p className="text-gray-600 mt-2">{coupon.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded shadow flex items-center justify-center">
            QR Code
          </div>
        </div>
      </div>
    </div>
  );
}
