// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

function InfiniteCanvas() {

  const [resize, setResize] = useState(false)
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const wheelListener = (e) => {
    // console.log('wheel listener')
    console.log(e.deltaY)
  }

  const pointerMoveListener = (e) => {
    if(resize) {
      console.log('resizing')
      setWidth(width + e.movementX)
      setHeight(height + e.movementY)
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
      }}>
        <div style={{
          transformOrigin: 'left top',
          width: '100vw',
          height: '100vh',
        }}>
          <div style={{
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            left: '200px',
            top: '200px',
            display: 'inline-block',
            border: '2px solid red',
            borderRadius: '10px',
            padding: '2px',
            paddingTop: '10px',
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
            }}
            onMouseUp={() => {
              setResize(false)
              changeCursor('default')
            }}
            onMouseLeave={() => {
              changeCursor('default')
            }}
          >
          <iframe is="x-frame-bypass" src="https://en.wikipedia.org/wiki/Vincent_van_Gogh" style={{
            width: '100%',
            height: '100%',
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