// src/app/brevo/campaign/page.tsx
'use client'

import { useState } from 'react'

type CampaignStats = {
  id: number
  name: string
  subject: string
  status: string
  scheduledAt?: string
  sentDate?: string
  statistics?: {
    delivered: number
    uniqueViews: number
    clickers: number
    complaints: number
    hardBounces: number
    softBounces: number
    unsubscriptions: number
  }
}

export default function BrevoCampaignViewer() {
  const [campaignId, setCampaignId] = useState('')
  const [campaign, setCampaign] = useState<CampaignStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaign = async () => {
    if (!campaignId) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/brevo/campaigns/${campaignId}`)
      if (!res.ok) throw new Error('Failed to fetch campaign')

      const data = await res.json()
      setCampaign(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Brevo Campaign Viewer</h1>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          placeholder="Enter Campaign ID"
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <button
          onClick={fetchCampaign}
          disabled={!campaignId || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {campaign && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <p><strong>ID:</strong> {campaign.id}</p>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Subject:</strong> {campaign.subject}</p>
          <p><strong>Status:</strong> {campaign.status}</p>
          {campaign.sentDate && <p><strong>Sent:</strong> {campaign.sentDate}</p>}
          {campaign.scheduledAt && <p><strong>Scheduled:</strong> {campaign.scheduledAt}</p>}

          {campaign.statistics && (
            <div className="mt-4">
              <h2 className="font-semibold text-lg mb-2">Statistics</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>Delivered: {campaign.statistics.delivered}</li>
                <li>Unique Views: {campaign.statistics.uniqueViews}</li>
                <li>Clickers: {campaign.statistics.clickers}</li>
                <li>Unsubscribed: {campaign.statistics.unsubscriptions}</li>
                <li>Complaints: {campaign.statistics.complaints}</li>
                <li>Hard Bounces: {campaign.statistics.hardBounces}</li>
                <li>Soft Bounces: {campaign.statistics.softBounces}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
