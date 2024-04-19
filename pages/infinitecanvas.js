// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiX, FiPlus, FiHome, FiNavigation } from 'react-icons/fi'

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
  }
}


function InfiniteCanvas() {

  const [canvas, setCanvas] = useState(new Canvas())
  const [currentWindow, setCurrentWindow] = useState(null)
  const [currentTop, setCurrentTop] = useState(1)
  const [newURL, setNewURL] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [searchResults, setSearchResults] = useState([])


  const wheelListener = (e) => {
    // console.log('wheel listener')
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
    console.log(deltaX, deltaY)

  }

  const pointerMoveListener = (e) => {
    if (document.body.style.cursor === 'nwse-resize' && currentWindow !== null && e.buttons === 1) {
      canvas.windows[currentWindow].width += e.movementX * 2
      canvas.windows[currentWindow].height += e.movementY * 2
      canvas.windows[currentWindow].z = currentTop
      setCurrentTop(currentTop + 1)
      setCanvas({ ...canvas })
      window.localStorage.setItem('canvas', JSON.stringify(canvas))
      console.log('pointer resize listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].width, canvas.windows[currentWindow].height)
    }
    if (document.body.style.cursor === 'move' && currentWindow !== null && e.buttons === 1) {
      console.log('current window', canvas.windows[currentWindow].z, canvas.windows[currentWindow].x, canvas.windows[currentWindow].y, canvas.windows[currentWindow].width, canvas.windows[currentWindow].height)
      canvas.windows[currentWindow].x += e.movementX * 2
      canvas.windows[currentWindow].y += e.movementY * 2
      canvas.windows[currentWindow].z = currentTop
      setCurrentTop(currentTop + 1)
      setCanvas({ ...canvas })
      // save canvas to local storage
      window.localStorage.setItem('canvas', JSON.stringify(canvas))
      console.log('pointer move listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].x, canvas.windows[currentWindow].y)
    }
    if (e.buttons === 1 && document.body.style.cursor === 'default') {
      canvas.cameraX += e.movementX * 2 * -1
      canvas.cameraY += e.movementY * 2 * -1
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
        console.log('canvas windows', canvas.windows)
        setCanvas({ ...canvas })
      }
    }
    document.body.style.cursor = 'default'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
  }, [])

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


  return (
    <>
      <Head>
        <title>Infinite Canvas</title>
        <meta name="description" content="Infinite Canvas" />
        <link rel="icon" href="/favicon.ico" />
        <script type="module" src="/xframebypass.js"></script>
      </Head>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden !important' }} onWheel={wheelListener} onPointerMove={pointerMoveListener}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            document.body.style.cursor = 'default'
            setSearchResults([])
          }
        }}
        onMouseDown={(e) => {
          console.log('starting click')
        }}
        onMouseUp={() => {
          console.log('ending click')
          document.body.style.cursor = 'default'
        }}
      >
        <div style={{
          transformOrigin: 'left top',
          width: '100vw',
          height: '100vh',
          transform: `scale(${canvas.zoom})`,
        }}>

          {canvas.windows.map((window, idx) => {
            return (
              <div style={{
                width: `${window.width}px`,
                height: `${window.height}px`,
                left: `${calculateX(window.x)}px`,
                top: `${calculateY(window.y)}px`,
                zIndex: `${window.z}`,
                position: 'absolute',
                border: '3px solid #333',
                borderRadius: '10px',
              }}
                onClick={() => {
                  console.log('clicked parent')
                  setCurrentTop(currentTop + 1)
                  setCanvas({ ...canvas })
                }}
                onMouseEnter={() => {
                  console.log('entered window')
                  document.body.style.cursor = 'nwse-resize'
                }}
                onMouseDown={() => {
                  setCurrentWindow(idx)
                }}
                onMouseUp={() => {
                  setCurrentWindow(null)
                  console.log('mouseup')
                }}
              >
                <div style={{
                  display: 'flex',
                  width: '100%',
                  height: '30px',
                  padding: '2px',
                  background: '#000',
                  borderRadius: '7px 7px 0 0',
                }}
                  onMouseEnter={() => {
                    document.body.style.cursor = 'move'
                  }}
                  onMouseDown={() => {
                    setCurrentWindow(idx)
                  }}
                  onMouseUp={() => {
                    console.log('mouseup')
                    setCurrentWindow(null)
                  }}
                  onMouseLeave={() => {
                    console.log('leaving window')
                  }}
                >
                  <button style={{
                    cursor: 'pointer',
                    padding: '3px',
                    paddingTop: '4px',
                    height: 'max-content',
                    fontSize: '10px',
                    background: '#000'
                  }}>
                    <FiX onClick={() => {
                      console.log('clicked close')
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
                  height: `${window.height - 35}px`,
                  borderRadius: '0 0 10px 10px',
                  outline: 'none',
                  userSelect: 'none',
                }}
                  frameBorder={0}
                  onClick={() => {
                    console.log('clicked iframe')
                    window.z = currentTop
                  }}
                  onMouseEnter={() => {
                    console.log('entered iframe')
                    // remove mouse resize
                    // document.body.style.cursor = 'default'
                  }}
                  onLoad={(e) => {
                    // get the title and favicon 
                    canvas.windows[idx].title = e.target.contentDocument.title
                    canvas.windows[idx].description = e.target.contentDocument.querySelector('meta[name="description"]')?.content
                    setCanvas({ ...canvas })
                    globalThis.window.localStorage.setItem('canvas', JSON.stringify(canvas))
                  }}
                />
              </div>
            )
          })}


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
                  <div style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '5px',
                    borderBottom: '1px solid #333',
                  }}
                    onClick={() => {
                      // scroll to the window and set the z index
                      canvas.windows[canvas.windows.indexOf(result)].z = currentTop
                      canvas.zoom = 1
                      smoothScroll(result.x, result.y)
                      setCurrentTop(currentTop + 1)
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
                background: searchMode ? '#000' : '#111',
                border: '1px solid #333',
                borderRadius: '2px 0 0 2px',
              }}
                onClick={() => {
                  setSearchMode(false)
                }}
              >
                <FiPlus />
              </button>
              <button style={{
                width: '100%',
                background: searchMode ? '#111' : '#000',
                border: '1px solid #333',
                borderRadius: '0 2px 2px 0',
              }}
                onClick={() => {
                  setSearchMode(true)
                }}
              >
                <FiNavigation />
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
                console.log('searching')
                // search for the url, title and description in the windows
                let results = []
                canvas.windows.forEach(w => {
                  if (w.url?.toLowerCase()?.includes(e.target.value) || w.title?.toLowerCase()?.includes(e.target.value) || w.description?.toLowerCase()?.includes(e.target.value)) {
                    results.push(w)
                  }
                })
                console.log('search results', results)
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
            console.log('clicked add window')
            // open new window at the center of the screen
            if(newURL == '') return;
            canvas.windows.push(new Window(newURL, 300, 300, canvas.cameraX - 150, canvas.cameraY - 150, currentTop + 1))
            setCurrentTop(currentTop + 1)
            setCanvas({ ...canvas })
            setNewURL('')
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
        </div>


      </div>
    </>
  )
}

const DynamicInfiniteCanvas = dynamic(() => Promise.resolve(InfiniteCanvas), {
  ssr: false
})

export default DynamicInfiniteCanvas