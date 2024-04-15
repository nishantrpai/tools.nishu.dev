// multiple people can draw on the same canvas in real-time, will login with metamask to join the room
import Head from 'next/head'
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import io from 'socket.io-client';
const socket = io.connect('https://warpcanvasserver-production.up.railway.app');

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
  siweUri: "localhost:3000/warpcanvas",
};


export default function WarpCanvas() {
  return (
    <AuthKitProvider config={config}>
      <Head>
        <title>WarpCanvas</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="WarpCanvas: Draw with your friends in real-time." />
      </Head>
      <div style={{ position: "fixed", top: "12px", right: "12px" }}>
        <SignInButton />
      </div>
      <Draw />
    </AuthKitProvider>
  );
}



function Draw() {
  const [drawing, setDrawing] = useState(false)
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [copy, setCopy] = useState(false)
  const [fromX, setFromX] = useState(0)
  const [fromY, setFromY] = useState(0)
  const [room, setRoom] = useState('123')
  const [paths, setPaths] = useState([])
  const [members, setMembers] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  useEffect(() => {
    if(!isAuthenticated) return;

    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    socket.emit('joinRoom', {roomId: room, username: displayName});
    setCanvas(canvas)
    setContext(context)

    socket.on('getStrokens', (strokes) => {
      console.log('strokes', strokes);
      strokes['data'].forEach((stroke) => {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        context.moveTo(stroke.from.x, stroke.from.y);
        stroke.paths.forEach((path) => {
          context.stroke();
          context.lineTo(path.posX, path.posY)
        });
      })
    });

    socket.emit('getStrokes', room);

    socket.on('isDrawing', (users) => {
      setAllMembers(Object.keys(users))
      setMembers(Object.keys(users).filter((user) => users[user].isDrawing))
    });

    socket.on('drawing', (strokes) => {
      console.log('strokes', strokes)
      // each stroke is in the currentPath format from, paths
      strokes['data'].forEach((stroke) => {
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        context.moveTo(stroke.from.x, stroke.from.y);
        stroke.paths.forEach((path) => {
          context.stroke();
          context.lineTo(path.posX, path.posY)
        });
      })
    });
  }, [displayName])



  const startDrawing = (event) => {
    setDrawing(true);
    socket.emit('isDrawing', { roomId: room, username: displayName });
    console.log('startDrawing')
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    // Check if it's a touch event
    const isTouchEvent = event.touches && event.touches.length > 0;
    console.log('isTouchEvent', isTouchEvent)

    // Get the correct position depending on the event type
    const posX = isTouchEvent ? event.touches[0].clientX : event.nativeEvent.offsetX;
    const posY = isTouchEvent ? event.touches[0].clientY : event.nativeEvent.offsetY;

    // Adjust for canvas position if it's a touch event
    if (isTouchEvent) {
      const rect = event.target.getBoundingClientRect();
      console.log('rect', rect)
      context.moveTo(posX - rect.left, posY - rect.top);
    } else {
      context.moveTo(posX, posY);
    }
    console.log('from', posX, posY)
    setFromX(posX)
    setFromY(posY)
  }

  const stopDrawing = () => {
    setDrawing(false)
    // emit event here
    console.log([
      {
        from: { x: fromX, y: fromY },
        paths: paths
      }
    ])
    socket.emit('notDrawing', { roomId: room, username: displayName });
    socket.emit('drawing', { roomId: room, data: { from: { x: fromX, y: fromY }, paths: paths }, username: displayName });
    setPaths([])
    setFromX(0)
    setFromY(0)
  }

  const restCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const draw = (event) => {
    if (!drawing) return
    setPaths([...paths, { posX: event.nativeEvent.offsetX, posY: event.nativeEvent.offsetY }])
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    context.stroke()
  }

  const copyToClipboard = () => {
    const dataURL = canvas.toDataURL('image/png')
    const img = new Image()
    img.src = dataURL
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      canvas.style.background = 'white'
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]).then(() => {
          setCopy(true)
          setTimeout(() => {
            setCopy(false)
          }, 3000)
        })
      })
    }
  }

  return (
    <>
      {isAuthenticated ?
        (<div className={styles.container}>
          <Head>
            <title>Multi Draw</title>
            <meta name="description" content="Simple tool for multi-user sketching and copying that image to clipboard" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <a href='/' className={styles.home}>🏠</a>
            <h1 className={styles.title}>
              Multi Draw
            </h1>
            <span style={{
              width: '100%',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px'
            }}>
              Simple tool for multi-user sketching and copying that image to clipboard
            </span>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px'
                }}
              ></input>
              <button onClick={() => {
                // clear canvas 
                context.clearRect(0, 0, canvas.width, canvas.height)
                setPaths([])
                setFromX(0)
                setFromY(0)
                socket.emit('joinRoom', {roomId: room, username: displayName});
                socket.emit('getStrokes', room);
              }}>Join Room</button>
            </div>
            <canvas
              id="canvas"
              width="800"
              height="600"
              style={{
                border: '1px solid white',
                background: 'white',
                cursor: "url('/pointer.png'), auto"
              }}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
            ></canvas>
            {/* render users who are drawing */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start !important',
              textAlign: 'left',
              width: '100%',
            }}>
              <h2 style={{
                textAlign: 'left',
                width: '100%'
              }}>Currently Drawing</h2>
              {members.map((member, index) => (
                <span style={{color: '#888', fontWeight: '100'}}>{member} is drawing...</span>
              ))}
            </div>
            <hr />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start !important',
              textAlign: 'left',
              width: '100%',
            }}>
              <h2 style={{
                textAlign: 'left',
                width: '100%'
              }}>Everyone in the room</h2>
              {allMembers.map((member, index) => (
                <span style={{color: '#888', fontWeight: '100'}}>{member}</span>
              ))}
            </div>
            <button onClick={restCanvas}>Reset</button>
            <button onClick={copyToClipboard}>Copy to clipboard</button>
            {/* add a mint button so people can mint the image to zora */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => {
                // compress the image to 200x200
                let dataURL = canvas.toDataURL('image/png')
                const img = new Image()
                img.src = dataURL
                img.onload = () => {
                  const canvas = document.createElement('canvas')
                  const context = canvas.getContext('2d')
                  canvas.width = 400
                  canvas.height = 300
                  context.drawImage(img, 0, 0, 400, 300)
                  dataURL = canvas.toDataURL('image/png')
                  window.open(`https://zora.co/create/single-edition?image=${encodeURIComponent(dataURL)}`);
                }

                // open in new tab
              }}>
              <img style={{
                width: '20px',
                height: '20px',
                marginRight: '10px'

              }} src="/zora.png" id="zora"></img>
              Mint</button>
            {copy && <p>Copied to clipboard</p>}
          </main>
        </div>) : (<div>Sign in to draw</div>

        )}
    </>
  )
}
