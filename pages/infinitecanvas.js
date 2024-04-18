// infinite canvas with iframes for viewing all links in one place
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

function InfiniteCanvas() {

  const wheelListener = (e) => {
    // console.log('wheel listener')
    console.log(e.deltaY)
  }

  const pointerMoveListener = (e) => {
    // console.log('pointer move listener')
    console.log(e)
  }

  return (
    <>
      <Head>
        <title>Infinite Canvas</title>
        <meta name="description" content="Infinite Canvas" />
        <link rel="icon" href="/favicon.ico" />
        <script type="module" src="/xframebypass.js"></script>
      </Head>
      <div style={{ width: '100vw', height: '100vh', border: '1px solid red' }} onWheel={wheelListener} onPointerMove={pointerMoveListener}>
      <iframe is="x-frame-bypass" src="https://reddit.com" style={{
        width: '20vw',
        height: '20vh',
      }}/>

      </div>
    </>
  )
}

const DynamicInfiniteCanvas = dynamic(() => Promise.resolve(InfiniteCanvas), {
  ssr: false
})

export default DynamicInfiniteCanvas