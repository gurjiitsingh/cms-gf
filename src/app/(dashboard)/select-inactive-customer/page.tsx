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
import CampaignList from './components/CampaignList';
import SavedEmailListViewer from '../new-manaully-saved-emails/components/SavedEmailListViewer';
import ManualEmailEntry from './components/ManualEmailEntry';
import EmailRemovalSection from './components/EmailRemovalSection';
import UnsubscribedEmailsSection from './components/UnsubscribedEmailsSection';
import FinalEmailListSection from './components/FinalEmailListSection';

export type InactiveCustomer = {
  id: string;
  name: string;
  email: string;
  userId: string;
  lastOrderDate?: string | null;
  noOfferEmails?: boolean;
};

const TEST_EMAILS = [
  'lund.ramesh@yahoo.com',
   'vijaykumargifhorn@gmail.com',
  'gurjiitsingh2@gmail.com',
  
];

const InactiveCustomersList = () => {
  const {
    setRecipients,
    lastCampaign,
    manualEmails,
    setManualEmails,
    emailsToRemove,
    setEmailsToRemove,
    recipients,
    oldRecipients,
  } = useAppContext();

  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [customers, setCustomers] = useState<InactiveCustomer[]>([]);
  const [inactiveDays, setInactiveDays] = useState<number>(7);
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]);
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [selectedTestEmails, setSelectedTestEmails] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false); // 👈 Toggle for the table

  const router = useRouter();
  const lc = lastCampaign?.emails?.length ?? 0;

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
    if (mode === 'auto') {
      async function fetchInactive() {
        try {
          const result = await getInactiveCustomers(inactiveDays);
          setCustomers(result);
        } catch (error) {
          console.error('Error fetching inactive customers:', error);
        }
      }

      fetchInactive();
    }
  }, [inactiveDays, mode]);

  useEffect(() => {
    const baseEmails =
      mode === 'auto'
        ? customers
            .filter((cust) => cust.email && cust.noOfferEmails !== true)
            .map((cust) => cust.email.trim())
        : [];

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

    if (oldRecipients) {
      excludeEmails.push(...oldRecipients.map((e) => e.toLowerCase()));
    }

    const combined = [...baseEmails, ...extraEmails];
    const filtered = combined.filter(
      (e) => !excludeEmails.includes(e.toLowerCase()) && !testEmails.includes(e)
    );

    const final = [...new Set([...filtered, ...testEmails])];
    setFinalEmailList(final);
  }, [
    customers,
    manualEmails,
    emailsToRemove,
    unsubscribedEmails,
    recipients,
    lastCampaign,
    selectedTestEmails,
    mode,
    oldRecipients,
  ]);

  const handleGoToSendEmails = () => {
    setRecipients(finalEmailList);
    router.push('/campaigns');
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
      {/* <h3 className="text-2xl mb-4 font-semibold text-gray-800">Choose Customers Email</h3> */}
    <h4 className="bg-slate-200 rounded-2xl p-3 text-2xl my-8 font-semibold text-gray-800">Choose Customers Email</h4>
    
      {/* Mode Selector */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Select Email Mode</h4>
        <div className="flex flex-col gap-4">
          {/* Auto Mode */}
          <label className="flex items-center gap-3 p-4 rounded-lg border border-blue-200 cursor-pointer shadow-sm transition hover:shadow-md bg-blue-50 hover:bg-blue-100">
            <input
              type="radio"
              name="emailMode"
              value="auto"
              checked={mode === 'auto'}
              onChange={() => setMode('auto')}
              className="accent-blue-600 w-5 h-5"
            />
            <div className="text-blue-800">
              <p className="font-semibold">1. Automatically</p>
              <p className="text-sm text-blue-700">Include inactive customers, filters, exclusions, and test emails</p>
            </div>
          </label>

          {/* Manual Mode */}
          <label className="flex items-center gap-3 p-4 rounded-lg border border-green-200 cursor-pointer shadow-sm transition hover:shadow-md bg-green-50 hover:bg-green-100">
            <input
              type="radio"
              name="emailMode"
              value="manual"
              checked={mode === 'manual'}
              onChange={() => setMode('manual')}
              className="accent-green-600 w-5 h-5"
            />
            <div className="text-green-800">
              <p className="font-semibold">2. Manually Only</p>
              <p className="text-sm text-green-700">Add emails manually + test emails only</p>
            </div>
          </label>
        </div>
      </div>

      {/* Test Emails */}
      <div className="mb-6">
        <h4 className="text-xl mb-2 font-semibold text-gray-800">Add Test Emails</h4>
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
<hr className="mt-8 mb-4 border-gray-300" />
    {/* Inactive Days (only for auto mode) */}
      {mode === 'auto' && (
        <div className="mb-6">
          <h4 className="text-xl mb-2 font-semibold text-gray-800">Inactive Customer Email</h4>
          <p className="text-sm text-gray-500 mb-2">Select number of days since their last order.</p>
          <select
            className="border rounded px-3 py-2"
            value={inactiveDays}
            onChange={(e) => setInactiveDays(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20, 30, 40, 50, 60].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>
      )}    
<hr className="mt-8 mb-4 border-gray-300" />
<SavedEmailListViewer />
 <hr className="mt-8 mb-4 border-gray-300" />
      {/* Manual Email Entry */}
 <ManualEmailEntry
  value={manualEmails}
  onChange={setManualEmails}
  visible={mode === 'manual' || mode === 'auto'}
/>

 <hr className="mt-8 mb-4 border-gray-300" />
    

      {/* Remove Emails */}
      
       <h4 className="bg-slate-200 rounded-2xl p-3 text-2xl mt-12 mb-7 font-semibold text-gray-800">Removal of Unwanted Emails</h4>
      
<EmailRemovalSection
  value={emailsToRemove}
  onChange={setEmailsToRemove}
/>

 <hr className="mt-8 mb-4 border-gray-300" />
      {/* Last Campaign Emails */}
      <CampaignList />
<hr className="mt-8 mb-4 border-gray-300" />
      {/* Unsubscribed Emails */}
    <UnsubscribedEmailsSection emails={unsubscribedEmails} />

 <hr className="mt-8 mb-4 border-gray-300" />
  {/* Go to Campaign Button */}
      <button
        onClick={handleGoToSendEmails}
        className="mt-2 mb-8 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        disabled={finalEmailList.length === 0}
      >
        Save and Go to Campaign
      </button>
      {/* Final Email List */}
    <FinalEmailListSection finalEmailList={finalEmailList} />


     

      {/* Toggle Table Visibility */}
   <div className="mb-4">
  <button
    onClick={() => setShowTable(prev => !prev)}
    className={`px-4 py-2 rounded text-white transition
      ${showTable ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 hover:bg-slate-600'}`}
  >
    {showTable ? 'Hide' : 'Show'} Inactive Customers Table ({customers.length})
  </button>
</div>

      {/* Inactive Customers Table */}
      {mode === 'auto' && showTable && (
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
      )}
    </div>
  );
};

export default InactiveCustomersList;
