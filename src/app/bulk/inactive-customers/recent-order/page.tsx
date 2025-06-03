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
import { useAppContext } from '@/context/AppContext';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type CustomerT = {
  id: string;
  name: string;
  email: string;
  userId: string;
  lastOrderDate?: Timestamp; // ✅ update this
  noOfferEmails?: boolean;
  updatedAt?: string;
};

const AllCustomersList = () => {
  const [customers, setCustomers] = useState<CustomerT[]>([]);
  const [manualEmails, setManualEmails] = useState<string>(''); 
  const [emailsToRemove, setEmailsToRemove] = useState<string>(''); 
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]);

  const router = useRouter();
  const { setRecipients } = useAppContext();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customerRecentOrder'));
        const data: CustomerT[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CustomerT[];
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const baseEmails = customers
      .filter((cust) => !cust.noOfferEmails && cust.email)
      .map((cust) => cust.email);

    const extraEmails = manualEmails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const excludeEmails = emailsToRemove
      .split(/[\n,]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const final = [...new Set([...baseEmails, ...extraEmails])].filter(
      (e) => !excludeEmails.includes(e.toLowerCase())
    );

    setFinalEmailList(final);
  }, [customers, manualEmails, emailsToRemove]);

  const handleGoToSendEmails = () => {
    setRecipients(finalEmailList);
    router.push('/campaigns');
  };

  return (
    <div className="mt-2">
      <h3 className="text-2xl mb-2 font-semibold">All Customers</h3>

      <p className="mb-4 text-gray-700">
        Total Customers: <span className="font-bold">{customers.length}</span>
      </p>

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
 {cust.lastOrderDate && typeof cust.lastOrderDate === 'object' && 'toDate' in cust.lastOrderDate
    ? cust.lastOrderDate.toDate().toLocaleString('de-DE', {
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
        Select/Create Coupon
      </button>
    </div>
  );
};

export default AllCustomersList;
