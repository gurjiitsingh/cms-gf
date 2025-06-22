'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'

export default function CampaignInfoPage() {
  const router = useRouter()
  const { campaignInfo, setCampaignInfo } = useAppContext()

  const [campaignname, setCampaignName] = useState(campaignInfo?.campaignName || '')
  const [subject, setSubject] = useState(campaignInfo?.campaignSubject || '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!campaignname || !subject) {
      setError('Both fields are required.')
      return
    }

    setCampaignInfo({ campaignName: campaignname, campaignSubject: subject })
    router.push('/create-campaign') // Return to campaign step screen
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Campaign Info</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignname}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}
