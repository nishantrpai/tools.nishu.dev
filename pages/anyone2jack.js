import dynamic from 'next/dynamic'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

// Create a client-side only component
const FaceMorphClient = dynamic(() => import('../components/FaceMorphClient'), {
  ssr: false,
})

// Main page component
export default function FaceMorphPage() {
  return (
    <>
      <Head>
        <title>Replace any face with Jack Butcher's</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Replace any face with Jack Butcher's" />
      </Head>
      <main>
      <h1 className={styles.title}>
          Replace any face with Jack Butcher's
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Replace any face with <a href="https://twitter.com/jackbutcher" target="_blank" rel="noopener noreferrer">@jackbutcher</a>
        </span>

        <FaceMorphClient />
      </main>
    </>
  )
}