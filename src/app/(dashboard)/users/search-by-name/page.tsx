'use client';

import { useEffect, useState } from 'react';
import { userType } from '@/lib/types/userType';
import { fetchAllUsers } from '@/lib/firebase/functions/userFunctions';

export default function CustomerTable() {
  const [customers, setCustomers] = useState<userType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<userType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'email'>('email');

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
          if (searchBy === 'name') {
            return c.username?.toLowerCase().includes(lowerSearch);
          }
          if (searchBy === 'email') {
            return c.email?.toLowerCase().includes(lowerSearch);
          }
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

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-semibold mb-4">
        Search Customers ({filteredCustomers.length})
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value as 'name' | 'email')}
          className="px-3 py-2 border rounded w-full sm:w-1/4"
        >
          <option value="email">Search by Email</option>
          <option value="name">Search by Name</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${searchBy}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-3/4"
        />
      </div>

      {loading ? (
        <p>Searching...</p>
      ) : search.trim() === '' ? (
        <p className="text-gray-500">Start typing to search customers.</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No matching customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Created Time</th>
                <th className="px-4 py-2 border">Doc ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{customer.username}</td>
                  <td className="px-4 py-2 border">{customer.email}</td>
                  <td className="px-4 py-2 border">{customer.time ?? '-'}</td>
                  <td className="px-4 py-2 border text-xs">{customer.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
