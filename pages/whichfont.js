// which font is in the image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function WhichFont() {
  const [font, setFont] = useState(null);
  const detectFont = async (event) => {
    const file = event.target.files[0];
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
    img.src = URL.createObjectURL(file);
  }

  const getFont = async () => {
    // get canvas as data url send to gpt as req body
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');
    setFont('Detecting Font...');
    const response = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'What font is this? Only respond with font name, nothing else. Most likely. If you think it is multiple send a list', image_url: dataURL,
        model: 'gpt-4o'
      }),
    });
    const data = await response.json();
    setFont(data.response);
  }
  return (
    <>
      <Head>
        <title>Which Font</title>
        <meta name="description" content="Which Font is in the image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* input to upload, canvas to render and prompt to detect the font */}
      <main>
        <h1 className={styles.title}>Which Font</h1>
        <h2 className={styles.description}>Detect the font in the image</h2>
      <canvas id="canvas"
      width={500}
      height={500}
      style={{
        border: '1px solid #333',
        borderRadius: '5px',
        width: '100%',
        height: 'auto'

      }}
      ></canvas>
      <input type="file" accept="image/*" onChange={detectFont} />
      <button onClick={getFont}>Detect Font</button>
      <span style={{
        fontSize: '3rem',
        padding: '1rem',
        display: 'block',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        marginTop: '1rem'
      }}>
      {font}
      </span>
        
      </main>
    </>
  )

}