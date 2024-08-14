// get prompt from image
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
    // reduce the size of the image to 500x500
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    tempCtx.drawImage(canvas, 0, 0, 500, 500);
    const dataURL = tempCanvas.toDataURL();
    setFont('Checking...');
    const response = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `Given this image, please provide a one paragraph story to describe it (don't add any prefix or suffix text). \n\nStory:`,
        image_url: dataURL,
        model: 'gpt-4o-mini'
      }),
    });
    const data = await response.json();
    setFont(data.response);
  }

  useEffect(() => {
    // when pasting image add it to canvas
    window.addEventListener('paste', async (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
          }
          reader.readAsDataURL(blob);
        }
      }
    });
  }, [])

  
  return (
    <>
      <Head>
        <title>
          Image to story
        </title>
        <meta name="description" content="Image to story" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* input to upload, canvas to render and prompt to detect the font */}
      <main>
        <h1 className={styles.title}>
          Image to story
        </h1>
        <h2 className={styles.description}>
          Image to story
        </h2>
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
        <button onClick={getFont} style={{ marginTop: 20}}>Get</button>
        <span style={{
          fontSize: '1rem',
          color: '#fff',
          fontWeight: 'bold',
          padding: '1rem',
          display: 'block',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          marginTop: '1rem',
          lineHeight: '1.5'
        }}>
          {font}
        </span>

      </main>
    </>
  )

}