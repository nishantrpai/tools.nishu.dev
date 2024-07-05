// add video -> add subtitles -> download video with subtitles
// there will be a textarea with time of video for e.g., 00:01 - 00:02
// people will add their subtitles in textarea
// then they will click on download button to download the video with subtitles
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Subtitles() {
  const [video, setVideo] = useState(null)
  const [subtitles, setSubtitles] = useState('')
  const [subtitlesArray, setSubtitlesArray] = useState([])

  const handleSubtitles = (event) => {
    setSubtitles(event.target.value)
  }

  const addSubtitlesToVideo = () => {
    // get subtitles from state and add to video
    
  }


  return (
    <>
      <Head>
        <title>Subtitles</title>
        <meta name="description" content="Subtitles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: 1000
      }}>
        <h1 className={styles.title}>
          Subtitles
        </h1>
        <div style={{
          display: 'flex',
          gap: 10,
          width: '100%'
        }}>

          <video id="video" src={video} controls style={{
            width: '50%'
          }}>
          </video>
          <textarea value={subtitles} onChange={handleSubtitles} style={{ width: '50%', border: '1px solid #333', background: '#000', color: '#fff' }} />

        </div>
        <input type="file" accept="video/*" onChange={(event) => {
          const file = event.target.files[0]
          const url = URL.createObjectURL(file)

          setVideo(url)
          let video = document.getElementById('video')
          video.src = url
          video.load()
          video.onloadeddata = () => {
            let duration = video.duration
            let hours = Math.floor(duration / 3600)
            let minutes = Math.floor((duration % 3600) / 60)
            let seconds = Math.floor(duration % 60)
            console.log(hours, minutes, seconds)
            // add subtitles for duration in the format of 00:00:01 and 00:00:02
            // then user will add subtitles for that duration
            if (hours === 0) hours = 1
            for (let i = 0; i < hours; i++) {
              for (let j = 0; j < minutes; j++) {
                for (let k = 0; k < seconds; k++) {
                  subtitlesArray.push(`${i < 10 ? '0' + i : i}:${j < 10 ? '0' + j : j}:${k < 10 ? '0' + k : k} `)
                }
              }
            }
            let text = subtitlesArray.join('\n')
            setSubtitles(text)
          }
        }} style={{
          border: '1px solid #333'
        }}></input>

        <button>Download</button>
      </main>
    </>
  )
}