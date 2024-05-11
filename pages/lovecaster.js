// find love on warpcast, dating app for warpcasters
import Head from 'next/head'
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { FiHeart, FiUser, FiX } from 'react-icons/fi';

export default function LoveCaster() {

  const [myId, setMyId] = useState('5260');
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
  const [matches, setMatches] = useState([{
    name: 'nishu',
    username: 'nish',
    image: 'https://i.seadn.io/gae/SypPjsAZsAaiNvsh2V7w8M1PXz7o2t0EFNb4Jd04yx5y_rtr7MeA4fFPRlSK-3M9b5Vv7EoF8W7BVHEKZ_NhqQrsBhtTi9hieFk8CXg?w=500&auto=format&',
    id: '1317',
  }]);

  const [unRead, setUnRead] = useState(0);

  const [page, setPage] = useState('profiles');

  const Profiles = () => {
    return (
      <>
        <div style={{
          display: 'flex',
          width: 'max-content',
          height: 'max-content',
          position: 'relative',
          justifyContent: 'center',
          paddingTop: 100,
          zoom: 1.25,
        }}>
          {members.map((member, index) => (
            <div className={styles.tinderCard} id={`tinder-card-${index}`} style={{ opacity: 1 - index * 0.1, zIndex: 10 - index, top: 70 + ((index % 5) * 5), borderColor: `rgba(51,51,51,${(index + 1) * 0.95})` }}>
              {/* about */}
              <div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <img src={member.img} style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #333' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: '100' }}>
                    <span className={styles.name}>{member.name}</span>
                    <span className={styles.username}>@{member.username}</span>
                    <p className={styles.bio}>{member.bio}</p>
                  </div>
                </div>
                <p className={styles.about}>{member.about}</p>
              </div>
              <div className={styles.swipeMenu}>
                <button className={styles.swipeButton} style={{ color: '#f87171' }} onClick={() => {
                  document.getElementById(`tinder-card-${index}`).style.background = '#f87171';
                  setTimeout(() => {
                    if (members.length > 0) {
                      setMembers(members.filter((m, i) => i !== index));
                      console.log('swiped left', members.length);
                      document.getElementById(`tinder-card-${index}`).style.background = '#000';
                    }
                  }, 500);
                  // set current element background to red
                }}>
                  <FiX />
                </button>
                <button className={styles.swipeButton} style={{ color: '#10b981' }} onClick={() => {
                  document.getElementById(`tinder-card-${index}`).style.background = '#10b981';
                  setTimeout(() => {
                    if (members.length > 0) {
                      document.getElementById(`tinder-card-${index}`).style.background = '#000';
                      setMembers(members.filter((m, i) => i !== index));
                      console.log('swiped right', members.length);
                      // set current element background to green
                    }
                  }, 500);
                }}>
                  <FiHeart />
                </button>
              </div>
            </div>

          ))}

        </div>
        {/* at the bottom of main */}
      </>
    )
  }

  const Match = () => {
    return (
      <>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: '100%'
        }}>
          {matches.map((match, index) => (
            <div style={{
              display: 'flex',
              gap: 20,
              padding: 20,
              border: '1px solid #333',
              borderRadius: 10,
              position: 'relative',
            }}>
              <div style={{
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'flex-start',
                gap: 20,
                width: '100%',
              }}>
                <div style={{ display: 'flex', flexBasis: '90%', gap: 20 }}>
                  <img src={match.image} style={{ width: 50, height: 50, borderRadius: '50%', border: '1px solid #333' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', fontWeight: '100', gap: 5, alignItems: 'center' }}>
                    <span className={styles.name}>{match.name}</span>
                    <span className={styles.username}>@{match.username}</span>
                  </div>
                </div>
              </div>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                margin: 'auto'
              }} onClick={() => {
                setMatches(matches.filter((m, i) => i !== index));
              }}>
                <FiX />
              </button>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>LoveCaster</title>
        <meta name="description" content="Find love on Warpcast, the dating app for warpcasters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ borderRight: '1px solid #333', borderLeft: '1px solid #333', position: 'relative' }}>
        {page === 'profiles' && <Profiles />}
        {page === 'matches' && <Match />}
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
          }}
            onClick={() => setPage('profiles')}
          >
            <FiUser />
          </button>
          <button style={{
            flex: 1,
            background: 'none',
            borderLeft: '1px solid #333 !important',
            borderRadius: 0
          }}
            onClick={() => setPage('matches')}
          >
            <FiHeart />
            {unRead > 0 && <span style={{
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
              transition: 'all 0.5s',
            }}>
              1
            </span>}
          </button>
        </div>

      </main>
    </>
  )
}
