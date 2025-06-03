'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import dayjs from 'dayjs';

type CouponType = {
  id?: string;
  code: string;
  discount: number;
  message?: string;
  minSpend?: number;
  productCat: string;
  excludedCategoryIds?: string[];
  offerType?: string;
  isFeatured?: boolean;
  isActivated: boolean;
  expiry?: string;
  discountType?: string;
  startDate?: string;
  couponDesc?: string;
};

type CategoryType = {
  id: string;
  name: string;
};

export default function CouponBuilder() {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    message: '',
    discountType: 'flat',
    minSpend: '',
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [excludedCategoryIds, setExcludedCategoryIds] = useState<string[]>([]);
  const [excludedCategoryNames, setExcludedCategoryNames] = useState<string[]>([]);

  const [coupons, setSavedCoupons] = useState<any[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const router = useRouter();
  const { setCoupons } = useAppContext();

  // Fetch coupons from Firestore
  useEffect(() => {
    const q = query(collection(db, 'coupon'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCoupons = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSavedCoupons(fetchedCoupons);
    });

    return () => unsubscribe();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getDocs(collection(db, 'category'));
      const data: CategoryType[] = [];
      result.forEach((doc) => {
        data.push({ id: doc.id, ...(doc.data() as { name: string }) });
      });
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (id: string, name: string) => {
    setExcludedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
    setExcludedCategoryNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.discount && newCoupon.message) {
      try {
        const couponDesc = excludedCategoryNames.length
          ? `Not applicable on ${excludedCategoryNames.join(' and ')}.`
          : '';

        const couponData: CouponType = {
          code: newCoupon.code,
          discount: parseFloat(newCoupon.discount),
          message: newCoupon.message,
          discountType: newCoupon.discountType,
          minSpend: parseFloat(newCoupon.minSpend || '0'),
          createdAt: Timestamp.now(),
          productCat: 'all',
          offerType: 'cms',
          isFeatured: true,
          isActivated: true,
          startDate: dayjs().format('DD MMM YYYY, HH:mm:ss'),
          expiry: dayjs().add(1, 'year').format('YYYY-MM-DD'),
          excludedCategoryIds,
          couponDesc,
        };

        await addDoc(collection(db, 'coupon'), couponData);
        setNewCoupon({ code: '', discount: '', message: '', discountType: 'flat', minSpend: '' });
        setExcludedCategoryIds([]);
        setExcludedCategoryNames([]);
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Coupon</h2>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Coupon Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Discount (e.g., 5)"
          value={newCoupon.discount}
          onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Minimum Spend (optional)"
          value={newCoupon.minSpend}
          onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={newCoupon.discountType}
          onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="flat">Flat (€)</option>
          <option value="percent">Percent (%)</option>
        </select>

        <textarea
          placeholder="Coupon Message"
          value={newCoupon.message}
          onChange={(e) => setNewCoupon({ ...newCoupon, message: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div>
          <h4 className="text-lg font-semibold mb-2">Exclude Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={excludedCategoryIds.includes(cat.id)}
                  onChange={() => handleCategoryChange(cat.id, cat.name)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {excludedCategoryNames.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Coupon Description: Not applicable on {excludedCategoryNames.join(' and ')}.
          </p>
        )}

        <button
          onClick={handleAddCoupon}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Save Coupon
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Saved Coupons</h3>
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
      <p><strong>Message:</strong> {coupon.message}</p>
      {coupon.minSpend !== undefined && (
        <p><strong>Min Spend:</strong> €{coupon.minSpend}</p>
      )}
      {coupon.couponDesc && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <strong>Description:</strong> {coupon.couponDesc}
        </p>
      )}
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
    </div>
  );
}
