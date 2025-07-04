'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { userType } from '@/lib/types/userType';
import { fetchAllUsers } from '@/lib/firebase/functions/userFunctions';

export default function CustomerTable() {
  const [customers, setCustomers] = useState<userType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<userType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'email'>('email');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const correctPassword = 'p1234_*';

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCustomers([]);
      return;
    }

    const searchCustomers = async () => {
      setLoading(true);
      try {
        const users = customers.length ? customers : await fetchAllUsers();
        if (customers.length === 0) setCustomers(users);

        const lowerSearch = search.toLowerCase();

        const filtered = users.filter((c) => {
          if (searchBy === 'name') return c.username?.toLowerCase().includes(lowerSearch);
          if (searchBy === 'email') return c.email?.toLowerCase().includes(lowerSearch);
          return false;
        });

        setFilteredCustomers(filtered);
      } catch (error) {
        console.error('Failed to search users:', error);
      }
      setLoading(false);
    };

    searchCustomers();
  }, [search, searchBy]);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-6 border rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-center">🔐 Enter Password to Continue</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />
        <button
          onClick={() => setAuthenticated(password === correctPassword)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        {password && password !== correctPassword && (
          <p className="mt-2 text-sm text-red-600 text-center">Incorrect password</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-semibold">Customers</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/users/duplicate"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Duplicate
          </Link>
          <Link
            href="/users/full-list"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Full List
          </Link>
          <Link
            href="/users/by-id"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Search by ID
          </Link>
          <Link
            href="/mail-list"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Upload
          </Link>
          <Link
            href="/mail-list/view"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Show All
          </Link>
          <Link
            href="/orders/recent-orders"
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Customer's Recent Orders
          </Link>
        </div>
      </div>

      {/* You can add the table content here if needed */}
    </div>
  );
}
