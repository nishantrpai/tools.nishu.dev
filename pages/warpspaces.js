import "@farcaster/auth-kit/styles.css";
import styles from "@/styles/Home.module.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { createIcon } from 'opepen-standard';
import { FiMic } from "react-icons/fi";
const socket = io.connect('http://localhost:8080')


const fetchIdenticon = (username) => {
  return(createIcon({
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
  siweUri: "https://localhost:3000",
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
  const [membersSpeaking, setMemberSpeaking] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(null);
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  const handleJoin = (displayName) => {
    socket.emit('joinRoom', { roomId: room, username: displayName });
    setHeading(room);
    socket.emit('joinRoom', { roomId: room, username: 'jack' });
    socket.emit('joinRoom', { roomId: room, username: 'jalil' });
    socket.emit('joinRoom', { roomId: room, username: 'derrick' });
    socket.on('getMembers', (members) => {
      console.log('getMembers');
      setMembers(members);
    });

    socket.emit('getMembers', room);

    socket.on('joinedRoom', (username) => {
      // get all members in the room
      socket.emit('getMembers', room);
    });

  };

  useEffect(() => {
    if(isSpeaking == null) return;
    if(isSpeaking) {
      socket.emit('isSpeaking', {roomId: room, username: displayName});
    } else {
      socket.emit('notSpeaking', {roomId: room, username: displayName});
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
          </div>
          <h2 style={{width: '100%', marginBottom: '20px', fontSize: "3rem"}}>{heading}</h2>
          <div style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            textAlign: "center",
            alignContent: "flex-start",
            border: "1px solid #222",
            padding: "20px",
            height: "600px",
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
            <div style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginTop: "20px",
            }}>
              <button className={isSpeaking ? styles.buttonSpeaking: styles.buttonNotSpeaking}
              onMouseDown={() => setIsSpeaking(true)}
              onMouseUp={() => setIsSpeaking(false)}
              onMouseLeave={() => setIsSpeaking(false)}
              >
              <FiMic/>
              </button>
            
            </div>
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
