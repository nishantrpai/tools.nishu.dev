// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiX } from 'react-icons/fi'

class Window {
  constructor(url, width, height, x, y) {
    this.url = url
    this.width = 300
    this.height = 300
    this.x = x
    this.y = y
    this.z = 1
  }
}

class Canvas {
  constructor() {
    this.windows = []
  }
  // addWindow(window) {
  //   this.windows.push(window)
  // }
  // removeWindow(idx) {
  //   this.windows.splice(idx, 1)
  // }
  // moveWindow(idx, x, y) {
  //   this.windows[idx].x = x
  //   this.windows[idx].y = y
  // }
  // resizeWindow(idx, width, height) {
  //   this.windows[idx].width = width
  //   this.windows[idx].height = height
  // }
}


function InfiniteCanvas() {

  const [resize, setResize] = useState(false)
  const [move, setMove] = useState(false)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [x, setX] = useState(200)
  const [y, setY] = useState(200)
  const [canvas, setCanvas] = useState(new Canvas())
  const [currentWindow, setCurrentWindow] = useState(null)
  const [clicking, setClicking] = useState(false)
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)


  const wheelListener = (e) => {
    // console.log('wheel listener')
    console.log(e.deltaY)
  }

  const pointerMoveListener = (e) => {
    if (document.body.style.cursor === 'nwse-resize' && currentWindow !== null && e.buttons === 1) {
      console.log('pointer resize', e.pageX, e.pageY, startX, startY, e.pageX - startX, e.pageY - startY)
      canvas.windows[currentWindow].width += e.movementX
      canvas.windows[currentWindow].height += e.movementY
      setCanvas({ ...canvas })
      console.log('pointer resize listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].width, canvas.windows[currentWindow].height)
    }
    if (document.body.style.cursor === 'move' && currentWindow !== null && e.buttons === 1) {
      console.log('pointer move', e.pageX, e.pageY, startX, startY, e.pageX - startX, e.pageY - startY)
      canvas.windows[currentWindow].x += e.movementX
      canvas.windows[currentWindow].y += e.movementY
      setCanvas({ ...canvas })
      console.log('pointer move listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].x, canvas.windows[currentWindow].y)
    }
  }

  const changeCursor = (cursor) => {
    document.body.style.cursor = cursor
  }

  useEffect(() => {
    // canvas.addWindow(new Window('https://news.ycombinator.com/item?id=36504661', 300, 300, 200, 200))

    if (canvas.windows.length == 0) {
      canvas.windows.push(new Window('https://news.ycombinator.com/item?id=36504661', 300, 300, 200, 200))
      console.log(canvas.windows.length)
      setCanvas({ ...canvas })
    }
    document.body.style.cursor = 'default'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
  }, [])


  return (
    <>
      <Head>
        <title>Infinite Canvas</title>
        <meta name="description" content="Infinite Canvas" />
        <link rel="icon" href="/favicon.ico" />
        <script type="module" src="/xframebypass.js"></script>
      </Head>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden !important' }} onWheel={wheelListener} onPointerMove={pointerMoveListener} onClick={() => {
        setResize(false)
        setMove(false)
      }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setResize(false)
            setMove(false)
          }

        }}
        onMouseDown={(e) => {
          console.log('starting click')
          setClicking(true)
          setStartX(e.pageX)
          setStartY(e.pageY)
        }}
        onMouseUp={() => {
          console.log('ending click')
          setClicking(false)
          document.body.style.cursor = 'default'
          setStartX(null)
          setStartY(null)
        }}
      >
        <div style={{
          transformOrigin: 'left top',
          width: '100vw',
          height: '100vh',
        }}>
          {/* <div style={{
            position: 'absolute',
            width: `${width}px`,
            height: `${height + 30}px`,
            left: `${x}px`,
            top: `${y}px`,
            display: 'inline-block',
            border: '5px solid #333',
            borderRadius: '10px',
          }}
            onMouseEnter={() => {
              console.log('entered parent')
              // set mouse to resize 
              changeCursor('nwse-resize')
            }}
            onMouseDown={() => {
              if(document.body.style.cursor === 'nwse-resize') {
                console.log('trying to resize')
                setResize(true)
                console.log('clicked parent')
              }
              // if(document.body.style.cursor === 'move') {
              //   setMove(true)
              //   console.log('clicked parent')
              // }
            }}
            onMouseUp={() => {
              setResize(false)
              setMove(false)
              changeCursor('default')
            }}
            onMouseLeave={() => {
              // changeCursor('default')
            }}
          >
          <div style={{
            display: 'flex',
            width: '100%',
            padding: '5px',
          }}
            onMouseDown={() => {
              setMove(true)
              document.body.style.cursor = 'move'
            }}
            onMouseUp={() => {
              setMove(false)
              document.body.style.cursor = 'default'
            }}
          >
            <button style={{
              padding: '2px',
              fontSize: '5px',
              borderRadius: '100%',
              background: 'red', 
              color: '#000'
            }}>
              <FiX />
            </button>
          </div>
          <iframe is="x-frame-bypass" src="https://news.ycombinator.com/item?id=36504661" style={{
            width: '100%',
            height: `${height}px`,
            borderRadius: '0 0 10px 10px',
            outline: 'none',
            userSelect: 'none',
          }} 
          frameBorder={0}
          onMouseEnter={() => {
            console.log('entered iframe')
            // remove mouse resize
            changeCursor('default')
          }}
          />

          </div> */}

          {canvas.windows.map((window, idx) => {
            return (
              <div style={{
                width: `${window.width}px`,
                height: `${window.height}px`,
                left: `${window.x}px`,
                top: `${window.y}px`,
                position: 'absolute',
                border: '3px solid #333',
                borderRadius: '10px',
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
                  width: '100%',
                  height: '30px',
                  background: '#000',
                  borderRadius: '10px 10px 0 0',
                }}
                  onMouseEnter={() => {
                    document.body.style.cursor = 'move'
                  }}
                  onMouseDown={() => {
                    setCurrentWindow(idx)
                  }}
                  onMouseUp={() => {
                    console.log('mouseup')
                    // document.body.style.cursor = 'default'
                    setCurrentWindow(null)
                  }}
                  onMouseLeave={() => {
                    console.log('leaving window')
                    // document.body.style.cursor = 'default'
                  }}
                >
                  {/* window nav bar */}
                </div>
                <iframe is="x-frame-bypass" src="https://news.ycombinator.com/item?id=36504661" style={{
                  width: '100%',
                  height: `${window.height - 35}px`,
                  borderRadius: '0 0 10px 10px',
                  outline: 'none',
                  userSelect: 'none',
                }}
                  frameBorder={0}
                  onMouseEnter={() => {
                    console.log('entered iframe')
                    // remove mouse resize
                    document.body.style.cursor = 'default'
                  }}
                />

              </div>
            )
          })}

        </div>
      </div>
    </>
  )
}

const DynamicInfiniteCanvas = dynamic(() => Promise.resolve(InfiniteCanvas), {
  ssr: false
})

export default DynamicInfiniteCanvas