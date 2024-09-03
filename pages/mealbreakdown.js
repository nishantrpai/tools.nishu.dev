// estimate the meal breakdown of provided product including calories
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiUpload, FiCamera } from 'react-icons/fi';
import Markdown from 'markdown-to-jsx';

export default function MealBreakdown() {
  const [breakdown, setBreakdown] = useState(null);
  const detectBreakdown = async (event) => {
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

  const getBreakdown = async () => {
    // get canvas as data url send to gpt as req body
    const canvas = document.getElementById('canvas');
    // reduce the size of the image to 500x500
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    tempCtx.drawImage(canvas, 0, 0, 500, 500);
    const dataURL = tempCanvas.toDataURL();
    setBreakdown('Checking...');
    const response = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `estimate detailed meal breakdown (in terms of proteins, carbohydrates, fats, and calories) of provided product (only give a breakdown, don't add prefix or suffix) \n\nMeal Breakdown (use markdown formatting, give a table):\n\n`,
        image_url: dataURL,
        model: 'gpt-4o-mini'
      }),
    });
    const data = await response.json();
    setBreakdown(data.response);
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
        <title>Meal Breakdown</title>
        <meta name="description" content="Get meal breakdown for your food items including calories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* input to upload, canvas to render and prompt to detect the meal breakdown */}
      <main>
        <h1 className={styles.title}>
          Meal Breakdown
        </h1>
        <h2 className={styles.description}>
          Get meal breakdown for your food items including calories
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
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'row', gap: 0, width: '100%', textAlign: 'left', fontSize: 32 }}>
          <div style={{
            flexBasis: '50%', textAlign: 'center', border: '1px solid #333', padding: 20,
            borderRadius: '5px 0 0 5px'
          }}>
            <label htmlFor="file-upload">
              <FiUpload />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={detectBreakdown} style={{ display: 'none' }} />
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
            <input id="file-camera" type="file" accept="image/*" onChange={detectBreakdown} capture="environment" style={{ display: 'none' }} />
          </div>
        </div>
        <button onClick={getBreakdown} style={{ marginTop: 20, fontSize: '1.25rem' }}>Get</button>
        <Markdown style={{
          fontSize: '1.5rem',
          padding: '1rem',
          display: 'block',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          marginTop: '1rem'
        }}>
          {breakdown}
        </Markdown>
      </main>
    </>
  )

}