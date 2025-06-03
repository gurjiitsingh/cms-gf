'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { getInactiveCustomers } from '@/app/action/customerData/dbOperations';
import { InactiveCustomer } from './types';
import { useAppContext } from '@/context/AppContext';

const InactiveCustomersList = () => {
  const [customers, setCustomers] = useState<InactiveCustomer[]>([]);
  const [inactiveDays, setInactiveDays] = useState<number>(7);
  const [manualEmails, setManualEmails] = useState<string>(''); // ✅ For adding emails
  const [emailsToRemove, setEmailsToRemove] = useState<string>(''); // ✅ For removing emails
  const router = useRouter();
  const { setRecipients } = useAppContext();

  useEffect(() => {
    async function fetchInactive() {
      try {
        const result = await getInactiveCustomers(inactiveDays);
        setCustomers(result);
      } catch (error) {
        console.error('Error fetching inactive customers:', error);
      }
    }

    fetchInactive();
  }, [inactiveDays]);

  const handleGoToSendEmails = () => {
    const filteredEmails = customers
      .filter((cust) => !cust.sendOfferEmail && cust.email)
      .map((cust) => cust.email);

    const manualEmailList = manualEmails
      .split(/[\n,]+/)
      .map((email) => email.trim())
      .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    const emailsToExclude = emailsToRemove
      .split(/[\n,]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    const finalEmails = [...new Set([...filteredEmails, ...manualEmailList])].filter(
      (email) => !emailsToExclude.includes(email.toLowerCase())
    );

    setRecipients(finalEmails);
    router.push('/campaigns');
  };

  return (
    <div className="mt-2">
      <h3 className="text-2xl mb-2 font-semibold">Inactive Customers</h3>

      <p className="mb-4 text-gray-700">
        Total Inactive Customers: <span className="font-bold">{customers.length}</span>
      </p>

      <div className="mb-4">
        <label htmlFor="days" className="mr-2 font-medium">
          Inactive for:
        </label>
        <select
          id="days"
          className="border rounded px-2 py-1"
          value={inactiveDays}
          onChange={(e) => setInactiveDays(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 45, 60].map(
            (d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            )
          )}
        </select>
      </div>

      <div className="bg-slate-50 rounded-lg p-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Last Order Date</TableHead>
              <TableHead>Marketing Consent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell>{cust.name}</TableCell>
                <TableCell>{cust.email}</TableCell>
                <TableCell>{cust.userId}</TableCell>
                <TableCell>
                  {cust.lastOrderDate
                    ? new Date(cust.updatedAt).toLocaleString('de-DE', {
                        timeZone: 'Europe/Berlin',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>{cust.sendOfferEmail ? '❌' : '✅'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Textarea for manually adding emails */}
      <div className="mt-6">
        <label className="block mb-1 font-medium text-gray-800">
          Add More Emails (comma or newline separated):
        </label>
        <textarea
          value={manualEmails}
          onChange={(e) => setManualEmails(e.target.value)}
          placeholder="user1@example.com, user2@example.com"
          rows={4}
          className="w-full border rounded p-2"
        />
      </div>

      {/* ✅ Textarea for manually removing emails */}
      <div className="mt-4">
        <label className="block mb-1 font-medium text-gray-800">
          Remove Emails (comma or newline separated):
        </label>
        <textarea
          value={emailsToRemove}
          onChange={(e) => setEmailsToRemove(e.target.value)}
          placeholder="user3@example.com, user4@example.com"
          rows={4}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        onClick={handleGoToSendEmails}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        disabled={customers.length === 0}
      >
        Select/Create Coupon
      </button>
    </div>
  );
};

export default InactiveCustomersList;
