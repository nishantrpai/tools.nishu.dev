import "@farcaster/auth-kit/styles.css";
import styles from "@/styles/Home.module.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { createIcon } from 'opepen-standard';
import { FiMic } from "react-icons/fi";
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
  domain: "localhost:3000",
  siweUri: "localhost:3000/warpspaces",
};


export default function Warpspaces() {
  return (
    <AuthKitProvider config={config}>
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
  const [heading, setHeading] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(null);
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    if (!displayName) return;
    if(mediaRecorder) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const tmpRecorder = new MediaRecorder(stream);
      tmpRecorder.ondataavailable = (event) => {
        console.log(event.data);
        // hear the blob as an audio element
        // audio blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(event.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          socket.emit('audio', { roomId: room, username: displayName, audio: base64data });
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
    socket.emit('joinRoom', { roomId: room, username: displayName });
    setHeading(room);
    socket.on('getMembers', (members) => {
      // if members has the current user, set the members
      setMembers([]);
      if (members[displayName])
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
          <p style={{
            marginBottom: "12px",
          }}>
            Hello, {displayName}!
          </p>
          {Object.keys(members).length == 0 ?
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
            </div> :
            <div>
              <button style={{
                padding: "10px",
                height: "max-content"
              }}
                onClick={() => {
                  socket.emit('leftRoom', { roomId: room, username: displayName });
                  setRoom('');
                  setHeading('');
                  setMembers([]);
                }}
              > Leave Room
              </button>
            </div>
          }

          <h2 style={{ width: '100%', marginBottom: '20px', fontSize: "3rem" }}>{heading}</h2>
          <div style={{
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
                <div className={members[member].isSpeaking ? styles.memberiSSpeaking : null}>
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
          </div>
          {/* show microphone panel */}
          {Object.keys(members).length ? <div style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            fontSize: "2rem",
            marginTop: "20px",
          }}>
            <button className={isSpeaking ? styles.buttonSpeaking : styles.buttonNotSpeaking}
              onMouseDown={() => setIsSpeaking(true)}
              onMouseUp={() => setIsSpeaking(false)}
              onMouseLeave={() => setIsSpeaking(false)}
            >
              <FiMic />
            </button>

          </div> :null }
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
