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
import { useRouter } from 'next/navigation';

type CampaignT = {
  id: string;
  emails: string[];
  createdAt: Timestamp;
};

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<CampaignT[]>([]);
  const [groupedEmails, setGroupedEmails] = useState<Record<string, string[]>>({});
  const [daysFilter, setDaysFilter] = useState<number>(7); // Default to 7
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const { setRecipients, setLastCampaign } = useAppContext();
  const router = useRouter();

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
    const groupByDate = () => {
      const now = new Date();
      const limitDate = subDays(now, daysFilter);
      const groups: Record<string, Set<string>> = {};

      campaigns.forEach(c => {
        const date = c.createdAt.toDate();
        if (isAfter(date, limitDate)) {
          const dateStr = format(date, 'yyyy-MM-dd');
          if (!groups[dateStr]) groups[dateStr] = new Set();
          c.emails.forEach(email => groups[dateStr].add(email));
        }
      });

      const formattedGroups: Record<string, string[]> = {};
      const newSelectedGroups = new Set<string>();

      for (const [key, value] of Object.entries(groups)) {
        formattedGroups[key] = Array.from(value);
        newSelectedGroups.add(key);
      }

      setGroupedEmails(formattedGroups);
      setSelectedGroups(newSelectedGroups);

      // Automatically update context with initial selection
      const allSelectedEmails = Array.from(newSelectedGroups)
        .flatMap(date => formattedGroups[date])
        .filter(Boolean);
      const uniqueEmails = Array.from(new Set(allSelectedEmails));

      setRecipients(uniqueEmails);
      setLastCampaign({
        id: 'auto-selected',
        emails: uniqueEmails,
        createdAt: new Date().toISOString(),
      });
    };

    if (!loading) {
      groupByDate();
    }
  }, [campaigns, daysFilter, loading]);

  const toggleGroup = (dateStr: string) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      newSet.has(dateStr) ? newSet.delete(dateStr) : newSet.add(dateStr);
      return newSet;
    });
  };

  const handleUseGroup = () => {
    const allSelectedEmails = Array.from(selectedGroups)
      .flatMap(date => groupedEmails[date])
      .filter(Boolean);

    const uniqueEmails = Array.from(new Set(allSelectedEmails));

    setRecipients(uniqueEmails);
    setLastCampaign({
      id: 'manual-group',
      emails: uniqueEmails,
      createdAt: new Date().toISOString(),
    });

    router.push('/select-inactive-customer');
  };

  const selectedEmails = Array.from(selectedGroups)
    .flatMap(date => groupedEmails[date])
    .filter(Boolean);
  const uniqueSelectedEmails = Array.from(new Set(selectedEmails));

  const dayOptions = [1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campaign Email Groups by Day</h2>

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {Object.entries(groupedEmails).length === 0 ? (
            <p>No campaigns found in the last {daysFilter} day(s).</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedEmails).map(([dateStr, emails]) => {
                const isSelected = selectedGroups.has(dateStr);
                return (
                  <div
                    key={dateStr}
                    className={`border p-4 rounded ${
                      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{format(new Date(dateStr), 'PPPP')}</p>
                        <p className="text-sm text-gray-600">{emails.length} unique email(s)</p>
                      </div>
                      <button
                        onClick={() => toggleGroup(dateStr)}
                        className={`px-3 py-1 rounded text-white ${
                          isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isSelected ? 'Deselect' : 'Select'}
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-800 overflow-x-auto max-h-32">
                      {emails.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedGroups.size > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Selected Emails</h3>
              <p className="text-sm text-gray-600 mb-2">
                {uniqueSelectedEmails.length} total emails selected from {selectedGroups.size} group(s).
              </p>
              <textarea
                readOnly
                value={uniqueSelectedEmails.join('\n')}
                rows={8}
                className="w-full border rounded p-2 bg-gray-100 text-sm"
              />
              <button
                onClick={handleUseGroup}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Use Selected Emails
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
