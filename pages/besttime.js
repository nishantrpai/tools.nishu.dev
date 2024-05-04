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

  let myHour = getHour(myTz);
  let creatorHour = getHour(creatorTz);
  console.log(myHour, creatorHour);
  let creatorMins = Math.abs(creatorTz % 1 * 60);
  let myMins = Math.abs(myTz % 1 * 60);

  return (
    <>
      <main>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* creator tz will be from normal mode like 12am to 12pm and my tz will be offset difference to creator */}
          {/* have to start from   */}
          <label>Australia Time</label>
          <div className={styles.timeCtr}>
            {Array.from({ length: 24 }).map((_, index) => (
              <div className={styles.time} key={index} >
                <span className={styles.hour}>{Math.round(creatorHour + index) % 24 }</span>
                <span className={styles.min}>
                  {creatorMins != 0 ? creatorMins : ''}
                </span>
              </div>
            ))}
          </div>
          <label>India Time</label>
          <div className={styles.timeCtr}>
            {Array.from({ length: 24 }).map((_, index) => (
              <div className={styles.time} key={index} >
                <span className={styles.hour}>
                  {Math.round(myHour + index) % 24 }
                  </span>
                <span className={styles.min}>
                  {myMins != 0 ? myMins : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )

}
