'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

type MonthlySales = {
  month: string;
  totalSales: number;
  orderCount: number;
};

export default function MonthlySalesTable() {
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const ref = collection(db, 'orderMaster');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const salesMap: Record<string, MonthlySales> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as orderMasterDataT;

        const createdAt = (data.createdAt as Timestamp)?.toDate();
        const endTotalG = data.endTotalG || 0;

        if (!createdAt) return;

        const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (!salesMap[monthKey]) {
          salesMap[monthKey] = {
            month: monthKey,
            totalSales: 0,
            orderCount: 0,
          };
        }

        salesMap[monthKey].totalSales += endTotalG;
        salesMap[monthKey].orderCount += 1;
      });

      const sorted = Object.values(salesMap).sort((a, b) =>
        a.month < b.month ? 1 : -1
      );

      setMonthlySales(sorted);
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Sales Summary</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Month</th>
              <th className="border px-4 py-2 text-left">Total Orders</th>
              <th className="border px-4 py-2 text-left">Total Sales (₹)</th>
            </tr>
          </thead>
          <tbody>
            {monthlySales.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{row.month}</td>
                <td className="border px-4 py-2">{row.orderCount}</td>
                <td className="border px-4 py-2">₹{row.totalSales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
