// get floor plan from image
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
        // get floor plan from image
        prompt: `Given this image, what is the floor plan, respond in json format with the rooms and their dimensions. Be precise in the x, y order. For example: {"rooms":[{"name":"living room","width":15,"height":12,"x":0,"y":0},{"name":"kitchen","width":10,"height":10,"x":15,"y":0},{"name":"dining area","width":10,"height":8,"x":15,"y":10},{"name":"staircase","width":5,"height":15,"x":0,"y":12}]}. If there are no rooms, respond with 'no rooms found'.Estimate distances from vision.  Don't add prefixes only provide json string (no backticks or json text the app receives response as json). \n\nExample of a Floor plan:`,
        image_url: dataURL,
        model: 'gpt-4o-mini'
      }),
    });
    const data = await response.json();
    setFont(JSON.parse(data.response));
  }

  function generateFloorPlanSvg(data) {
    // scale factor (1 foot = 10 pixels)
    const scale = 10;

    let svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" style="zoom: 1.25">`;
    svgContent += `<rect width="100%" height="100%" fill="#fff"/>`; // background

    if (data?.rooms === 'no rooms found' || !data?.rooms) {
      svgContent += `<text x="10" y="20" font-family="Arial" font-size="12" fill="#000">No rooms found</text>`;
      svgContent += `</svg>`;
      return svgContent;
    }

    data?.rooms.forEach((room) => {
      const { name, width, height, x, y } = room;

      // create a rectangle for the room with black stroke and white fill
      svgContent += `
        <rect x="${x * scale}" y="${y * scale}" width="${width * scale}" height="${height * scale}" fill="#fff" stroke="#000" />
        <text x="${(x * scale) + 10}" y="${(y * scale) + 20}" font-family="Arial" font-size="10" font-weight="bold" fill="#000">${name.toUpperCase()}</text>`;
    });

    svgContent += `</svg>`;

    return svgContent;
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
          Get Floor Plan
        </title>
        <meta name="description" content="Get floor plan from image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* input to upload, canvas to render and prompt to detect the font */}
      <main>
        <h1 className={styles.title}>Floor plan</h1>
        <h2 className={styles.description}>
          Get floor plan from image
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
        <button onClick={getFont} style={{ marginTop: 20 }}>Get</button>
        <span style={{
          fontSize: '1.5rem',
          padding: '1rem',
          display: 'block',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          marginTop: '1rem',
          width: '100%'
        }}>
          {/* render svg */}
          {font?.rooms ? <div dangerouslySetInnerHTML={{ __html: generateFloorPlanSvg(font) }} /> : null}
        </span>
        {/* download svg */}
        <button onClick={() => {
          const svg = generateFloorPlanSvg(font);
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'floorplan.svg';
          a.click();
          URL.revokeObjectURL(url);
        }
        } style={{ marginTop: 20 }}>Download Floor plan</button>

      </main>
    </>
  )

}