// simple tool for sketching and copying that image to clipboard
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiPlay, FiStopCircle, FiPause, FiRefreshCcw, FiCopy } from 'react-icons/fi'
import { RxReset } from 'react-icons/rx'
import html2canvas from 'html2canvas'

export default function Draw() {
  const [drawing, setDrawing] = useState(false)
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [copy, setCopy] = useState(false)
  const [timer, setTimer] = useState(null)
  const [timerText, setTimerText] = useState('00:00')
  const [timeFrames, setTimeFrames] = useState(['00:12', '01:00', '10:00']) // 12 seconds, 1 minute, 10 minutes
  const [frames, setFrames] = useState([null, null, null])
  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setContext(context)
  }, [])

  const startDrawing = (event) => {
    setDrawing(true);
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
  }

  const stopDrawing = () => {
    setDrawing(false)
  }

  const restCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const draw = (event) => {
    if (!drawing) return
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

  const copyFrames = () => {
  }

  const captureCurrentCanvas = (index) => {
    // capture canvas and send as image
    console.log('captureCurrentCanvas')
    let canvas = document.getElementById('canvas')
    let dataURL = canvas.toDataURL('image/png')
    // get frame 0 width and height, crop the image from the center to that width and height
    const img = new Image()
    img.src = dataURL
    img.onload = () => {
      // get the width and height of the frame
      const frame = document.getElementById('frame0')
      const width = frame.width
      const height = frame.height
      // create a canvas, copy the image to the canvas, crop to frame width and height
      const scaleFactor = img.width / width
      const scaledHeight = img.height / scaleFactor
      const center = (img.height - scaledHeight) / 2

      const canvas2 = document.createElement('canvas')
      const context = canvas2.getContext('2d')
      canvas2.width = width
      canvas2.height = height
      context.drawImage(img, center, 0, width, height, 0, 0, width, height)
      let dataURLtmp = canvas2.toDataURL('image/png')
      console.log('dataURLtmp', dataURLtmp)
      // replace null with the image
      let tmpFrames = frames
      tmpFrames[index] = dataURLtmp
      setFrames(tmpFrames)
      console.log('frames', frames)
    }
  }

  const parseTimeFrames = (timeFrames) => {
    let times = []
    for (let i = 0; i < timeFrames.length; i++) {
      let time = timeFrames[i].split(':')
      let minutes = parseInt(time[0])
      let seconds = parseInt(time[1])
      // if time is 01:00 for example, we need to send 00:60
      if(seconds == 0) {
        seconds = 60
        if(minutes > 0) {
          minutes--
        }
      }
      times.push({ minutes, seconds })
    }
    return times
  }

  return (
    <>
      <Head>
        <title>Draw</title>
        <meta name="description" content="Simple tool for sketching and copying that image to clipboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ maxWidth: 'max-content' }}>
        <a href='/' className={styles.home}>🏠</a>
        <h1 className={styles.title}>
          Chrono Canvas
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          Simple tool for sketching and capturing frames of it to showcase
        </span>
        <canvas
          id="canvas"
          width="800"
          height="600"
          style={{ border: '1px solid white', background: 'white', borderRadius: '0 20px 20px 20px' }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
        ></canvas>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          marginTop: 20
        }}>
          <button style={{
            borderRadius: '0 10px 10px 10px',
            padding: '10px 20px',
            paddingTop: '12px'
          }}
            title="Start Recording"
            onClick={() => {
              if (timer == null) {
                let seconds = 0
                let minutes = 0
                setTimer(setInterval(() => {
                  seconds++
                  // at 12 seconds, 1 minute and 10 minutes we need to capture each frame and set as source
                  let times = parseTimeFrames(timeFrames)
                  for (let i = 0; i < times.length; i++) {
                    if (minutes == times[i].minutes && seconds == times[i].seconds) {
                      captureCurrentCanvas(i)
                    }
                  }

                  if (seconds == 60) {
                    seconds = 0
                    minutes++
                  }
                  setTimerText(`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
                }, 1000))
              } else {
                clearInterval(timer)
                setTimer(null)
              }
            }}
          >
            {timer == null ? <FiPlay /> : <FiPause />}
          </button>

          <button onClick={() => {
            // stop timer
            clearInterval(timer)
            setTimer(null)
            setTimerText('00:00')
            restCanvas()
          }} style={{
            borderRadius: '0 10px 10px 10px',
            padding: '10px 20px',
            paddingTop: '12px'
          }}
            title="Reset"
          >
            <RxReset />
          </button>
        </div>
        {/* preview */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: '100%',
          textAlign: 'center',
          padding: '10px',
          marginTop: 20,
        }}>
          <h2>Preview</h2>
          {frames.length}
          <span style={{ color: '#eee', fontSize: 20 }}>{timerText}</span>
          <div style={{
            display: 'flex',
            gap: 20,
            flexDirection: 'row-reverse',
            background: 'white',
            borderRadius: '0 20px 20px 20px',
            padding: '20px',
            paddingTop: 5,
            width: '1200px'
          }}
            id="frames-ctr"
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '33%',
            }}>
              <span style={{
                color: '#666'
              }}
                contentEditable={true}
                onInput={(e) => {
                  setTimeFrames([e.target.textContent, timeFrames[1], timeFrames[2]])
                }}


              >
                {timeFrames[0]}
              </span>
              <img
                src={frames[0]} style={{
                  width: '100%',
                  height: 550,
                  border: '1px solid #666',
                  borderRadius: '0 10px 10px 10px'
                }}
                id="frame0"
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '33%'
            }}>
              <span style={{
                color: '#666'
              }}
                contentEditable={true}
                onInput={(e) => {
                  setTimeFrames([timeFrames[0], e.target.textContent, timeFrames[2]])
                }}

              >
                {timeFrames[1]}
              </span>
              <img
                src={frames[1]} style={{
                  width: '100%',
                  height: 550,
                  border: '1px solid #666',
                  borderRadius: '0 10px 10px 10px'
                }}
                id="frame1"
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '33%'
            }}>
              <span style={{
                color: '#666'
              }}
                contentEditable={true}
                onInput={(e) => {
                  setTimeFrames([timeFrames[0], timeFrames[1], e.target.textContent])
                }}
                onChange={(e) => {
                  console.log('e', e)
                }}
              >
                {timeFrames[2]}
              </span>
              <img
                src={frames[2]} style={{
                  width: '100%',
                  height: 550,
                  border: '1px solid #666',
                  borderRadius: '0 10px 10px 10px'
                }}
                id="frame2"
              />
            </div>

          </div>

        </div>
        {/* output controls */}
        <div style={{
          display: 'flex',
          gap: 20
        }}>
          <button onClick={() => {
            html2canvas(document.getElementById('frames-ctr'), {
              backgroundColor: 'transparent',
            }).then(canvas => {
              // document.body.appendChild(canvas)
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
            })
          }} style={{
            borderRadius: '0 10px 10px 10px',
            padding: '10px 20px',
            paddingTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
            title="Copy to Clipboard">
            <FiCopy />
            {copy && <span>Copied</span>}

          </button>
          {/* add a mint button so people can mint the image to zora */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0 10px 10px 10px',
              padding: '10px 15px',
              paddingTop: '14px'
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
            }} src="/zora.png" id="zora"></img>
          </button>

        </div>
      </main>
    </>
  )
}
