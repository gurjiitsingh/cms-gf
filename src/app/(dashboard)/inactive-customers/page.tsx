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

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
export type InactiveCustomer = {
  id: string;
  name: string;
  email: string;
  userId: string;
  lastOrderDate?: string | null;
  noOfferEmails?: boolean;
};

const InactiveCustomersList = () => {
  const [customers, setCustomers] = useState<InactiveCustomer[]>([]);
  const [inactiveDays, setInactiveDays] = useState<number>(7);
  const [manualEmails, setManualEmails] = useState<string>(''); // ✅ Add emails
  const [emailsToRemove, setEmailsToRemove] = useState<string>(''); // ✅ Remove emails
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]); // ✅ Final preview

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

  // Update final list whenever inputs change
  useEffect(() => {
    const filteredEmails = customers
      .filter((cust) => !cust.noOfferEmails && cust.email)
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

    setFinalEmailList(finalEmails);
  }, [customers, manualEmails, emailsToRemove]);

  const handleGoToSendEmails = () => {
    setRecipients(finalEmailList);
    router.push('/campaigns');
  };

  return (
    <div className="mt-2">
  <Link
    href="/inactive-customers/recent-order"
    className="inline-block mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
  >
    All Customer Last Order Data
  </Link>
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
          {[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 45,46,47, 60,61,62,63,64,65,66,67,68,69,70].map(
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
                    ? new Date(cust.lastOrderDate).toLocaleString('de-DE', {
                        timeZone: 'Europe/Berlin',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>{cust.noOfferEmails ? '❌' : '✅'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Manual Add */}
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

      {/* ✅ Manual Remove */}
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

      {/* ✅ Show Final List */}
      <div className="mt-6">
        <label className="block mb-1 font-medium text-gray-800">
          Final Email List to be Sent:
        </label>
        <textarea
          readOnly
          value={finalEmailList.join('\n')}
          rows={6}
          className="w-full border rounded p-2 bg-gray-100 text-sm text-gray-700"
        />
      </div>

      <button
        onClick={handleGoToSendEmails}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        disabled={finalEmailList.length === 0}
      >
        Save and Go to Campaign
      </button>
    </div>
  );
};

export default InactiveCustomersList;
