// find love on warpcast, dating app for warpcasters
import Head from 'next/head'
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { FiHeart, FiUser, FiX, FiMail } from 'react-icons/fi';
const socket = io.connect('http://localhost:8080');

export default function LoveCaster() {

  const [myusername, setMyUsername] = useState('nishu');
  const [accounts, setAccounts] = useState([]);
  const [members, setMembers] = useState([]);
  const [preferences, setPreferences] = useState('female');
  const [matches, setMatches] = useState([{
    name: 'nishu',
    username: 'nish',
    image: 'https://i.seadn.io/gae/SypPjsAZsAaiNvsh2V7w8M1PXz7o2t0EFNb4Jd04yx5y_rtr7MeA4fFPRlSK-3M9b5Vv7EoF8W7BVHEKZ_NhqQrsBhtTi9hieFk8CXg?w=500&auto=format&',
    id: '1317',
  },
  {
    name: 'nishu',
    username: 'nish',
    image: 'https://i.seadn.io/gae/SypPjsAZsAaiNvsh2V7w8M1PXz7o2t0EFNb4Jd04yx5y_rtr7MeA4fFPRlSK-3M9b5Vv7EoF8W7BVHEKZ_NhqQrsBhtTi9hieFk8CXg?w=500&auto=format&',
    id: '1317',
  }
  ]);

  const [unRead, setUnRead] = useState(1);

  const [page, setPage] = useState('profiles');

  const formatSummary = (summary) => {
    // summary is a json object with keys about, like, dislike
    if (summary === 'Loading...') return summary
    let formattedSummary = JSON.parse(summary)
    let sections = []
    for (let key in formattedSummary) {
      let elem =
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
          <h4>{key.toUpperCase()}</h4>
          <ul style={{ listStyle: 'none' }}>
            {formattedSummary[key].map((item, index) => <li style={{ color: '#ccc', marginBottom: '5px' }} key={index}>- {item.toLowerCase()}</li>)}
          </ul>
        </div>
      sections.push(elem)
    }
    return sections
  }

  const summarize = (casts, username) => {
    return new Promise((resolve, reject) => {
      let prompt = `Given the tweets of ${username}: ${casts.join(' ')}, summarize what ${username} does and what they like/dislike. 
    Tips for summarizing: 0. respond in json and the keys should be lower case 
    1. Keep 3 sections of concise information, first is "about", "like" and third is "dislike". 
    2. Don't summarize what is obvious, read between the lines and see the repeating patterns. 
    3. Avoid recency bias. 
    4. Replace any mention of twitter with farcaster or tweets with posts.  
    5. No quotes. 
    6. Speak in third person.
    7. Don't repeat the name, just share the information.
    8. Each point will be value in array.`
      fetch(`/api/gpt?prompt`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          resolve(data.response);
        })
    });
  }


  const fetchTweets = (username) => {
    return new Promise((resolve, reject) => {
      fetch(`https://searchcaster.xyz/api/profiles?username=${username}`)
        .then(res => res.json())
        .then(data => {
          let fid = data[0].body.id
          let profile = data[0].body
          let url = encodeURIComponent(`https://client.warpcast.com/v2/casts?fid=${fid}&limit=30`)

          fetch(`https://cors-proxy-production-a6e6.up.railway.app/?url=${url}`).then(res => res.json()).then(data => {
            let casts = data.result.casts
            casts = casts.filter(cast => cast.author.fid === fid)
            casts = casts.map(cast => cast.text)
            casts = casts.filter(cast => cast.length > 0)
            resolve({casts, profile})
          })
        })
    });
  }


  const fetchMemberData = async (username) => {
    return new Promise((resolve, reject) => {
      fetchTweets(username).then(async ({casts, profile}) => {
        console.log('casts', casts.length);
        let summary = await summarize(casts, username);
        resolve({
          name:  profile.displayName,
          username: profile.username,
          img: profile.avatarUrl,
          bio: profile.bio,
          summary: summary,
        });
      });
    });

    // return {
    //   name: 'nishu',
    //   username: 'nish',
    //   img: 'https://i.seadn.io/gae/SypPjsAZsAaiNvsh2V7w8M1PXz7o2t0EFNb4Jd04yx5y_rtr7MeA4fFPRlSK-3M9b5Vv7EoF8W7BVHEKZ_NhqQrsBhtTi9hieFk8CXg?w=500&auto=format&',
    //   bio: 'I am a software engineer',
    //   summary: 'Loading...',
    // }
  }

  useEffect(() => {
    // for each member we have to add bio, username image and about if it doesn't exist
    accounts.forEach(account => {
      if (!members.find(member => member.username === account.username)) {
        console.log('adding member', account.username, members);
        fetchMemberData(account.username).then(data => {
          setMembers(prev => [...prev, data]);
        });
      }
    });
  }, [accounts]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to socket');
    });
    socket.emit('joinRoom', { preference: preferences, gender: 'female', username: myusername });
    socket.on('getAccounts', (accounts) => {
      console.log('accounts', accounts);
      setAccounts(accounts);
    });
  }, [preferences]);

  const Profiles = () => {
    return (
      <>
        {/* radio button of male or female */}
        {/* <select value={preferences} onChange={(e) => {
          setPreferences(e.target.value);
        }}>
          <option value={'male'}>male</option>
          <option value={'female'}>female</option>
        </select> */}
        <div style={{
          display: 'flex',
          width: 'max-content',
          height: 'max-content',
          position: 'relative',
          justifyContent: 'center',
          paddingTop: 100,
          zoom: 1.25,
        }}>
          {members.length > 0 ? members.map((member, index) => (
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
                <p className={styles.about}>{formatSummary(member.summary)}</p>
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

          )) : null}

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
                color: '#10b981',
                margin: 'auto'
              }}
                onClick={() => {
                  // window open new tab https://warpcast.com/~/inbox/${match.id}-${myId}
                  window.open(`https://warpcast.com/${match.username}`, '_blank');
                }}
              >
                <FiMail />
              </button>
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
