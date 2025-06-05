'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { isAfter, subDays } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

type CampaignT = {
  id: string;
  emails: string[];
  createdAt: Timestamp;
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<CampaignT[]>([]);
  const [daysFilter, setDaysFilter] = useState<number>(7); // default 7
  const [emailList, setEmailList] = useState<string[]>([]);
  const [showEmails, setShowEmails] = useState<boolean>(false); // Toggle state

  const { setOldRecipients } = useAppContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, 'campaignsSent'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<CampaignT, 'id'>),
      }));
      setCampaigns(data);
    };

    fetchCampaigns();
  }, []);

  const filteredEmails = useMemo(() => {
    const now = new Date();
    const limitDate = subDays(now, daysFilter);
    const emailsSet = new Set<string>();

    campaigns.forEach(c => {
      const date = c.createdAt.toDate();
      if (isAfter(date, limitDate)) {
        c.emails.forEach(email => emailsSet.add(email));
      }
    });

    return Array.from(emailsSet);
  }, [campaigns, daysFilter]);

  useEffect(() => {
    setEmailList(filteredEmails);
    setOldRecipients(filteredEmails);
  }, [filteredEmails, setOldRecipients]);

  const dayOptions = [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="">
      <h4 className="text-xl mb-2 font-semibold text-gray-800">
        Previous Campaigns Emails
      </h4>

      {/* Selector + Toggle Button in one row */}
      <div className="flex items-center gap-4 mb-2">
        <label className="text-gray-700 font-medium">
          Select Range
          <select
            className="ml-2 px-2 py-1 border rounded"
            value={daysFilter}
            onChange={e => setDaysFilter(Number(e.target.value))}
          >
            {dayOptions.map(days => (
              <option key={days} value={days}>
                Last {days} day{days > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setShowEmails(prev => !prev)}
          className="text-sm text-blue-600 underline"
        >
          {showEmails ? 'Hide Emails' : 'Show Emails'}
        </button>
      </div>

      {showEmails && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {emailList.length} recipient email{emailList.length !== 1 && 's'}
          </label>
          <textarea
            readOnly
            value={emailList.join('\n')}
            rows={10}
            className="w-full border rounded p-2 bg-gray-100 text-sm"
          />
        </div>
      )}
    </div>
  );
}
