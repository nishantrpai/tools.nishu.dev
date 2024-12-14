// which font is in the image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiUpload, FiCamera } from 'react-icons/fi';

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
    tempCtx.drawImage(canvas, 0, 0, 500, 500);
    const dataURL = tempCanvas.toDataURL();
    setFont('Detecting Font...');
    const response = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Is this font helvetica or not? Please reply only YES/NO', image_url: dataURL,
        model: 'gpt-4o-mini'
      }),
    });
    const data = await response.json();
    setFont(data.response);
  }
  return (
    <>
      <Head>
        <title>Helvetica Font or Not</title>
        <meta name="description" content="Is this Helvetica font?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* input to upload, canvas to render and prompt to detect the font */}
      <main>
        <h1 className={styles.title}>Is this Helvetica font?</h1>
        <h2 className={styles.description}>Is this Helvetica font?</h2>
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
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'row', gap: 0, width: '100%', textAlign: 'left', fontSize: 32 }}>
          <div style={{
            flexBasis: '50%', textAlign: 'center', border: '1px solid #333', padding: 20,
            borderRadius: '5px 0 0 5px'
          }}>
            <label htmlFor="file-upload">
              <FiUpload />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={detectFont} style={{ display: 'none' }} />
          </div>
          {/* add camera input */}
          <div style={{
            flexBasis: '50%', textAlign: 'center', border: '1px solid #333',
            borderRadius: '0 5px 5px 0',
            padding: 20
          }}>
            <label htmlFor="file-camera">
              <FiCamera />
            </label>
            <input id="file-camera" type="file" accept="image/*" onChange={detectFont} capture="environment" style={{ display: 'none' }} />
          </div>
        </div>
        <button onClick={getFont}>Detect</button>
        <span style={{
          fontSize: '3rem',
          fontWeight: 'bold',
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