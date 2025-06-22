'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'

export default function CampaignInfoForm() {
  const { campaignInfo, setCampaignInfo } = useAppContext()

  const [campaignname, setCampaignName] = useState(campaignInfo?.campaignName || '')
  const [subject, setSubject] = useState(campaignInfo?.campaignSubject || '')

  useEffect(() => {
    setCampaignInfo({ campaignName: campaignname, campaignSubject: subject })
  }, [campaignname, subject])

  return (
    <div className="border-l-4 border-orange-500 pl-4">
      <h2 className="font-semibold text-gray-800 mb-2">Step 1: Campaign Info</h2>
      <input
        name="campaignname"
        type="text"
        placeholder="Campaign Name"
        value={campaignname}
        onChange={(e) => setCampaignName(e.target.value)}
        className="w-full p-2 border rounded text-sm mb-3"
      />
      <input
        name="subject"
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded text-sm"
      />
    </div>
  )
}
