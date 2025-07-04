'use client';

import { useState } from 'react';

interface AddContactsFormProps {
  EmailsArray: string[]; // comma-separated emails
  listname: string; // required list name
  listdescription?: string; // optional
  onSuccess?: () => void;
}

export default function AddContactsForm({
  EmailsArray,
  listname,
  listdescription = '',
  onSuccess,
}: AddContactsFormProps) {
  const [loading, setLoading] = useState(false);

 const defaultEmails = Array.from(
  new Set(
    EmailsArray
      .map((email) => email.trim().toLowerCase()) // trim and lowercase
      .filter((email) => email !== '')            // remove empty strings
  )
).join(',');

  const handleAddContacts = async () => {
    if (!defaultEmails || !listname) {
      alert('Missing emails or list name.');
      return;
    }

    setLoading(true);

    const body = {
      emailids: defaultEmails,
      listname,
      listdescription,
      signupform: 'private',
      mode: 'newlist',
    };

    

    const res = await fetch('/api/zoho/addContacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert('✅ Contacts added successfully!');
      onSuccess?.(); 
    } else {
      alert('❌ Failed: ' + data.error);
     // console.error('Error Details:', data.details);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <p className="mb-4">List: <strong>{listname}</strong></p>
      <p className="mb-4 text-sm text-gray-700">
        {defaultEmails.split(',').length} emails ready to be added.
      </p>
      <button
        onClick={handleAddContacts}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Adding...' : 'Save As Final List'}
      </button>
    </div>
  );
}
