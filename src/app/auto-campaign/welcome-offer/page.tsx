'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext'; // adjust path if needed
import EmailListSaver from './components/EmailListSaver';

type User = {
  username?: string;
  email?: string;
  time?: string;
  id: string;
  welcomeEmail?: boolean;
};

function parseGermanDate(dateStr: string): Date | null {
  try {
    return new Intl.DateTimeFormat('de-DE').formatToParts(new Date(dateStr)).length > 0
      ? new Date(dateStr)
      : null;
  } catch {
    const parts = dateStr?.match(/(\d{1,2})\.\s(\w+)\s(\d{4}),\s(\d{1,2}):(\d{2})/);
    if (!parts) return null;
    const [, day, monthName, year, hour, minute] = parts;
    const monthsDE = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ];
    const month = monthsDE.indexOf(monthName);
    if (month === -1) return null;
    return new Date(Number(year), month, Number(day), Number(hour), Number(minute));
  }
}

export default function UsersByMonth() {
  const [users, setUsers] = useState<User[]>([]);
  const [grouped, setGrouped] = useState<{ [month: string]: User[] }>({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [checkAll, setCheckAll] = useState(false);

  const router = useRouter();
  const { setRecipients } = useAppContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'user'));
      const usersData: User[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as User),
        id: doc.id,
      }));
      setUsers(usersData);
      groupByMonth(usersData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const groupByMonth = (users: User[]) => {
    const groupedData: { [month: string]: User[] } = {};
    users.forEach((user) => {
      if (!user.time) return;
      const date = parseGermanDate(user.time);
      if (!date) return;
      const monthKey = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
      if (!groupedData[monthKey]) groupedData[monthKey] = [];
      groupedData[monthKey].push(user);
    });

    setGrouped(groupedData);

    const monthsSorted = Object.keys(groupedData).sort((a, b) => {
      const dateA = new Date(`01 ${a}`);
      const dateB = new Date(`01 ${b}`);
      return dateB.getTime() - dateA.getTime();
    });

    if (monthsSorted.length > 0) setSelectedMonth(monthsSorted[0]);
  };

  const handleCheckboxChange = (email: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails((prev) => [...prev, email]);
    } else {
      setSelectedEmails((prev) => prev.filter((e) => e !== email));
    }
  };

  const handleCheckAll = () => {
    const allEmails = selectedUsers.map((u) => u.email).filter(Boolean) as string[];
    if (checkAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(allEmails);
    }
    setCheckAll(!checkAll);
  };

  const handleSendOfferEmail = () => {
    if (selectedEmails.length === 0) return;
    setRecipients(selectedEmails);
    router.push('/auto-campaign/campaigns');
  };

  const selectedUsers = selectedMonth
    ? [...(grouped[selectedMonth] || [])].sort((a, b) => {
        const dateA = parseGermanDate(a.time || '')?.getTime() || 0;
        const dateB = parseGermanDate(b.time || '')?.getTime() || 0;
        return dateB - dateA;
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">New Users in Month</h1>
        <Link
          href="/auto-campaign/manage-lists"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && Object.keys(grouped).length > 0 && (
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Object.keys(grouped).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}

      {!loading && selectedUsers.length === 0 && <p>No users for this month.</p>}

      {!loading && selectedUsers.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCheckAll}
              className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {checkAll ? 'Uncheck All' : 'Check All'}
            </button>

            {selectedEmails.length > 0 && (
              <button
                onClick={handleSendOfferEmail}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Wellcome Offer
              </button>
            )}
            {/* <EmailListSaver selectedEmails={selectedEmails} /> */}
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full border text-left text-sm">
           <thead className="bg-gray-100 text-gray-700">
  <tr>
    <th className="py-2 px-4 border text-center">✔</th>
    <th className="py-2 px-4 border">#</th>
    <th className="py-2 px-4 border">Name</th>
    <th className="py-2 px-4 border">Email</th>
    <th className="py-2 px-4 border">Time</th>
    <th className="py-2 px-4 border text-center">Welcome Sent</th>
  </tr>
</thead>
              <tbody>
                {selectedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(user.email || '')}
                        onChange={(e) =>
                          handleCheckboxChange(user.email || '', e.target.checked)
                        }
                      />
                    </td>
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">{user.username || '—'}</td>
                    <td className="py-2 px-4 border">{user.email || '—'}</td>
                    <td className="py-2 px-4 border">{user.time || '—'}</td>
                     <td className="py-2 px-4 border text-center">
        {user.welcomeEmail ? '✅' : '—'} {/* ✅ status indicator */}
      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
