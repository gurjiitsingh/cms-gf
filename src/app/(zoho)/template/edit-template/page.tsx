'use client'
import React, { Suspense } from 'react'
import EditTemplatePage from './components/EditTemplatePage'

export default function page() {
  return (
    <Suspense>
      <EditTemplatePage />
    </Suspense>
  )
}
