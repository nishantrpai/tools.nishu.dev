// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { FiX, FiPlus, FiHome, FiNavigation, FiFilePlus } from 'react-icons/fi'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

class StickyNote {
  constructor(note, x, y, z = 1, width = 200, height = 200) {
    this.x = x
    this.y = y
    this.z = z
    this.width = width
    this.height = height
    this.note = note
  }
}

class Window {
  constructor(url, width, height, x, y, z = 1) {
    this.url = url
    this.title = ''
    this.description = ''
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.z = z
  }
}

class Canvas {
  constructor() {
    this.cameraX = globalThis.window.innerWidth / 2
    this.cameraY = globalThis.window.innerHeight / 2
    this.zoom = 1
    this.windows = []
    this.notes = []
  }
}

function InfiniteCanvas() {
  const [canvas, setCanvas] = useState(new Canvas())
  const [currentWindow, setCurrentWindow] = useState(null)
  const [currentNoteIdx, setCurrentNoteIdx] = useState(null)
  const [currentTop, setCurrentTop] = useState(1)
  const [newURL, setNewURL] = useState('')
  const [searchMode, setSearchMode] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const canvasRef = useRef(null)

  const wheelListener = (e) => {
    let friction = 1;
    let deltaX = e.deltaX * friction
    let deltaY = e.deltaY * friction
    if (e.ctrlKey) {
      // zoom in and out
      canvas.zoom += (deltaY / 1000) * -1
      setCanvas({ ...canvas })
      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
    } else {
      // scroll set the camera position
      canvas.cameraX += (deltaX * 2)
      canvas.cameraY += (deltaY * 2)
      setCanvas({ ...canvas })
      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
    }
  }

  useEffect(() => {
    if (canvas.windows.length == 0) {
      // open in the middle of the screen
      if (window.localStorage.getItem('canvas')) {
        setCanvas(JSON.parse(window.localStorage.getItem('canvas')))
        // go through each window z and set the current top
        let maxZ = 0
        canvas.windows.forEach(window => {
          if (window.z > maxZ) {
            maxZ = window.z
          }
        })
        setCurrentTop(maxZ)
      } else {
        canvas.windows.push(new Window('https://news.ycombinator.com/item?id=36504661', 300, 300, window.innerWidth / 2 - 100, window.innerHeight / 2 - 150, canvas.windows.length + 1))
        canvas.windows.push(new Window('https://en.wikipedia.org/wiki/Vincent_van_Gogh', 300, 400, window.innerWidth / 2 + 120, window.innerHeight / 2 - 150, canvas.windows.length + 1))
        canvas.windows.push(new Window('https://www.webexhibits.org/vangogh/letter/2/025.htm?qp=attitude.death', 300, 500, window.innerWidth / 2 - 150, window.innerHeight / 2 - 150, canvas.windows.length + 1))
        setCurrentTop(3)
        setCanvas({ ...canvas })
      }
    }
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
  }, [canvas])

  const calculateX = (x) => {
    // compute the x position based on the camera position
    return x - canvas.cameraX + window.innerWidth / 2
  }

  const calculateY = (y) => {
    // compute the y position based on the camera position
    return y - canvas.cameraY + window.innerHeight / 2
  }

  const smoothScroll = (x, y) => {
    // smooth scroll the camera to the x and y position
    let deltaX = x - canvas.cameraX
    let deltaY = y - canvas.cameraY
    let stepX = deltaX / 100
    let stepY = deltaY / 100
    let i = 0
    let interval = setInterval(() => {
      canvas.cameraX += stepX
      canvas.cameraY += stepY
      setCanvas({ ...canvas })
      i++
      if (i === 100) {
        clearInterval(interval)
      }
    }, 5)
    setCanvas({ ...canvas })
    globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
  }

  const handleDrag = (e, ui, idx, type) => {
    const { x, y } = ui;
    const newCanvas = { ...canvas };
    if (type === 'note') {
      newCanvas.notes[idx].x = x;
      newCanvas.notes[idx].y = y;
    } else if (type === 'window') {
      newCanvas.windows[idx].x = x;
      newCanvas.windows[idx].y = y;
    }
    setCanvas(newCanvas);
    globalThis.window.localStorage.setItem('canvas', JSON.stringify(newCanvas));
  }

  const handleResize = (size, idx, type) => {
    const newCanvas = { ...canvas };
    if (type === 'note') {
      newCanvas.notes[idx].width = size.width;
      newCanvas.notes[idx].height = size.height;
    } else if (type === 'window') {
      newCanvas.windows[idx].width = size.width;
      newCanvas.windows[idx].height = size.height;
    }
    setCanvas(newCanvas);
    globalThis.window.localStorage.setItem('canvas', JSON.stringify(newCanvas));
  }

  return (
    <>
      <Head>
        <title>Infinite Canvas</title>
        <meta name="description" content="Infinite Canvas" />
        <link rel="icon" href="/favicon.ico" />
        <script type="module" src="/xframebypass.js"></script>
      </Head>
      <div 
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh', overflow: 'hidden !important' }} 
        onWheel={wheelListener}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setSearchResults([])
          }
        }}
      >
        <div style={{
          transformOrigin: 'left top',
          width: '100vw',
          height: '100vh',
          transform: `scale(${canvas.zoom})`,
        }}>

          {/* render notes  */}
          {canvas.notes?.map((note, idx) => (
            <Draggable
              key={idx}
              position={{x: calculateX(note.x), y: calculateY(note.y)}}
              onDrag={(e, ui) => handleDrag(e, ui, idx, 'note')}
            >
              <ResizableBox
                width={note.width}
                height={note.height}
                onResize={(e, {size}) => handleResize(size, idx, 'note')}
                minConstraints={[100, 100]}
                maxConstraints={[500, 500]}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  zIndex: `${note.z}`,
                  position: 'absolute',
                  background: '#FDD173',
                  border: '3px solid #9A6601',
                  color: '#000',
                  borderRadius: '10px 2px 10px 10px',
                  padding: '5px',
                  overflow: 'hidden'
                }}
                  onClick={() => {
                    setCurrentNoteIdx(idx)
                    setCurrentWindow(null)
                    note.z = currentTop;
                    setCurrentTop(currentTop + 1);
                    setCanvas({ ...canvas });
                  }}
                >
                  {/* add close button to the top right */}
                  <button style={{
                    cursor: 'pointer',
                    padding: '3px',
                    paddingTop: '4px',
                    height: 'max-content',
                    fontSize: '10px',
                    background: '#FDD173',
                    border: 'none',
                    outline: 'none',
                    position: 'absolute',
                    color: '#9A6601',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    right: '0',
                  }}>
                    <FiX onClick={() => {
                      canvas.notes.splice(idx, 1)
                      setCanvas({ ...canvas })
                      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                    }} />
                  </button>
                  <textarea style={{
                    width: '100%',
                    height: 'calc(100% - 30px)',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    color: '#000',
                    fontSize: '14px',
                  }}
                    value={note.note}
                    onChange={(e) => {
                      canvas.notes[idx].note = e.target.value
                      setCanvas({ ...canvas })
                      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                    }}
                  />
                </div>
              </ResizableBox>
            </Draggable>
          ))}

          {/* render links */}
          {canvas.windows.map((window, idx) => (
            <Draggable
              key={idx}
              position={{x: calculateX(window.x), y: calculateY(window.y)}}
              onDrag={(e, ui) => handleDrag(e, ui, idx, 'window')}
              handle=".window-handle"
            >
              <ResizableBox
                width={window.width}
                height={window.height}
                onResize={(e, {size}) => handleResize(size, idx, 'window')}
                minConstraints={[200, 200]}
                maxConstraints={[800, 800]}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  zIndex: `${window.z}`,
                  position: 'absolute',
                  border: '5px solid #333',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
                  onClick={() => {
                    setCurrentTop(currentTop + 1)
                    window.z = currentTop + 1;
                    setCanvas({ ...canvas })
                  }}
                >
                  <div className="window-handle" style={{
                    display: 'flex',
                    width: '100%',
                    height: '30px',
                    padding: '2px',
                    background: '#000',
                    borderRadius: '7px 7px 0 0',
                    cursor: 'move',
                  }}>
                    <button style={{
                      cursor: 'pointer',
                      padding: '3px',
                      paddingTop: '4px',
                      height: 'max-content',
                      fontSize: '10px',
                      background: '#000'
                    }}>
                      <FiX onClick={() => {
                        canvas.windows.splice(idx, 1)
                        setCanvas({ ...canvas })
                        if (globalThis.window.localStorage.getItem('canvas')) {
                          globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                        }
                      }} />
                    </button>
                    {/* window nav bar */}
                  </div>
                  <iframe is="x-frame-bypass" src={window.url} style={{
                    width: '100%',
                    height: 'calc(100% - 35px)',
                    borderRadius: '0 0 10px 10px',
                    outline: 'none',
                    userSelect: 'none',
                  }}
                    frameBorder={0}
                    onLoad={(e) => {
                      // get the title and favicon 
                      canvas.windows[idx].title = e.target.contentDocument.title
                      canvas.windows[idx].description = e.target.contentDocument.querySelector('meta[name="description"]')?.content
                      setCanvas({ ...canvas })
                      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                    }}
                  />
                </div>
              </ResizableBox>
            </Draggable>
          ))}

        </div>
        {/* at the bottom the a url window to add links */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          height: '50px',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          borderRadius: '10px 10px 0 0',
          fontSize: '14px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40%',
            border: '1px solid #333',
            borderRadius: '2px 6px',
          }}>
            {searchResults &&
              <div style={{
                width: '100%',
                background: '#000'
              }}>
                {searchResults.map((result, idx) => (
                  <div key={idx} style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '5px',
                    borderBottom: '1px solid #333',
                  }}
                    onClick={() => {
                      // scroll to the window and set the z index
                      canvas.zoom = 1
                      smoothScroll((result.x), result.y + 300)
                      setCanvas({ ...canvas })
                      setSearchResults([])
                      globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                    }}
                  >
                    <span style={{
                      color: '#fff',
                      fontSize: '10px',
                    }}>
                      {result.title}
                    </span>
                  </div>
                ))}
              </div>
            }
            <div style={{
              width: '100%',
              display: 'flex',
            }}>
              <button style={{
                width: '100%',
                background: searchMode ? '#1e1e1e' : '#000',
                border: '1px solid #333',
                borderRadius: '0 2px 2px 0',
              }}
                onClick={() => {
                  setSearchMode(true)
                }}
              >
                <FiNavigation />
              </button>

              <button style={{
                width: '100%',
                background: searchMode ? '#000' : '#1e1e1e',
                border: '1px solid #333',
                borderRadius: '2px 0 0 2px',
              }}
                onClick={() => {
                  setSearchResults([])
                  setSearchMode(false)
                }}
              >
                <FiPlus />
              </button>
            </div>
            <input style={{
              width: '100%',
              height: '30px',
              border: 'none',
              outline: 'none',
              padding: '19px',
              background: '#222',
            }}
              placeholder={
                searchMode ? 'Where do you want to go?' : 'Add URL'
              } onChange={(e) => {
                if (!searchMode) {
                  setNewURL(e.target.value)
                } else {
                  setSearchResults([])
                  if(e.target.value === '') return;
                  let results = []
                  canvas.windows.forEach(w => {
                    if (w.url?.toLowerCase()?.includes(e.target.value) || w.title?.toLowerCase()?.includes(e.target.value) || w.description?.toLowerCase()?.includes(e.target.value)) {
                      results.push(w)
                    }
                  })
                  setSearchResults(results)
                }
              }} />
          </div>
          <button style={{
            borderRadius: '2px 6px',
            background: '#222',
            color: '#fff',
            marginLeft: '10px',
            border: 'none',
            outline: 'none',
            padding: '8px 10px',
            border: '1px solid #333',
          }} onClick={() => {
            // console.log('clicked add window')
            // open new window at the center of the screen
            if (newURL == '') return;
            canvas.windows.push(new Window(newURL, 300, 300, canvas.cameraX - 150, canvas.cameraY - 150, currentTop + 1))
            setCurrentTop(currentTop + 1)
            setCanvas({ ...canvas })
            globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
          }}>
            <FiPlus />
          </button>
          <button
            style={{
              borderRadius: '2px 6px',
              background: '#222',
              color: '#fff',
              marginLeft: '10px',
              border: 'none',
              outline: 'none',
              padding: '8px 10px',
              border: '1px solid #333'
            }}
            onClick={() => {
              // reset camera back to the center and zoom to 1
              canvas.cameraX = globalThis.window.innerWidth / 2
              canvas.cameraY = globalThis.window.innerHeight / 2
              canvas.zoom = 1
              setCanvas({ ...canvas })
              globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
            }}
          >
            <FiHome />
          </button>
          <button style={{
            borderRadius: '2px 6px',
            background: '#222',
            color: '#fff',
            marginLeft: '10px',
            border: 'none',
            outline: 'none',
            padding: '8px 10px',
            border: '1px solid #333'
          }}
            onClick={() => {
              // if notes is not in the canvas add it
              if (!canvas.notes) {
                canvas.notes = []
              }
              canvas.notes.push(new StickyNote('your note', canvas.cameraX, canvas.cameraY, currentTop + 1))
              setCurrentTop(currentTop + 1)
              setCanvas({ ...canvas })
              globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
            }}
          >
            <FiFilePlus />
          </button>
        </div>


      </div>
    </>
  )
}

const DynamicInfiniteCanvas = dynamic(() => Promise.resolve(InfiniteCanvas), {
  ssr: false
})

export default DynamicInfiniteCanvas