'use client'

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { format } from "date-fns";
import { useAppContext } from "@/context/AppContext";

export default function CampaignList() {
  type Campaign = {
    id: string;
    createdAt: Timestamp;
    emails: string[];
  };

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { setLastCampaign } = useAppContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, "campaignsSent"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data: Campaign[] = snapshot.docs.map(doc => {
        const { createdAt, emails } = doc.data();
        return {
          id: doc.id,
          createdAt: createdAt as Timestamp,
          emails: emails as string[],
        };
      });
      setCampaigns(data);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this campaign?");
    if (!confirmed) return;
    await deleteDoc(doc(db, "campaignsSent", id));
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const paginatedCampaigns = campaigns.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(campaigns.length / pageSize);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Campaigns</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {paginatedCampaigns.map(c => (
            <div key={c.id} className="border p-4 rounded shadow-sm">
              <p className="text-sm text-gray-600">
                {format(c.createdAt.toDate(), "PPPpp")}
              </p>
              <p className="mt-2 text-sm text-gray-800">
                <strong>Emails:</strong> {c.emails.join(", ")}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              <button
  onClick={() =>
    setLastCampaign({
      ...c,
      createdAt: c.createdAt.toDate().toISOString(),
    })
  }
  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
>
  Set as Last Campaign
</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
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
