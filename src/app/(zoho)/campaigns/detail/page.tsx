import React, { Suspense } from 'react'
import CampaignDetailPage from './components/CampaignDetailPage'

export default function page() {
  return (
   <Suspense>
    <CampaignDetailPage />
   </Suspense>
  )
}
