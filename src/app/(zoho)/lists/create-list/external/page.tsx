'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddContactsPage() {
  const router = useRouter(); // ⬅ Add router
  const [emailids, setEmailids] = useState('');
  const [listname, setListname] = useState('');
  const [signupform, setSignupform] = useState<'public' | 'private'>('private');
  const [mode, setMode] = useState<'newlist' | 'existinglist'>('newlist');
  const [listdescription, setListdescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContacts = async () => {
    if (!emailids || !listname || !signupform || !mode) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const body = {
      emailids,
      listname,
      signupform,
      mode,
      listdescription,
    };

    try {
      const res = await fetch('/api/zoho/addContacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("✅ Contacts added successfully!");
        console.log("Success Response:", data);
        router.push('/lists/view-lists'); // ⬅ Redirect here
      } else {
        alert("❌ Failed: " + data.error);
        console.error("Error Details:", data.details);
      }
    } catch (error) {
      setLoading(false);
      alert("❌ Unexpected error");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Contacts to Zoho List</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email IDs (comma-separated)</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="test1@example.com,test2@example.com"
          value={emailids}
          onChange={(e) => setEmailids(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">List Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="My Subscriber List"
          value={listname}
          onChange={(e) => setListname(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Signup Form</label>
        <select
          className="w-full p-2 border rounded"
          value={signupform}
          onChange={(e) => setSignupform(e.target.value as 'public' | 'private')}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mode</label>
        <select
          className="w-full p-2 border rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value as 'newlist' | 'existinglist')}
        >
          <option value="newlist">New List</option>
          <option value="existinglist">Existing List</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">List Description</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Describe this list..."
          value={listdescription}
          onChange={(e) => setListdescription(e.target.value)}
        />
      </div>

      <button
        onClick={handleAddContacts}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Contacts"}
      </button>
    </div>
  );
}
