// check the speed of any website
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import {FiSearch} from 'react-icons/fi'

const WebsiteSpeed = () => {
  const [url, setUrl] = useState('');
  const [speed, setSpeed] = useState('');
  const [speedType, setSpeedType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const checkSpeed = async () => {
    if (url) {
      // fetch the breakdown
      setLoading(true);
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`)
      .then(res => res.json())
      .then(data => {
        // first-contentful-paint numericValue in
        setSpeed(data.lighthouseResult.audits['first-contentful-paint'].displayValue);
        // FIRST_CONTENTFUL_PAINT_MS category
        setSpeedType(data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category);
        setLoading(false);
      });
    }
  }

  return (
    <>
      <Head>
        <title>Check website speed</title>
        <meta name="description" content="Check the speed of any website." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>
        <h1>Check website speed</h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.8rem'
        }}>Enter the website URL to check its speed</span>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.search} onChange={(e) => {
            setUrl(e.target.value)
          }} placeholder="https://example.com"></input>
          <button style={{
            backgroundColor: '#333',
          }} onClick={() => {
            setSpeed('');
            setSpeedType('');
            checkSpeed();
          }}
          >Check speed</button>
        </div>

        {loading && <div>Loading...</div>}
        {/* show speed in milliseconds */}
        {speed && <div>Speed: <b>{speed.replace(' ','')}</b></div>}
        {speedType && <div>Your website is <b>{speedType}</b></div>}
      </main>
    </>
  )
}

export default WebsiteSpeed