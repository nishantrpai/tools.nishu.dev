// find love on warpcast, dating app for warpcasters
import Head from 'next/head'
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { FiHeart, FiUser, FiX } from 'react-icons/fi';

export default function LoveCaster() {
  
  const [members, setMembers] = useState([{
    name: 'nishu',
    username: 'nishu',
    bio: 'I am a software engineer',
    about: `ABOUT
- nishu creates various tools and scripts for different purposes.
- nishu enjoys building and sharing projects with the community.
- nishu values feedback and interaction from others on their work.

LIKE
- nishu likes developing tools to enhance user experiences.
- nishu appreciates the support and comments from their audience.
- nishu enjoys exploring new ideas and expanding their skill set.

DISLIKE
- nishu dislikes technical issues like website downtime or missed notifications.
- nishu may find managing multiple projects and maintaining them challenging.
- nishu might struggle with staying organized or keeping up with all the tasks.`,
    img: `https://i.seadn.io/gae/SypPjsAZsAaiNvsh2V7w8M1PXz7o2t0EFNb4Jd04yx5y_rtr7MeA4fFPRlSK-3M9b5Vv7EoF8W7BVHEKZ_NhqQrsBhtTi9hieFk8CXg?w=500&auto=format&`
  }]);

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
          {members.map((member, index) => (
            <div className={styles.tinderCard} id={`tinder-card-${index}`} style={{ opacity: 1 - index * 0.1, zIndex: 10 - index, top: 20 + ((index % 5)* 5), borderColor: `rgba(51,51,51,${(index+1)*0.95})` }}>
              {/* about */}
              <div>
                <h1 className={styles.name}>{member.name}</h1>
                <h2 className={styles.username}>{member.username}</h2>
                <p className={styles.bio}>{member.bio}</p>
                <p className={styles.about}>{member.about}</p>
              </div>
            <div className={styles.swipeMenu}>
              <button className={styles.swipeButton} style={{  color: '#f87171' }} onClick={() => {
                document.getElementById(`tinder-card-${index}`).style.background = '#f87171';
                setTimeout(() => {
                  if(members.length > 0) {
                    setMembers(members.filter((m, i) => i !== index));
                    console.log('swiped left', members.length);
                    document.getElementById(`tinder-card-${index}`).style.background = '#000';
                  }
                }, 500);
                // set current element background to red
              }}>
              <FiX/>
              </button>
              <button className={styles.swipeButton} style={{ color: '#10b981' }} onClick={() => {
                document.getElementById(`tinder-card-${index}`).style.background = '#10b981';
                setTimeout(() => {
                  if(members.length > 0) {
                    document.getElementById(`tinder-card-${index}`).style.background = '#000';
                    setMembers(members.filter((m, i) => i !== index));
                    console.log('swiped right', members.length);
                    // set current element background to green
                  }
                }, 500);
              }}>
              <FiHeart/>
              </button>
            </div>
          </div>

          ))}
          
          {/* <div className={styles.tinderCard} style={{
            top: 5,
            zIndex: 9,
            opacity: 1,
            background: '#333',
            transform: 'perspective(1000px) rotate3d(0, 1, 0, 1deg)',
          }}>

          </div> */}
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