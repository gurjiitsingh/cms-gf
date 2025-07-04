'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { FiMail, FiMoreVertical, FiTrash2 } from 'react-icons/fi'; // 🎯 icons added here

type EmailList = {
  id: string;
  listName: string;
  emails: string[];
  createdAt: any;
};

export default function SavedEmailLists() {
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    const q = query(collection(db, 'emailLists'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const lists: EmailList[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EmailList, 'id'>),
    }));
    setEmailLists(lists);
    setLoading(false);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedListId((prevId) => (prevId === id ? null : id));
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this list?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'emailLists', id));
      setEmailLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err) {
      console.error('Failed to delete list:', err);
      alert('Failed to delete list.');
    }
  };

  const downloadCSV = (list: EmailList) => {
    const csvHeader = 'Email\n';
    const csvRows = list.emails.map((email) => `${email.toLowerCase()}\n`).join('');
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${list.listName.replace(/[^a-zA-Z0-9]/g, '_') || 'email_list'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#016630] mb-6 flex items-center gap-2">
        <FiMail className="text-[#016630]" size={28} />
        Saved Email Lists
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : emailLists.length === 0 ? (
        <p className="text-gray-500">No email lists found.</p>
      ) : (
        <div className="space-y-4">
          {emailLists.map((list) => (
            <div
              key={list.id}
              onClick={() => toggleExpand(list.id)}
              className="relative bg-white border border-[#016630]/20 shadow-sm hover:shadow-md transition-all rounded-lg p-5 cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <FiMail className="text-[#016630]" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-[#016630]">
                      {list.listName}
                      <span className="text-sm text-gray-600 ml-2">
                        ({list.emails.length} email{list.emails.length !== 1 && 's'})
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleDropdown(list.id)}
                    className="text-gray-500 hover:text-[#016630] p-1"
                  >
                    <FiMoreVertical size={20} />
                  </button>

                  {dropdownOpenId === list.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-10">
                      <button
                        onClick={() => downloadCSV(list)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📥 Download CSV
                      </button>
                      <button
                        onClick={() => handleDelete(list.id)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {expandedListId === list.id && (
                <ul className="list-disc pl-9 mt-3 text-sm text-gray-800">
                  {list.emails.map((email, i) => (
                    <li key={i}>{email}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
