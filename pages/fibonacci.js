import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function FibonacciOverlay() {
  const [fibWidth, setFibWidth] = useState(800);
  const [fibHeight, setFibHeight] = useState(500);
  const [iterations, setIterations] = useState(7);
  const [image, setImage] = useState(null);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [scale, setScale] = useState(1);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [overlayColor, setOverlayColor] = useState('#FF0000');
  const [lineThickness, setLineThickness] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawFibonacciOverlay();
    }
  }, [fibWidth, fibHeight, iterations, image, centerX, centerY, rotation, scaleX, scaleY, scale, flipHorizontal, flipVertical, overlayColor, lineThickness]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawFibonacciOverlay = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const canvasWidth = image ? image.width : 800;
    const canvasHeight = image ? image.height : 500;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (image) {
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    }

    ctx.strokeStyle = overlayColor + 'B3';
    ctx.lineWidth = lineThickness;

    ctx.save();

    ctx.translate(canvasWidth / 2 + centerX, canvasHeight / 2 + centerY);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(
      flipHorizontal ? -scaleX * scale : scaleX * scale, 
      flipVertical ? -scaleY * scale : scaleY * scale
    );

    ctx.beginPath();
    ctx.rect(-fibWidth / 2, -fibHeight / 2, fibWidth, fibHeight);
    ctx.stroke();

    let fib = [1, 1];
    for (let i = 2; i < iterations; i++) {
      fib[i] = fib[i-1] + fib[i-2];
    }

    const scaleRatio = Math.min(fibWidth, fibHeight) / fib[iterations - 1];

    let x = -fibWidth / 2;
    let y = fibHeight / 2;

    for (let i = iterations - 1; i >= 0; i--) {
      const sideLength = fib[i] * scaleRatio;

      ctx.beginPath();
      ctx.rect(x, y - sideLength, sideLength, sideLength);
      ctx.stroke();

      if (i % 2 === 0) {
        x += sideLength;
      } else {
        y -= sideLength;
      }

      if (x > fibWidth / 2 || y < -fibHeight / 2) break;
    }

    ctx.restore();
  }

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'fibonacci_overlay.png';
    link.click();
  };

  
  return (
    <>
      <Head>
        <title>Fibonacci Overlay</title>
        <meta name="description" content="Draw Fibonacci sequence over an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Fibonacci Overlay
        </h1>
        <h2 className={styles.description}>
          Draw Fibonacci sequence over an image
        </h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <canvas 
          ref={canvasRef}
          style={{
            border: '1px solid #333',
            borderRadius: '5px',
            maxWidth: '100%',
            height: 'auto',
            width: '100%'
          }}
        />
        <div>
          <label>Fibonacci Rectangle Width: 
            <input type="range" min="100" max="2000" value={fibWidth} onChange={(e) => setFibWidth(parseInt(e.target.value))} />
            <input type="number" min="100" max="2000" value={fibWidth} onChange={(e) => setFibWidth(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>Fibonacci Rectangle Height: 
            <input type="range" min="100" max="2000" value={fibHeight} onChange={(e) => setFibHeight(parseInt(e.target.value))} />
            <input type="number" min="100" max="2000" value={fibHeight} onChange={(e) => setFibHeight(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>Iterations: 
            <input type="range" min="3" max="10" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value))} />
            {iterations}
          </label>
        </div>
        <div>
          <label>Center X: 
            <input type="range" min={-canvasRef.current?.width / 2 || -400} max={canvasRef.current?.width / 2 || 400} value={centerX} onChange={(e) => setCenterX(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>Center Y: 
            <input type="range" min={-canvasRef.current?.height / 2 || -250} max={canvasRef.current?.height / 2 || 250} value={centerY} onChange={(e) => setCenterY(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>Rotation (degrees): 
            <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
            <input type="number" min="0" max="360" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>Scale X: 
            <input type="range" min="0.1" max="3" step="0.1" value={scaleX} onChange={(e) => setScaleX(parseFloat(e.target.value))} />
            {scaleX.toFixed(1)}
          </label>
        </div>
        <div>
          <label>Scale Y: 
            <input type="range" min="0.1" max="3" step="0.1" value={scaleY} onChange={(e) => setScaleY(parseFloat(e.target.value))} />
            {scaleY.toFixed(1)}
          </label>
        </div>
        <div>
          <label>Scale: 
            <input type="range" min="0.1" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
            {scale.toFixed(1)}
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={flipHorizontal} onChange={(e) => setFlipHorizontal(e.target.checked)} />
            Flip Horizontally
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={flipVertical} onChange={(e) => setFlipVertical(e.target.checked)} />
            Flip Vertically
          </label>
        </div>
        <div>
          <label>Overlay Color: 
            <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Line Thickness: 
            <input type="range" min="1" max="10" value={lineThickness} onChange={(e) => setLineThickness(parseInt(e.target.value))} />
            {lineThickness}px
          </label>
        </div>
        <button onClick={downloadImage}>Download</button>
      </main>
    </>
  )
}
