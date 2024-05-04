// users will join a room and vote their timezone, and the average timezone will be 
// calculated and displayed
// each user can only vote once per room using fingerprintjs
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import getBrowserFingerprint from 'get-browser-fingerprint';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { useState, useEffect, useRef } from 'react'
import moment from 'moment';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');


export default function PollTime() {
  // get query params from url
  const searchParams = useSearchParams();
  const router = useRouter();
  let poll = searchParams.get('poll');
  const [roomInfo, setRoomInfo] = useState({});
  // check socket to see if poll exists
  // if poll exists, show vote component
  // else show create component
  useEffect(() => {
    if (!poll) return;
    socket.emit("checkRoom", poll);
    socket.on("roomExists", (roomInfo) => {
      // console.log('roomInfo', roomInfo);
      // join that room
      socket.emit("joinRoom", poll);
      setRoomInfo(roomInfo);
    });
    socket.on("roomNotFound", () => {
      router.push('/besttime');
    });
  }, [poll]);

  return (
    <>
      <main>
        {poll ? <Vote {...roomInfo} pollId={poll} allVotes={roomInfo.votes} /> :
          <Create />}
      </main>
    </>
  )
}

function Vote({ creatorTz, creatorComfortStart, creatorComfortEnd, preview, roomGoal, pollId, allVotes }) {

  // two branches one to create room and other to join room, if there is a router param then join room
  const router = useRouter();
  const [roomId, setRoomId] = useState(pollId);
  const [fingerprint, setFingerprint] = useState('123');
  const [vote, setVote] = useState('');
  const [votes, setVotes] = useState(allVotes);
  const [averageTimezone, setAverageTimezone] = useState(0);
  const searchParams = useSearchParams()
  const [myVote, setMyVote] = useState(null);
  const [voted, setVoted] = useState(false);
  const [votesArray, setVotesArray] = useState({});


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
    return newDate.getHours();
  }




  useEffect(() => {
    // get fingerprint
    let fingerprint = getBrowserFingerprint();
    setFingerprint(fingerprint);
    // console.log('creatorTz', creatorTz, creatorComfortStart, creatorComfortEnd, preview, roomGoal, pollId, allVotes);
    if(pollId){
      socket.emit("joinRoom", pollId);
      socket.emit("getVotes", pollId);
    }

    if(preview) {
      // no need to join room
      setVoted(true);
      return;
    }

    socket.on("roomJoined", (roomInfo) => {
      // console.log('roomInfo', roomInfo);
      if (roomInfo.voters?.includes(fingerprint)) {
        setVoted(true);
      }
    });
    socket.on("allVotes", (votes) => {
      // console.log('votes', votes);
      setVotesArray(votes);
    });
    socket.on("alreadyVoted", () => {
      // console.log('already voted');
      setVoted(true);
    });

  }, []);



  const voteTimezone = () => {
    // console.log('vote', roomId, myVote, fingerprint);
    socket.emit("vote", { roomId, vote: myVote, fingerprint });
  }


  let myTz = getCurrentTimezone();
  let myHour = getHour(myTz);
  let creatorHour = getHour(creatorTz);
  let creatorMins = Math.abs(creatorTz % 1 * 60);
  let myMins = Math.abs(myTz % 1 * 60);


  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* creator tz will be from normal mode like 12am to 12pm and my tz will be offset difference to creator */}
        {/* have to start from   */}

        <p style={{
          color: '#888',
          fontSize: 16,
          marginTop: 14,
          marginBottom: 14,
          textAlign: 'center'
        }}>
          {roomGoal || 'What is the best time to mint this collection together?'}
        </p>

        <div style={{
          width: '100%',
          border: '1px solid #333',
          color: '#666',
          fontSize: 12,
          borderRadius: '10px 10px 0 0',
          padding: '5px',
        }}>
          My time zone
        </div>
        <div className={styles.timeCtr} onScroll={(e) => {
          //  when i scroll right to end, go to beginning
          // when i scroll left to beginning, go to end
          if ((e.target.scrollLeft + e.target.clientWidth) >= e.target.scrollWidth) {
            e.target.scrollLeft = 0;
          }

        }}
        >
          {Array.from({ length: 24 }).map((_, index) => (
            <div>
              <div className={styles.time} style={{
                borderLeft: (Math.round(creatorHour + index) % 24) == (creatorComfortStart) ? '2px solid green' : '',
                borderRight: (Math.round(creatorHour + index) % 24) == (creatorComfortEnd) ? '2px solid red' : '',
                backgroundColor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? '#111' : 'transparent',
                cursor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? 'pointer' : 'not-allowed',
              }}
                disabled={(Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd}
                key={(index + 10) * 10} >
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
                  {creatorMins != 0 ? creatorMins : ''}min
                </span>
                <span className={styles.vote} style={{
                  visibility: votesArray[Math.round(creatorHour + index) % 24] ? 'visible' : 'hidden'
                }}>
                  {votesArray[Math.round(creatorHour + index) % 24] || '-'} {votesArray[Math.round(creatorHour + index) % 24] > 1 ? 'votes' : 'vote'}
                </span>
              </div>
              <div className={styles.time}
                key={index}
                style={{
                  cursor: (Math.round(creatorHour + index) % 24) >= creatorComfortStart && (Math.round(creatorHour + index) % 24) <= creatorComfortEnd ? 'pointer' : 'not-allowed',
                  background: myVote == Math.round(creatorHour + index) % 24 ? '#333' : 'transparent',
                }}
                onClick={() => {
                  setMyVote(Math.round(creatorHour + index) % 24);
                }}
              >
                <span className={styles.hour}>
                  {Math.round(myHour + index) % 24 < 10 ? '0' + Math.round(myHour + index) % 24 : Math.round(myHour + index) % 24}
                </span>
                <span className={styles.min}>
                  {myMins != 0 ? myMins : ''}min
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          width: '100%',
          border: '1px solid #333',
          color: '#666',
          fontSize: 12,
          borderRadius: '0 0 10px 10px',
          padding: '5px',
        }}>
          Your time zone
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          {!voted && <button onClick={() => { voteTimezone(); setVoted(true) }} style={{ margin: 'auto' }}>Vote</button>}
        </div>
      </div>
    </>

  )
}

function Create() {
  // create poll
  const router = useRouter();
  const [roomGoal, setRoomGoal] = useState('');
  const [startBestTime, setStartBestTime] = useState(0);
  const [endBestTime, setEndBestTime] = useState(12);

  const createRoom = () => {
    socket.emit("createRoom", {
      tz: new Date().getTimezoneOffset() / 60 * -1,
      bestStartTime: parseInt(startBestTime),
      bestEndTime: parseInt(endBestTime),
      goal: roomGoal,
      creatorFingerprint: ''
    });
    socket.on("roomCreated", (roomId) => {
      // redirect to the poll page and refresh
      router.push(`/besttime?poll=${roomId}`);
    });
  }

  return (
    <>
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
              placeholder='0-24'
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 10 }}>
            <span style={{ color: '#999', fontSize: 12 }}>To:</span>
            <input
              style={{ border: 'none', background: '#111', border: '1px solid #333', padding: '5px 10px', borderRadius: 5 }}
              type="number"
              value={endBestTime}
              onChange={(e) => setEndBestTime(e.target.value)}
              placeholder={`0-24`}
            />
          </div>

        </div>
        <button style={{ margin: 'auto', marginTop: '20px' }} onClick={() => createRoom()}>Start Poll</button>
      </div>
      <b>Preview:</b>
      <Vote
        // creatorTz={new Date().getTimezoneOffset() / 60 * -1}
        creatorTz={new Date().getTimezoneOffset() / 60 * -1}
        creatorComfortStart={startBestTime}
        creatorComfortEnd={endBestTime}
        roomGoal={roomGoal}
        preview={true}
      />
    </>
  )
}