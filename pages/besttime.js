// users will join a room and vote their timezone, and the average timezone will be 
// calculated and displayed
// each user can only vote once per room using fingerprintjs
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import getBrowserFingerprint from 'get-browser-fingerprint';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import moment from 'moment';


export default function PollTime() {
  // two branches one to create room and other to join room, if there is a router param then join room
  const [roomId, setRoomId] = useState('');
  const [fingerprint, setFingerprint] = useState('');
  const [vote, setVote] = useState('');
  const [votes, setVotes] = useState({});
  const [averageTimezone, setAverageTimezone] = useState(0);
  const searchParams = useSearchParams()

  const getCurrentTimezone = () => {
    return new Date().getTimezoneOffset() / 60 * -1;
  }

  const getAverageTimezone = () => {
    const votesArray = Object.values(votes);
    const total = votesArray.reduce((acc, curr) => acc + curr, 0);
    return total / votesArray.length;
  }

  const getHour = (timezone) => {
    // get the current hour in the timezone
    let date = new Date();
    // set to utc time first
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const utc = date.getTime() + (timezone * 60 * 60 * 1000);
    const newDate = new Date(utc);
    console.log('newDate', newDate, date);
    return newDate.getHours();
  }

  useEffect(() => {
    // getBrowserFingerprint().then((fingerprint) => {
    //   setFingerprint(fingerprint);
    // });
  }, []);


  useEffect(() => {
    if (searchParams.has('roomId')) {
      setRoomId(searchParams.get('roomId'));
    }
  });

  useEffect(() => {
    if (roomId) {
      const socket = io();
      socket.emit("joinRoom", roomId);
      socket.on("roomJoined", () => {
        socket.on("vote", (votes) => {
          setVotes(votes);
          setAverageTimezone(getAverageTimezone());
        });
      });
    }
  }, [roomId]);

  const createRoom = () => {
    const socket = io();
    socket.emit("createRoom");
    socket.on("roomCreated", (roomId) => {
      setRoomId(roomId);
    });
  }

  const voteTimezone = () => {
    const socket = io();
    socket.emit("vote", { roomId, vote: getCurrentTimezone(), fingerprint });
  }

  const bestOverlap = () => {
  }

  let creatorTz = 10;
  let myTz = getCurrentTimezone();
  let creatorComfortStart = 9;
  let creatorComfortEnd = 18;

  let myHour = getHour(myTz);
  let creatorHour = getHour(creatorTz);
  console.log(myHour, creatorHour);
  let creatorMins = Math.abs(creatorTz % 1 * 60);
  let myMins = Math.abs(myTz % 1 * 60);

  let votesArray = {
    9: 1,
    10: 1,
    12: 30,
    13: 1,
  }

  return (
    <Create />
  )
}

function Vote() {

  return (
    <>
      <main>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* creator tz will be from normal mode like 12am to 12pm and my tz will be offset difference to creator */}
          {/* have to start from   */}

          <div className={styles.timeCtr}>
            {Array.from({ length: 24 }).map((_, index) => (
              <div>
                <div className={styles.time} style={{
                  borderRight: (Math.round(creatorHour + index) % 24) == (creatorComfortStart - 1) ? '2px solid green' : '',
                  borderLeft: (Math.round(creatorHour + index) % 24) == (creatorComfortEnd + 1) ? '2px solid red' : '',
                  backgroundColor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? '#111' : 'transparent',
                  cursor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? 'pointer' : 'not-allowed',
                }}
                  disabled={(Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd}
                  key={index} >
                  {/* highest vote */}
                  <span style={{
                    // draw on top right of the div
                    position: 'relative',
                    top: 0,
                    left: 10,
                    padding: '5px',
                    fontSize: '1.5rem',
                    transform: 'translate(20%, -60%)',
                    borderRadius: '5px',
                    color: '#ca8a04',
                    // show only highest vote
                    visibility: Object.values(votesArray).includes(Math.max(...Object.values(votesArray))) && votesArray[Math.round(creatorHour + index) % 24] == Math.max(...Object.values(votesArray)) ? 'visible' : 'hidden',
                  }}>
                    🥇
                  </span>
                  <span className={styles.hour}>
                    {Math.round(creatorHour + index) % 24 < 10 ? '0' + Math.round(creatorHour + index) % 24 : Math.round(creatorHour + index) % 24}
                  </span>
                  <span className={styles.min}>
                    {creatorMins != 0 ? creatorMins : ''}
                  </span>
                  <span className={styles.vote} style={{
                    visibility: votesArray[Math.round(creatorHour + index) % 24] ? 'visible' : 'hidden'
                  }}>
                    {votesArray[Math.round(creatorHour + index) % 24] || '-'}
                  </span>
                </div>
                <div className={styles.time}
                  key={index}
                  style={{
                    cursor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? 'pointer' : 'not-allowed',
                  }}>
                  <span className={styles.hour}>
                    {Math.round(myHour + index) % 24 < 10 ? '0' + Math.round(myHour + index) % 24 : Math.round(myHour + index) % 24}
                  </span>
                  <span className={styles.min}>
                    {myMins != 0 ? myMins : ''}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>
    </>

  )
}

function Create() {
  // create poll
  const [roomGoal, setRoomGoal] = useState('');
  const [startBestTime, setStartBestTime] = useState('');
  const [endBestTime, setEndBestTime] = useState('');

  const createRoom = () => {
    const socket = io();
    socket.emit("createRoom", {
      goal: roomGoal,
      bestStartTime: startBestTime,
      bestEndTime: endBestTime,
      tz: new Date().getTimezoneOffset() / 60 * -1,
    });
    socket.on("roomCreated", (roomId) => {
      setRoomId(roomId);
      router.push(`/besttime?poll=${roomId}`);
    });
  }

  return (
    <>
      <main>
        <h1>Create a poll</h1>
        <p style={{ color: "#888" }} >Find out what is the best time for you and friends to connect online</p>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10, alignContent: 'flex-start', border: '1px solid #333', padding: '10px', borderRadius: 5 }}>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#999', fontSize: 12, marginBottom: 14 }}>Question</span>

            <input
              style={{ border: 'none', background: '#111', border: '1px solid #333', padding: '5px 10px', borderRadius: '5px' }}
              type="text" value={roomGoal} onChange={(e) => setRoomGoal(e.target.value)}
              placeholder='Enter a question like "What is the best time to mint this collection together?"'
            />
          </div>
          <p style={{ color: '#888', fontSize: 14, marginTop: 14, marginBottom: 14 }}>
            In your timezone, what is the best time to start and end the event?
          </p>
          <div style={{ display: 'flex', width: '100%', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 10 }}>
              <span 
              style={{ color: '#999', fontSize: 12 }}>From:</span>
              <input
                style={{ border: 'none', background: '#111', border: '1px solid #333', padding: '5px 10px', borderRadius: '5px' }}
                type="number"
                value={startBestTime}
                onChange={(e) => setStartBestTime(e.target.value)}
                placeholder='Enter a number between 0 and 24'
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 10 }}>
              <span style={{ color: '#999', fontSize: 12 }}>To:</span>
              <input
                style={{ border: 'none', background: '#111', border: '1px solid #333', padding: '5px 10px', borderRadius: 5 }}
                type="number"
                value={endBestTime}
                onChange={(e) => setEndBestTime(e.target.value)}
                placeholder='Enter a number between 0 and 24'
              />
            </div>

          </div>
          <button style={{ margin: 'auto', marginTop: '20px' }} onClick={() => createRoom()}>Start Poll</button>
        </div>
        <p>Preview:</p>
      </main>
    </>
  )
}