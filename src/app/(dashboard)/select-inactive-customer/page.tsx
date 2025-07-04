'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import ManualEmailEntry from './components/ManualEmailEntry';
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
  'gurjiitsingh2@gmail.com',
];

const InactiveCustomersList = () => {
  const {
    setRecipients,
    manualEmails,
    setManualEmails,
    emailsToRemove,
    recipients,
  } = useAppContext();

  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]);
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [selectedTestEmails, setSelectedTestEmails] = useState<string[]>([]);

  const router = useRouter();

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
    const baseEmails = ["gurjiitsingh2@gmail.com","vijaykumargifhorn@gmail.com"];

    const extraEmails = manualEmails
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const testEmails = selectedTestEmails.map(e => e.trim());

    const excludeEmails = [
      ...emailsToRemove
        .split(/[\n,]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => !!e),
      ...unsubscribedEmails,
    ];

    const combined = [...baseEmails, ...extraEmails];
    const filtered = combined.filter(
      e => !excludeEmails.includes(e.toLowerCase()) && !testEmails.includes(e)
    );

    const final = [...new Set([...filtered, ...testEmails])];
    setFinalEmailList(final);
  }, [
    manualEmails,
    emailsToRemove,
    unsubscribedEmails,
    recipients,
    selectedTestEmails,
    mode,
  ]);

  const handleGoToSendEmails = () => {
    setRecipients(finalEmailList);
    router.push('/campaigns');
  };

  const toggleTestEmail = (email: string) => {
    setSelectedTestEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  return (
    <div className="mt-2">
      <h4 className="bg-slate-200 rounded-2xl p-3 text-2xl my-8 font-semibold text-gray-800">
        Choose Customers Email
      </h4>

      {/* Link to Automatic Selection Page */}
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-xl">
        <h5 className="font-semibold text-blue-800 mb-2">
          Want to pick emails automatically?
        </h5>
        <p className="text-sm text-blue-700 mb-3">
          You can use filters like inactivity, last order date, unsubscribed status, and more.
        </p>
        <button
          onClick={() => router.push('/inactive-days')}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Automatic Selection →
        </button>
      </div>

     

      {/* Test Emails */}
      <div className="mb-6">
        <h4 className="text-xl mb-2 font-semibold text-gray-800">Add Test Emails</h4>
        <div className="flex flex-col gap-2">
          {TEST_EMAILS.map(email => (
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

      {/* Manual Email Entry */}
      <ManualEmailEntry
        value={manualEmails}
        onChange={setManualEmails}
        visible={mode === 'manual' || mode === 'auto'}
      />

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
    </div>
  );
};

export default InactiveCustomersList;
