'use client';

import React, { Suspense } from 'react'
import SendCampaignPage from './components/SendCampaignPage';

export default function page() {
  return (
   <Suspense> <SendCampaignPage /></Suspense>
  )
}
