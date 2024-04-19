// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiX } from 'react-icons/fi'

class Window {
  constructor(url, width, height, x, y, z = 1) {
    this.url = url
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.z = z
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
  const [currentTop, setCurrentTop] = useState(1)


  const wheelListener = (e) => {
    // console.log('wheel listener')
    console.log(e.deltaY)
  }

  const pointerMoveListener = (e) => {
    if (document.body.style.cursor === 'nwse-resize' && currentWindow !== null && e.buttons === 1) {
      canvas.windows[currentWindow].width += e.movementX * 2
      canvas.windows[currentWindow].height += e.movementY * 2
      setCanvas({ ...canvas })
      console.log('pointer resize listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].width, canvas.windows[currentWindow].height)
    }
    if (document.body.style.cursor === 'move' && currentWindow !== null && e.buttons === 1) {
      console.log('current window', canvas.windows[currentWindow].z, canvas.windows[currentWindow].x, canvas.windows[currentWindow].y, canvas.windows[currentWindow].width, canvas.windows[currentWindow].height)
      canvas.windows[currentWindow].x += e.movementX
      canvas.windows[currentWindow].y += e.movementY
      canvas.windows[currentWindow].z = currentTop
      setCurrentTop(currentTop + 1)
      setCanvas({ ...canvas })
      // save canvas to local storage
      window.localStorage.setItem('canvas', JSON.stringify(canvas))
      console.log('pointer move listener', document.body.style.cursor, currentWindow, e.movementX, e.movementY, canvas.windows[currentWindow].x, canvas.windows[currentWindow].y)
    }
  }

  const changeCursor = (cursor) => {
    document.body.style.cursor = cursor
  }

  useEffect(() => {
    // canvas.addWindow(new Window('https://news.ycombinator.com/item?id=36504661', 300, 300, 200, 200))

    if (canvas.windows.length == 0) {
      // open in the middle of the screen
      if (window.localStorage.getItem('canvas')) {
        setCanvas(JSON.parse(window.localStorage.getItem('canvas')))
      } else {
        canvas.windows.push(new Window('https://news.ycombinator.com/item?id=36504661', 300, 300, window.innerWidth / 2 - 150, window.innerHeight / 2 - 150, canvas.windows.length + 1))
        canvas.windows.push(new Window('https://en.wikipedia.org/wiki/Vincent_van_Gogh', 300, 400, window.innerWidth / 2 - 150, window.innerHeight / 2 - 150, canvas.windows.length + 1))
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
        }}>

          {canvas.windows.map((window, idx) => {
            return (
              <div style={{
                width: `${window.width}px`,
                height: `${window.height}px`,
                left: `${window.x}px`,
                top: `${window.y}px`,
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
                  width: '100%',
                  height: '30px',
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