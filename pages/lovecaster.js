// find love on warpcast, dating app for warpcasters
import Head from 'next/head'
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { FiHeart, FiUser } from 'react-icons/fi';

export default function LoveCaster() {
  return (
    <>
      <Head>
        <title>LoveCaster</title>
        <meta name="description" content="Find love on Warpcast, the dating app for warpcasters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ borderRight: '1px solid #333', borderLeft: '1px solid #333', position: 'relative' }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          height: 'max-content',
          position: 'relative',
          justifyContent: 'center',
          zoom: 1.25,
        }}>
          <div className={styles.tinderCard} style={{ opacity: 1}}>

          </div>
          <div className={styles.tinderCard} style={{
            top: 5,
            zIndex: 9,
            opacity: 1,
            transform: 'perspective(1000px) rotate3d(0, 1, 0, 1deg)',
          }}>

          </div>
        </div>
        {/* at the bottom of main */}
        <div style={{
          position: 'absolute',
          height: 50,
          bottom: 10,
          width: '100%',
          display: 'flex',
        }}>
          <button style={{
            flex: 1,
            background: 'none',
          }}>
            <FiUser />
          </button>
          <button style={{
            flex: 1,
            background: 'none',
            borderLeft: '1px solid #333 !important',
            borderRadius: 0
          }}>
            <FiHeart />
            <span style={{
              // top right of heart icon we'll add a badge with the number of matches
              position: 'absolute',
              top: 0,
              margin: 'auto',
              background: '#f87171',
              color: '#991b1b',
              borderRadius: '50%',
              padding: '5px 8px',
              fontSize: 10,
              fontWeight: 'bold',
            }}>
              1
            </span>
          </button>
        </div>
      </main>
    </>
  )
}