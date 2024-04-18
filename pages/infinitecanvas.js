// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiX } from 'react-icons/fi'

function InfiniteCanvas() {

  const [resize, setResize] = useState(false)
  const [move, setMove] = useState(false)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [x, setX] = useState(200)
  const [y, setY] = useState(200)

  const wheelListener = (e) => {
    // console.log('wheel listener')
    console.log(e.deltaY)
  }

  const pointerMoveListener = (e) => {
    console.log('pointer move listener', document.body.style.cursor)
    if(resize && document.body.style.cursor === 'nwse-resize') {
      console.log('resizing', document.body.style.cursor)
      setWidth(width + e.movementX)
      setHeight(height + e.movementY)
    }
    if(move && document.body.style.cursor === 'move') {
      console.log('moving', document.body.style.cursor)
      setX(x + e.movementX)
      setY(y + e.movementY)
    }
  }

  const changeCursor = (cursor) => {
    document.body.style.cursor = cursor
  }

  useEffect(() => {
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
      }}>
        <div style={{
          transformOrigin: 'left top',
          width: '100vw',
          height: '100vh',
        }}>
          <div style={{
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

          </div>
          

        </div>
      </div>
    </>
  )
}

const DynamicInfiniteCanvas = dynamic(() => Promise.resolve(InfiniteCanvas), {
  ssr: false
})

export default DynamicInfiniteCanvas