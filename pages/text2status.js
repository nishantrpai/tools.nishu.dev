// text 2 status for whatsapp/instagram
// breakdown the text into multiple statuses
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Text2Status() {
  const [text, setText] = useState('')
  const [statuses, setStatuses] = useState([])

  // we will have to draw multiple canvas elements for each status

  const getBgAndTextColor = async (paragraph) => {
    // given paragraph get the background and text color from gpt 
    // should match the sentiment of the paragraph
    let data = { background: '#333', color: '#fff' }
    let prompt = `Given the paragraph: "${paragraph}" suggest a background and text color that matches the sentiment of the paragraph.
    Remember the background and text color should be contrasting for readability.
    Don't use same color for background and text.
    Response should be in the format: {"background": "#333", "color": "#fff"}.
    Color codes should be in hex format.
    Avoid yellow and white colors for text.
    Don't miss the quotes around the color codes.
    `

    let res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    })

    data = await res.json()
    return JSON.parse(data.response)
  }

  useEffect(() => {
    // breakdown the text for each status, don't break the word
    // breakdown by paragraphs
    let paragraphs = text.split('\n\n')

    console.log('paragraphs', paragraphs)

    paragraphs = paragraphs.filter((paragraph) => paragraph.length > 0)
    paragraphs = paragraphs.map((paragraph) => paragraph.trim())

    // canvas will be 1080x1920
    setStatuses([])
    paragraphs.forEach((paragraph, index) => {
      let canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      let context = canvas.getContext('2d')
      getBgAndTextColor(paragraph).then((res) => {
      console.log('res', res)
      let { background, color } = res
      console.log('background', background, 'color', color)
      context.fillStyle = background
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.font = '80px Arial'
      context.fillStyle = color
      context.textAlign = 'left'
      context.textBaseline = 'top'


      let lines = paragraph.split('\n')
      // if there are more than 10 words in a line, break it into multiple lines
      lines = lines.map((line) => {
        let words = line.split(' ')
        let newLines = []
        let newLine = ''
        words.forEach((word) => {
          if (newLine.length + word.length < 30) {
            newLine += word + ' '
          } else {
            newLines.push(newLine)
            newLine = word + ' '
          }
        })
        newLines.push(newLine)
        return newLines
      }
      ).flat()

      let y = 200
      // draw text from center
      let x = 50
      for (let i = 0; i < lines.length; i++) {
        // draw each line on the canvas
        context.fillText(lines[i], x, y)
        y += 120
      }
      let dataURL = canvas.toDataURL('image/png')
      // add index to statuses
      let status = { index, dataURL }
      // remove the previous status with the same index
      setStatuses((statuses) => statuses.filter((status) => status.index !== index))
      setStatuses((statuses) => [...statuses, status])
    })
    })


  }, [text])


  return (
    <>
      <Head>
        <title>Text 2 Status</title>
        <meta name="description" content="Breakdown your text into multiple statuses for WhatsApp or Instagram" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{gap: 20}}>
        <h1 className={styles.title}>
          Text 2 Status
        </h1>
        <h2 className={styles.description}>
          Breakdown your text into multiple statuses for WhatsApp or Instagram
        </h2>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text" style={{ width: '100%', height: '200px', padding: '10px', border: '1px solid #333', outline: 'none', marginBottom: '20px', fontSize: 16, color: '#fff', borderRadius: 10 }}></textarea>
        <h3>
          Preview
        </h3>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between', maxWidth: 500, overflow: 'auto', scrollbarWidth: 'thin', padding: 20 }}>

          {statuses
          .sort((a, b) => a.index - b.index)
          .map((status, index) => (
            <img key={index} src={status.dataURL} style={{ width: '50%', objectFit: 'cover', borderRadius: 10 }} />
          ))}
        </div>

        <button onClick={() => {
          // download the images
          statuses.forEach((status, index) => {
            let a = document.createElement('a')
            a.href = status.dataURL
            a.download = `status-${index}.png`
            a.click()
          })
        }}>
          Download
        </button>
      </main>
    </>
  )
}
