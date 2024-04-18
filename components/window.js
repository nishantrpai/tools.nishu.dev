// window component for infinte canvas
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Window({ url, x=200, y=200 }) {
  
  const [resize, setResize] = useState(false)
  const [width, setWidth] = useState(706)
  const [height, setHeight] = useState(1050)
  const [xPos, setX] = useState(x)
  const [yPos, setY] = useState(y)

  const changeCursor = (cursor) => {
    document.body.style.cursor = cursor
  }

  const pointerMoveListener = (e) => {
    if(resize) {
      console.log('resizing')
      setWidth(width + e.movementX)
      setHeight(height + e.movementY)
    }
  }

  return (
    <>
    <Head>
      <script type="module" src="/xframebypass.js"></script>
    </Head>
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
        // setResize(false)
        changeCursor('default')
      }}
      onMouseLeave={() => {
        changeCursor('default')
      }}
      onPointerMove={pointerMoveListener}
    >
    <iframe is="x-frame-bypass" src={url} style={{
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
    </>
    
  )
}