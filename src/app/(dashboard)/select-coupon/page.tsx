import React, { Suspense } from 'react'
import CouponBuilder from './components/CouponBuilder'

export default function page() {
  return (
    <Suspense>
      <CouponBuilder />
    </Suspense>
  )
}
