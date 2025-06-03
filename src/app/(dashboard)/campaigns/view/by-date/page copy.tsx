'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import {
  format,
  isAfter,
  subDays,
  startOfDay
} from 'date-fns';
import { useAppContext } from '@/context/AppContext';

type Campaign = {
  id: string;
  emails: string[];
  createdAt: { toDate: () => Date };
};

const filters = [
  { label: 'All', value: 0 },
  { label: 'Today', value: 1 },
  { label: 'Last 3 Days', value: 3 },
  { label: 'Last 7 Days', value: 7 },
];

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [daysFilter, setDaysFilter] = useState(0);
  const [groupByDate, setGroupByDate] = useState(false);
  const pageSize = 5;

  const { setLastCampaign } = useAppContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, 'campaignsSent'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Campaign[];
      setCampaigns(data);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this campaign?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'campaignsSent', id));
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (daysFilter === 0) return true;
    const created = c.createdAt.toDate();
    const since = subDays(startOfDay(new Date()), daysFilter - 1);
    return isAfter(created, since);
  });

  const groupedCampaigns = groupByDate
    ? Object.values(
        filteredCampaigns.reduce((acc, campaign) => {
          const dateKey = format(campaign.createdAt.toDate(), 'yyyy-MM-dd');
          if (!acc[dateKey]) {
            acc[dateKey] = {
              id: dateKey,
              createdAt: campaign.createdAt,
              emails: [...campaign.emails]
            };
          } else {
            acc[dateKey].emails.push(...campaign.emails);
          }
          return acc;
        }, {} as Record<string, Campaign>)
      )
    : filteredCampaigns;

  const paginatedCampaigns = groupedCampaigns.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(groupedCampaigns.length / pageSize);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campaigns</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="flex items-center gap-2">
          <span>Filter by:</span>
          <select
            className="border px-2 py-1 rounded"
            value={daysFilter}
            onChange={(e) => {
              setDaysFilter(Number(e.target.value));
              setPage(1);
            }}
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={groupByDate}
            onChange={(e) => setGroupByDate(e.target.checked)}
          />
          <span>Group by Date</span>
        </label>
      </div>

      {/* Campaign List */}
      {loading ? (
        <p>Loading...</p>
      ) : groupedCampaigns.length === 0 ? (
        <p>No campaigns found for selected filter.</p>
      ) : (
        <div className="space-y-4">
          {paginatedCampaigns.map((c) => (
            <div key={c.id} className="border p-4 rounded shadow-sm">
              <p className="text-sm text-gray-600">
                {format(c.createdAt.toDate(), 'PPPpp')}
              </p>
              <p className="mt-2 text-sm text-gray-800">
                <strong>Emails:</strong> {Array.from(new Set(c.emails)).join(', ')}
              </p>

              {!groupByDate && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setLastCampaign(c)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                  >
                    Set as Last Campaign
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
