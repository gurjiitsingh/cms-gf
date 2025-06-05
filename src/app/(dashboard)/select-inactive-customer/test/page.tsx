'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { format, isAfter, subDays } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

type CampaignT = {
  id: string;
  emails: string[];
  createdAt: Timestamp;
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<CampaignT[]>([]);
  const [daysFilter, setDaysFilter] = useState<number>(7); // Default to 7
  const [loading, setLoading] = useState(true);

  const { setRecipients, setLastCampaign } = useAppContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, 'campaignsSent'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<CampaignT, 'id'>),
      }));
      setCampaigns(data);
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (loading) return;

    const now = new Date();
    const limitDate = subDays(now, daysFilter);
    const emailSet = new Set<string>();

    campaigns.forEach(c => {
      const date = c.createdAt.toDate();
      if (isAfter(date, limitDate)) {
        c.emails.forEach(email => emailSet.add(email));
      }
    });

    const uniqueEmails = Array.from(emailSet);

    setRecipients(uniqueEmails);
    setLastCampaign({
      id: `auto-group-${daysFilter}-days`,
      emails: uniqueEmails,
      createdAt: new Date().toISOString(),
    });
  }, [campaigns, daysFilter, loading]);

  const dayOptions = [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="p-4">
      <label className="block mb-2 text-gray-700 font-medium">
        Filter by Last
        <select
          className="ml-2 px-2 py-1 border rounded"
          value={daysFilter}
          onChange={e => setDaysFilter(Number(e.target.value))}
        >
          {dayOptions.map(days => (
            <option key={days} value={days}>
              {days} day{days > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </label>
      {loading && <p>Loading campaigns...</p>}
    </div>
  );
}
