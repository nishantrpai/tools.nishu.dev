import dynamic from 'next/dynamic'
import { useState } from 'react'

// Create a client-side only component
const FaceMorphClient = dynamic(() => import('../components/FaceMorphClient'), {
  ssr: false,
})

// Main page component
export default function FaceMorphPage() {
  return (
    <div className="container">
      <FaceMorphClient />
    </div>
  )
}