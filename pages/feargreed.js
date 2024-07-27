import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';

const RealTimeBTCUSD = () => {
  const canvasRef = useRef(null);
  const [testData, setTestData] = useState([]);
  // const [maxPrice, setMaxPrice] = useState(0);
  const zoomFactor = 2;

  useEffect(() => {
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 300000);
    return () => clearInterval(interval);
  }, []);


  const fetchTickerData = async () => {
    const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=120');
    const data = await response.json();
    let formattedData = data.map((item, index) => formatTickerData(item, index));
    // remove empty data
    formattedData = formattedData.filter((d) => d.y !== 0);
    const maxPrice2 = Math.max(...formattedData.map((d) => d.y));
    console.log(formattedData.length, 'formattedData');
    console.log(testData.length, 'testData');
    normalizeHeight(formattedData);
    setTestData(formattedData);
    // optimizeCanvas();
    
    renderChart(formattedData, { maxPrice: maxPrice2 });

  };

  const formatTickerData = (candle, offset) => {
    let x = offset;
    let h = Math.ceil(Math.abs(parseFloat(candle[1]) - parseFloat(candle[4])));
    let y = parseFloat(candle[2]);
    return { x, h, y, normalized: false };
  };

  const normalizeHeight = (data) => {
    let mean = data.map((d) => (d.normalized ? 0 : d.y)).reduce((a, b) => a + b, 0);
    let max = Math.ceil(Math.max(...data.map((d) => d.y)));
    console.log(max, 'max');
    // setMaxPrice(max);
    mean = mean / data.length;
    data.forEach((d) => {
      if (!d.normalized) {
        d.y = d.y - mean + 1;
        d.normalized = true;
      }
    });
  };

  const optimizeCanvas = () => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    const scaleFactor = 1.25;
    canvas.width = width * window.devicePixelRatio * scaleFactor;
    canvas.height = height * window.devicePixelRatio * scaleFactor;
    canvas.style.width = `${width * scaleFactor}px`;
    canvas.style.height = `${height * scaleFactor}px`;
  };

  const renderGrid = (maxPrice, min) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width; i += 10) {
      for (let j = 0; j < canvas.height; j += 10) {
        ctx.beginPath();
        ctx.rect(i, j, 10, 10);
        ctx.strokeStyle = '#222';
        ctx.stroke();
      }
    }
    ctx.font = '40px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`$${maxPrice}`, 0, 50);
    ctx.fillText(`$${min}`, 0, canvas.height - 10);
  };

  const slopeNature = (arr) => arr[arr.length - 1].y - arr[0].y;

  const renderChart = (data, { maxPrice }) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scaleFactor = 1;
    let text = '';
    let charPos = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderGrid(maxPrice, 0);
    for (let i = 0; i < data.length; i++) {
      let { x, h, y } = data[i];
      if (!text) {
        let nature = slopeNature(data.slice(i, i + 6));
        text = nature > -1 ? 'GREED' : 'FEAR';
      }
      y = parseInt(y);
      ctx.beginPath();
      ctx.rect(x * 60, -y + 1000, 50, -h * zoomFactor * scaleFactor);
      ctx.stroke();
      ctx.closePath();
      drawLetter(text[charPos % text.length], x * 60, -y + 1000, h * zoomFactor * scaleFactor);
      charPos++;
      if ((text[i] === 'R' || text[i] === 'D') && charPos === text.length) {
        text = '';
        charPos = 0;
      }
    }
  };

  const drawLetter = (letter, x, y, h) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const letterGrids = {
      A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ],
      B: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
      ],
      C: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1]
      ],
      D: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
      ],
      E: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]
      ],
      F: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0]
      ],
      G: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1]
      ],
      H: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ],
      I: [
        [1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1]
      ],
      J: [
        [0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 0]
      ],
      K: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1]
      ],
      L: [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]
      ],
      M: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ],
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1]
      ],
      O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
      ],
      P: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0]
      ],
      Q: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0],
        [0, 1, 1, 1, 1]
      ],
      R: [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
      ],
      S: [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
      ],
      T: [
        [1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
      ],
      U: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0]
      ],
      V: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0]
      ],
      W: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1]
      ],
      X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
      ],
      Y: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
      ],
      Z: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1]
      ]
    };

    const grid = letterGrids[letter];
    const gridSize = 10;
    let letterHeight = grid.length * gridSize;
    const startX = x;
    const startY = y - h;
    if (letterHeight < h) {
      while (letterHeight < h) {
        grid.splice(Math.floor(grid.length / 2), 0, grid[1]);
        letterHeight = grid.length * gridSize;
      }
    }
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 1) {
          const rectX = startX + j * gridSize;
          const rectY = startY + i * gridSize;
          ctx.fillStyle = 'white';
          ctx.fillRect(rectX, rectY, gridSize, gridSize);
        }
      }
    }
  };

  const screenshot = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = `feargreed-${new Date().toISOString()}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <>
      <Head>
        <title>Fear Greed</title>
        <link
          href="https://fonts.cdnfonts.com/css/sf-mono"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Real Time BTC/USD Price</h1>
        <h2 className={styles.description}>
          BTC/USD chart visualized in real time (every 5 minutes)
        </h2>

        <canvas
          id="myChart"
          ref={canvasRef}
          width={1500}
          height={1500}
          style={{
            backgroundColor: '#000',
            width: '100%',
            overflow: 'scroll',
            width: '500px',
            height: '500px',
            border: '1px solid #111',
            borderRadius: 10
          }}
        ></canvas>
        <button id="screenshot" aria-label="Screenshot" onClick={screenshot}>
          <i className="fa fa-camera" aria-hidden="true"></i> Screenshot
        </button>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block', marginTop: 20 }}>
          original by <a href="https://x.com/jackbutcher/status/1678791908989222913" target="_blank" style={{color: '#fff'}}>jackbutcher</a>
        </span>
      </main>
    </>
  );
};

export default RealTimeBTCUSD;
