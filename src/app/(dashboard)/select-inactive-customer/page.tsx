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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { InactiveCustomer } from './types';

const TEST_EMAILS = [
  'gurjiitsingh2@gmail.com',
  'gagurjiitsingh@gmail.com',
  'vijaykumargifhorn@gmail.com',
];

const InactiveCustomersList = () => {
  const [customers, setCustomers] = useState<InactiveCustomer[]>([]);
  const [inactiveDays, setInactiveDays] = useState<number>(7);
  const [manualEmails, setManualEmails] = useState<string>('');
  const [emailsToRemove, setEmailsToRemove] = useState<string>('');
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]);
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [excludeLastCampaign, setExcludeLastCampaign] = useState(false);
  const [selectedTestEmails, setSelectedTestEmails] = useState<string[]>([]);

  const router = useRouter();
  const { setRecipients, lastCampaign } = useAppContext();

  useEffect(() => {
    const fetchUnsubscribed = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'unsubscribedEmails'));
        const emails = snapshot.docs
          .map(doc => (doc.data()?.email || '').toLowerCase())
          .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        setUnsubscribedEmails(emails);
      } catch (err) {
        console.error('Error fetching unsubscribed list:', err);
      }
    };

    fetchUnsubscribed();
  }, []);

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

  useEffect(() => {
    const baseEmails = customers
      .filter((cust) => cust.email && cust.noOfferEmails !== true)
      .map((cust) => cust.email.trim());

    const extraEmails = manualEmails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const testEmails = selectedTestEmails.map((e) => e.trim());

    const excludeEmails = [
      ...emailsToRemove
        .split(/[\n,]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => !!e),
      ...unsubscribedEmails,
    ];

    if (excludeLastCampaign && lastCampaign?.emails) {
      excludeEmails.push(...lastCampaign.emails.map((e) => e.toLowerCase()));
    }

    const final = [...new Set([...baseEmails, ...extraEmails, ...testEmails])].filter(
      (e) => !excludeEmails.includes(e.toLowerCase())
    );

    setFinalEmailList(final);
  }, [
    customers,
    manualEmails,
    emailsToRemove,
    unsubscribedEmails,
    excludeLastCampaign,
    lastCampaign,
    selectedTestEmails,
  ]);

  const handleGoToSendEmails = () => {
    setRecipients(finalEmailList);
    router.push('/campaigns');
  };

  const handleFindLastCampaignEmails = () => {
    router.push('/campaigns/view/by-date');
  };

  const toggleTestEmail = (email: string) => {
    setSelectedTestEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  return (
    <div className="mt-2">
      <h3 className="text-2xl mb-4 font-semibold text-gray-800">Choose Customers Email</h3>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">Add Test Emails</h4>
        <div className="flex flex-col gap-2">
          {TEST_EMAILS.map((email) => (
            <label key={email} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedTestEmails.includes(email)}
                onChange={() => toggleTestEmail(email)}
              />
              {email}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">Inactive customer email:</h4>
        <p className="text-sm text-gray-500 mb-2">Select the number of days since their last order.</p>
        <select
          className="border rounded px-3 py-2"
          value={inactiveDays}
          onChange={(e) => setInactiveDays(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 6, 7, 10, 14, 20, 30, 60].map((d) => (
            <option key={d} value={d}>
              {d} days
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">Add  Emails manually</h4>
        <textarea
          value={manualEmails}
          onChange={(e) => setManualEmails(e.target.value)}
          rows={4}
          className="w-full border rounded p-2"
        />
      </div>

 <h4 className="text-2xl mb-4 font-semibold text-gray-800">Remove Customer Emails </h4>
      <div className="mb-6">
       
        <h4 className="text-lg font-semibold text-gray-800 mb-1">Remove  Emails manually</h4>
        <textarea
          value={emailsToRemove}
          onChange={(e) => setEmailsToRemove(e.target.value)}
          rows={4}
          className="w-full border rounded p-2"
        />
      </div>



     

     {lastCampaign?.emails?.length > 0 && (
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-gray-800 mb-1">
      Emails From Last Campaign ({lastCampaign.emails.length})
    </h4>
    <p className="text-sm text-gray-600 mb-2">
      {excludeLastCampaign
        ? 'These emails are currently being excluded from the final list.'
        : 'These emails are included unless you choose to exclude them.'}
    </p>
    <textarea
      readOnly
      value={lastCampaign.emails.join('\n')}
      rows={Math.min(10, lastCampaign.emails.length || 5)}
      className="w-full border rounded p-2 bg-gray-50 text-sm text-gray-700"
    />
    <button
      className={`mt-2 px-4 py-2 rounded text-white ${
        excludeLastCampaign ? 'bg-red-600' : 'bg-blue-600'
      } hover:opacity-90 transition`}
      onClick={() => setExcludeLastCampaign((prev) => !prev)}
    >
      {excludeLastCampaign ? 'Undo Remove From Final List' : 'Remove From Final List'}
    </button>
  </div>
)}

 <div>
        <button
          onClick={handleFindLastCampaignEmails}
          className="mt-2 mb-8 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        >
          Change Last Campaigns Email
        </button>
      </div>


      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">Unsubscribed Customers</h4>
        <textarea
          readOnly
          value={unsubscribedEmails.join('\n')}
          rows={4}
          className="w-full border rounded p-2 bg-red-100 text-sm text-red-700"
        />
      </div>

      <div className="mb-6">
              <h3 className="text-2xl mb-4 font-semibold text-gray-800">Final Email List</h3>
        <p className="text-sm text-gray-500 mb-1">
          Final list includes <strong>{finalEmailList.length}</strong> emails.
          {excludeLastCampaign && lastCampaign?.emails?.length > 0 && (
            <> (Excluded {lastCampaign.emails.length} from last campaign)</>
          )}
        </p>
        <textarea
          readOnly
          value={finalEmailList.join('\n')}
          rows={6}
          className="w-full border rounded p-2 bg-gray-100 text-sm text-gray-700"
        />
      </div>

      <button
        onClick={handleGoToSendEmails}
        className="mt-2 mb-8 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        disabled={finalEmailList.length === 0}
      >
        Select/Create Coupon
      </button>

      <div className="bg-slate-50 rounded-lg p-1 overflow-x-auto">
        <p className="mb-2 text-gray-700 font-medium">
          Total Inactive Customers: <span className="font-bold">{customers.length}</span>
        </p>

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
    </div>
  );
};

export default InactiveCustomersList;
