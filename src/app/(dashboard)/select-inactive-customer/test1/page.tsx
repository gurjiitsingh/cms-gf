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

  const { setRecipients } = useAppContext();

  // Fetch campaigns once
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

  // Get unique emails from campaigns within the date range
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

  // Only update local state and recipients when filteredEmails changes
  useEffect(() => {
    setEmailList(filteredEmails);
    setRecipients(filteredEmails);
  }, [filteredEmails, setRecipients]);

  const dayOptions = [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="p-4">
      <label className="block mb-2 text-gray-700 font-medium">
        Select Days Range
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

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {emailList.length} recipient email(s)
        </label>
        <textarea
          readOnly
          value={emailList.join('\n')}
          rows={10}
          className="w-full border rounded p-2 bg-gray-100 text-sm"
        />
      </div>
    </div>
  );
}
