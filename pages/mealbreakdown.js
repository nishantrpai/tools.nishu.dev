import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useState, useEffect } from 'react';
import { FiUpload, FiCamera } from 'react-icons/fi';
import MarkdownRenderer from '@/components/markdownrenderer';

export default function MealBreakdown() {
  const [breakdown, setBreakdown] = useState(null);
  const [ingredients, setIngredients] = useState('');

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
    const canvas = document.getElementById('canvas');
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    tempCtx.drawImage(canvas, 0, 0, 500, 500);
    const dataURL = tempCanvas.toDataURL();
    setBreakdown('Checking...');
    
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const response = await fetch('/api/gpt', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `breakdown of provided product \n\nThe original image dimensions are ${originalWidth}x${originalHeight}. The image has been scaled down to 500x500. \n\nAggregate Meal Breakdown (use markdown formatting, keep width small, no need to add prefix or suffix or preparation steps):\n\nIngredients: ${ingredients}\n\nMeal Breakdown (including macros such as protein, carbohydrates, and fats):\n\n`,
        image_url: dataURL,
        model: 'gpt-4o-mini'
      }),
    });
    const data = await response.json();
    setBreakdown(data.response);
  }

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Head>
        <title>Meal Breakdown</title>
        <meta name="description" content="Get meal breakdown for your food items including calories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>Meal Breakdown</h1>
        <h2 className={styles.description}>Get meal breakdown for your food items including calories</h2>
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
        <div style={{ marginTop: 20, width: '100%' }}>
          <input 
            type="text" 
            placeholder="Add ingredients (comma separated)" 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            style={{ width: '100%', padding: '10px', fontSize: '1rem' }} 
          />
        </div>
        <button onClick={getBreakdown} style={{ marginTop: 20, fontSize: '1rem' }}>Get</button>
        {breakdown && (
          <MarkdownRenderer markdown={breakdown} />
        )}
      </main>
    </>
  )
}
