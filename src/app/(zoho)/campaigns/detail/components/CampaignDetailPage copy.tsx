'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CampaignDetailPage() {
  const searchParams = useSearchParams()
  const campaignkey = searchParams.get('campaignkey')

  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!campaignkey) return

    const fetchCampaignDetail = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/zoho/campaign/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignkey }),
        })

        const data = await res.json()

        if (res.ok) {
          setCampaign(data)
        } else {
          setError(data.error || 'Failed to fetch campaign detail')
        }
      } catch (err: any) {
        setError('Network error')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignDetail()
  }, [campaignkey])

  const details = campaign?.['campaign-details']?.[0]
  const lists = campaign?.associated_mailing_lists || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/campaigns/recent-campaigns" className="flex items-center text-orange-600 hover:underline font-medium mr-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Campaigns
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Campaign Details</h1>
      </div>

      {loading && <p className="text-gray-500">Loading campaign details...</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {details && (
        <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-100">
          {/* General Info */}
          <div>
            <h2 className="text-lg font-semibold text-orange-600 mb-2">General Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Name:</span> {details.campaign_name}
              </div>
              <div>
                <span className="font-medium">Status:</span> {campaign.campaign_status}
              </div>
              <div>
                <span className="font-medium">Subject:</span> {details.email_subject}
              </div>
              <div>
                <span className="font-medium">Email From:</span> {details.email_from}
              </div>
              <div>
                <span className="font-medium">Sender Name:</span> {details.sender_name}
              </div>
              <div>
                <span className="font-medium">Created:</span> {details.created_date_string}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {details.updated_date_string}
              </div>
            </div>
          </div>

          {/* Associated Mailing Lists */}
          <div>
            <h2 className="text-lg font-semibold text-orange-600 mb-2">Associated Mailing Lists</h2>
            {lists.length > 0 ? (
              <ul className="divide-y rounded border border-gray-100">
                {lists.map((list: any, idx: number) => (
                  <li key={idx} className="p-3 flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800">{list.listname}</span>
                    <span className="text-gray-500">{list.contactscount} contacts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No associated mailing lists.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
