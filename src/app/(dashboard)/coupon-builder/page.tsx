'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  addDoc,
  Timestamp,
  query,
  onSnapshot,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import dayjs from 'dayjs';

type CategoryType = {
  id: string;
  name: string;
};

export default function CouponBuilder() {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    discountType: 'flat',
    minSpend: '',
    message: '',
  });

  const [excludedCategoryIds, setExcludedCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [coupons, setSavedCoupons] = useState<any[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const router = useRouter();
  const { coupons: selectedFromContext, setCoupons } = useAppContext();

  // Initialize selected coupons from context
  useEffect(() => {
    if (selectedFromContext.length > 0) {
      const selectedIds = selectedFromContext.map((c) => c.id);
      setSelectedCoupons(selectedIds);
    }
  }, [selectedFromContext]);

  useEffect(() => {
    const q = query(collection(db, 'coupon'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCoupons = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSavedCoupons(fetchedCoupons);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getDocs(collection(db, 'category'));
      const data: CategoryType[] = [];
      result.forEach((doc) => {
        data.push({ id: doc.id, ...(doc.data() as any) });
      });
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.discount) {
      const today = dayjs().format('DD MMM YYYY, HH:mm:ss');
      const oneYearLater = dayjs().add(1, 'year').format('YYYY-MM-DD');
      const selectedNames = categories
        .filter((cat) => excludedCategoryIds.includes(cat.id))
        .map((cat) => cat.name)
        .join(' and ');

      const finalMessage = newCoupon.message?.trim() || 'Enjoy your discount!';

      try {
        await addDoc(collection(db, 'coupon'), {
          code: newCoupon.code,
          discount: Number(newCoupon.discount),
          discountType: newCoupon.discountType,
          message: selectedNames ? `Not applicable on ${selectedNames}.` : '',
          minSpend: Number(newCoupon.minSpend) || 0,
          excludedCategoryIds,
          couponDesc: finalMessage,
          productCat: 'all',
          isFeatured: true,
          isActivated: true,
          offerType: 'cms',
          expiry: oneYearLater,
          startDate: today,
          createdAt: Timestamp.now(),
        });

        setNewCoupon({
          code: '',
          discount: '',
          discountType: 'flat',
          minSpend: '',
          message: '',
        });
        setExcludedCategoryIds([]);
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
    const selected = coupons.filter((c) => selectedCoupons.includes(c.id));
    setCoupons(selected);
    router.push('/campaigns');
  };

  const handleExcludedChange = (id: string) => {
    setExcludedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
           <div className="mt-8">
      
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
       Select Coupons 
      </h2>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <input
                type="checkbox"
                checked={selectedCoupons.includes(coupon.id)}
                onChange={() => handleCheckboxChange(coupon.id)}
                className="mt-1"
              />
              <div className="text-gray-800 dark:text-gray-200">
                <p><strong>Code:</strong> {coupon.code}</p>
                <p><strong>Discount:</strong> {coupon.discount}</p>
                <p><strong>Type:</strong> {coupon.discountType}</p>
                <p><strong>Min Spend:</strong> {coupon.minSpend}</p>
                <p><strong>Message:</strong> {coupon.message}</p>
                <p><strong>Description:</strong> {coupon.couponDesc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCoupons.length > 0 && (
        <button
          onClick={handleUseSelected}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Use Selected Coupons in Campaign
        </button>
      )}

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Create New Coupon
      </h2>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Coupon Code"
          value={newCoupon.code}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, code: e.target.value })
          }
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Discount (e.g., 5)"
          value={newCoupon.discount}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, discount: e.target.value })
          }
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Minimum Spend (optional)"
          value={newCoupon.minSpend}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, minSpend: e.target.value })
          }
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={newCoupon.discountType}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, discountType: e.target.value })
          }
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="flat">Flat</option>
          <option value="percent">Percent</option>
        </select>

        <textarea
          placeholder="Coupon Message (optional)"
          value={newCoupon.message}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, message: e.target.value })
          }
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <div>
          <p className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Exclude Categories:
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludedCategoryIds.includes(cat.id)}
                  onChange={() => handleExcludedChange(cat.id)}
                />
                <span className="text-gray-800 dark:text-gray-200">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddCoupon}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Save Coupon
        </button>
      </div>

 
    </div>
  );
}
