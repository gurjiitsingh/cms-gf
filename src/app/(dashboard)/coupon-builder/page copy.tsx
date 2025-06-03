// components/CouponBuilder.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function CouponBuilder() {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    message: '',
  });

  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCoupons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCoupons(fetchedCoupons);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.discount && newCoupon.message) {
      try {
        await addDoc(collection(db, 'coupons'), {
          ...newCoupon,
          createdAt: Timestamp.now(),
        });
        setNewCoupon({ code: '', discount: '', message: '' });
      } catch (error) {
        console.error('Error saving coupon:', error);
      }
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleUseSelected = () => {
    // Navigate to next page with selected coupons in query params or state
    const queryParams = selectedCoupons.map((id) => `couponIds=${id}`).join('&');
    router.push(`/dashboard/coupon-template?${queryParams}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Create New Coupon</h2>
      <input
        type="text"
        placeholder="Coupon Code"
        value={newCoupon.code}
        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Discount (e.g., 5€)"
        value={newCoupon.discount}
        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Coupon Message"
        value={newCoupon.message}
        onChange={(e) => setNewCoupon({ ...newCoupon, message: e.target.value })}
        className="w-full border p-2 rounded"
      ></textarea>
      <button
        onClick={handleAddCoupon}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Coupon
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Saved Coupons (Recent First)</h3>
        {coupons.map((coupon) => (
          <div key={coupon.id} className="border p-4 rounded mb-2 flex items-start gap-2">
            <input
              type="checkbox"
              checked={selectedCoupons.includes(coupon.id)}
              onChange={() => handleCheckboxChange(coupon.id)}
              className="mt-1"
            />
            <div>
              <p><strong>Code:</strong> {coupon.code}</p>
              <p><strong>Discount:</strong> {coupon.discount}</p>
              <p><strong>Message:</strong> {coupon.message}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCoupons.length > 0 && (
        <button
          onClick={handleUseSelected}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Use Selected Coupons in Template
        </button>
      )}
    </div>
  );
}