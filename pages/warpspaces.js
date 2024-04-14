import "@farcaster/auth-kit/styles.css";
import styles from "@/styles/Home.module.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { createIcon } from 'opepen-standard';
import { FiLogOut, FiMic } from "react-icons/fi";
import Head from 'next/head';
const socket = io.connect('https://voiceserver-production.up.railway.app')


const fetchIdenticon = (username) => {
  return (createIcon({
    seed: username,
    size: 200,
  })).toDataURL();
}


const config = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: "tools.nishu.dev",
  siweUri: "localhost:3000/warpspaces",
};


export default function Warpspaces() {
  return (
    <AuthKitProvider config={config}>
      <Head>
        <title>Warpspaces</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Warpspaces: Twitter Spaces but on Farcaster" />
      </Head>
      <main>
        <div style={{ position: "fixed", top: "12px", right: "12px" }}>
          <SignInButton />
        </div>
        <Profile />
      </main>
    </AuthKitProvider>
  );
}

function Profile() {
  const [room, setRoom] = useState('');
  const [members, setMembers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [heading, setHeading] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(null);
  const [audio, setAudio] = useState(null);
  const [displayMode, setDisplayMode] = useState('join');
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const sendAudio = (audio) => {
    socket.emit('audio', { roomId: room, username: displayName, audio });
  }

  useEffect(() => {
    if (displayMode == 'spaces') {
      setMembers([]);
      socket.emit('fetchRooms');
      socket.on('rooms', (rooms) => {
        console.log('all rooms', rooms);
        setRooms(rooms);
      });
    }
    if (displayMode == 'join') {
      setRooms([]);
      socket.emit('getMembers', room);
    }

  }, [displayMode]);

  useEffect(() => {
    if (!audio) return;
    sendAudio(audio);
  }, [audio]);

  useEffect(() => {
    if (!displayName) return;
    if (mediaRecorder) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const tmpRecorder = new MediaRecorder(stream);
      tmpRecorder.ondataavailable = (event) => {
        // hear the blob as an audio element
        // audio blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(event.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          setAudio(base64data);
        }
      };
      tmpRecorder.onstart = () => {
        console.log('recorder started');
      };
      tmpRecorder.onstop = () => {
        console.log('recorder stopped');
      };
      setMediaRecorder(tmpRecorder);
    });
  }, [displayName, room]);

  const handleJoin = (displayName) => {
    if(!room) return;
    socket.emit('joinRoom', { roomId: room, username: displayName });
    setHeading(room);
    socket.on('getMembers', (members) => {
      // if members has the current user, set the members
      if (!members) return;
      setMembers(members);
    });

    socket.emit('getMembers', room);

    socket.on('joinedRoom', (username) => {
      // get all members in the room
      socket.emit('getMembers', room);
    });

    socket.on('audio', ({ username, audio, roomId }) => {
      console.log('audio received');
      // play the audio, if it's not from the current user
      if (username === displayName) return;
      const audioElement = new Audio(audio);
      audioElement.play();
    });

  };

  useEffect(() => {
    window.onbeforeunload = () => {
      socket.emit('leftRoom', { roomId: room, username: displayName });
    }
  }, [])


  useEffect(() => {
    if (isSpeaking == null) return;
    if (isSpeaking) {
      mediaRecorder.start();
      socket.emit('isSpeaking', { roomId: room, username: displayName });
    } else {
      mediaRecorder.stop();
      socket.emit('notSpeaking', { roomId: room, username: displayName });
    }
  }, [isSpeaking]);

  return (
    <>

      {isAuthenticated ? (
        <div style={{
          width: '100%'
        }}>
          <h1 style={{
            fontSize: "2rem",
            marginBottom: "20px",
          }}>Warpspaces</h1>
          {!heading ?
            <div style={{
              display: "flex",
              gap: "12px",
            }}>

              <input
                type="text"
                placeholder="Which room do you want to join?"
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  width: "100%",
                  marginBottom: "12px",
                  outline: "none",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "1rem",
                  backgroundColor: "#222",
                }}
                onChange={(e) => setRoom(e.target.value)} />
              <button style={{
                padding: "10px",
                height: "max-content"
              }}
                onClick={() => handleJoin(displayName)}
              >
                Join
              </button>
            </div> : null
          }

          {heading && <h2 style={{ width: '100%', marginBottom: '20px', marginTop: "20px", fontSize: "2rem" }}>🎧 {heading}</h2>}
          <div style={{
            display: "flex",
            width: "100%",
            flex: "1",
            marginBottom: "20px",
            marginTop: "20px",
          }}>
            <button style={{
              width: "100%",
              backgroundColor: "#000",
              opacity: `${displayMode === 'join' ? 1 : 0.5}`,
            }}
              onClick={() => { setDisplayMode('join') }}
            >
              Join Space</button>
            <button style={{
              width: "100%",
              backgroundColor: "#000",
              opacity: `${displayMode === 'spaces' ? 1 : 0.5}`,
            }}
              onClick={() => { setDisplayMode('spaces') }}
            >
              Spaces</button>
          </div>

          {displayMode == 'join' ? <div style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            textAlign: "center",
            alignContent: "flex-start",
            border: "1px solid #111",
            borderRadius: "10px",
            padding: "20px 5px",
            height: "500px",
            overflowY: "auto",
          }}>
            {Object.keys(members).map((member, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignContent: "center",
              }}>
                <div
                  className={members[member].isSpeaking ? styles.memberiSSpeaking : null}>
                  <img style={{
                    width: "50px",
                    height: "50px",
                    margin: "auto",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                    src={fetchIdenticon(member)}
                  >
                  </img>
                </div>
                <span style={{
                  color: "#ccc",
                  fontSize: "12px",
                  fontWeight: "100",
                }}>{member}</span>
              </div>
            ))}
          </div> : null}

          {displayMode == 'spaces' ?
            <div style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #111",
              borderRadius: "10px",
              padding: "20px 5px",
              height: "500px",
            }}>
              {rooms.map((room, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignContent: "center",
                  borderBottom: "1px solid #111",
                  padding: "10px",
                  justifyContent: "space-between",
                }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <span style={{
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: "100",
                    }}>{room.room}</span>
                    <span style={{
                      color: "#ccc",
                      fontSize: "12px",
                      fontWeight: "100",
                    }}>{room.members} members</span>
                  </div>
                  {<button style={{
                    padding: "10px",
                    height: "max-content"
                  }}
                    onClick={() => {
                      setRoom(room.room);
                      setHeading(room.room);
                      setRooms([]);
                      setDisplayMode('join');
                      handleJoin(displayName);
                    }}
                  >
                    Join
                  </button>}
                </div>
              ))}
            </div> : null
          }

          {/* show microphone panel */}

          {Object.keys(members).length ? <div style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "space-around",
            fontSize: "2rem",
            marginTop: "20px",
          }}>
            {heading ? <button className={isSpeaking ? styles.buttonSpeaking : styles.buttonNotSpeaking}
              onMouseDown={() => setIsSpeaking(true)}
              onMouseUp={() => setIsSpeaking(false)}
              onMouseLeave={() => setIsSpeaking(false)}
            >
              <FiMic />
            </button> : null}


            <button className={styles.buttonNotSpeaking}
              onClick={() => {
                socket.emit('leftRoom', { roomId: room, username: displayName });
                setRoom('');
                setHeading('');
                setMembers([]);
              }}
            > <FiLogOut />
            </button>

          </div> : null}
        </div>
      ) : (
        <p>
          Click the "Sign in with Farcaster" button above, then scan the QR code
          to sign in.
        </p>
      )}

    </>
  );
}
