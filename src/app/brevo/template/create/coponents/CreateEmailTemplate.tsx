'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function CreateEmailTemplate() {
  const { templateMarketing, setTemplateUrl,campaignInfo } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const campaignName = "tes"//campaignInfo?.campaignName;
 

 const handleSubmit = async () => {
  if (!templateMarketing) {
    alert('No template selected'); 
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('/api/zoho/template/createTemplate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...templateMarketing,      // includes templateId and content
        campaignName,              // ✅ explicitly added
      }),
    });

    if (!res.ok) throw new Error('Failed to save template');

    const { url } = await res.json();
    setTemplateUrl(url);
    router.push('/template/select-for-campaign');
  } catch (error) {
    console.error(error);
    alert('Error saving template');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-4 border rounded space-y-4">
     

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Saving...' : 'Use Template'}
      </button>

      </div>
  );
}
