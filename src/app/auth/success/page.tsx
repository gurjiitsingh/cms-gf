'use client';

import React, { Suspense } from 'react'
import AuthSuccessPage from './components/AuthSuccessPage';

export default function page() {
  return (
   <Suspense>
    <AuthSuccessPage />
   </Suspense>
  )
}
