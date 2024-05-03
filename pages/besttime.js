// users will join a room and vote their timezone, and the average timezone will be 
// calculated and displayed
// each user can only vote once per room using fingerprintjs
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import getBrowserFingerprint from 'get-browser-fingerprint';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'


export default function PollTime() {
  // two branches one to create room and other to join room, if there is a router param then join room
  const [roomId, setRoomId] = useState('');
  const [fingerprint, setFingerprint] = useState('');
  const [vote, setVote] = useState('');
  const [votes, setVotes] = useState({});
  const [averageTimezone, setAverageTimezone] = useState(0);
  const searchParams = useSearchParams()

  const getCurrentTimezone = () => {
    return new Date().getTimezoneOffset() / 60;
  }

  const getAverageTimezone = () => {
    const votesArray = Object.values(votes);
    const total = votesArray.reduce((acc, curr) => acc + curr, 0);
    return total / votesArray.length;
  }

  const getHour = (timezone) => {
    return (new Date().getHours() + timezone) % 24;
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

  let creatorTz = 4;
  let myTz = getCurrentTimezone() * -1;

  let creatorHour = getHour(creatorTz);
  let myHour = getHour(myTz);

  return (
    <>
      <main>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* creator tz will be from normal mode like 12am to 12pm and my tz will be offset difference to creator */}
          <div className={styles.timeCtr}>
          {Array.from({ length: 24 }).map((_, index) => (
            <div className={styles.time}  key={index} >
              <div>{Math.round(creatorTz + index) % 24}</div>
            </div>
          ))}
          </div>
          <div className={styles.timeCtr}>
          {Array.from({ length: 24 }).map((_, index) => (
            <div className={styles.time} key={index} style={{
              backgroundColor: (creatorHour === myHour) ? 'red' : 'white',
            }}>
              <div>{(Math.round(myTz + index) + 24) % 24}</div>
            
              <div>{(Math.round(myTz + index) + 24) % 24}</div>
            </div>
          ))}
          </div>




        </div>
      </main>
    </>
  )

}
