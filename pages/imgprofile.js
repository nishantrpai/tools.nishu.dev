import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function ColorProfile() {
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [hex, setHex] = useState('')
  const [rgb, setRgb] = useState('')
  const [hsl, setHsl] = useState('')
  const [cmyk, setCmyk] = useState('')
  const [image, setImage] = useState('')

  const isLightColor = (hex) => {
    const rgb = parseInt(hex.replace('#', ''), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return luma > 200
  }

  const getColorProfileFromImage = async (image) => {
    let dominantColor = '';
    let img = new Image();
    img.src = image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let colorCounts = {};
      let maxCount = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        let r = imageData[i];
        let g = imageData[i + 1];
        let b = imageData[i + 2];
        let rgb = `rgb(${r},${g},${b})`;
        
        if (colorCounts[rgb]) {
          colorCounts[rgb]++;
        } else {
          colorCounts[rgb] = 1;
        }

        if (colorCounts[rgb] > maxCount) {
          maxCount = colorCounts[rgb];
          dominantColor = rgb;
        }
      }

      setColor(dominantColor);
      updateColorProfile(dominantColor);
    }
  }

  const updateColorProfile = (color) => {
    setHex(rgbToHex(color));
    setRgb(color);
    setHsl(rgbToHsl(color));
    setCmyk(rgbToCmyk(color));
  }

  const rgbToHex = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g);
    return "#" + ((1 << 24) + (+r << 16) + (+g << 8) + +b).toString(16).slice(1);
  }

  const rgbToHsl = (rgb) => {
    let [r, g, b] = rgb.match(/\d+/g).map(Number);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  const rgbToCmyk = (rgb) => {
    let [r, g, b] = rgb.match(/\d+/g).map(Number);
    r /= 255; g /= 255; b /= 255;
    
    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k) || 0;
    let m = (1 - g - k) / (1 - k) || 0;
    let y = (1 - b - k) / (1 - k) || 0;

    return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`;
  }

  return (
    <>
      <Head>
        <title>Color Profile</title>
        <meta name="description" content="Get color profile of any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          Color Profile
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Get color profile of any image
        </span>
        <input type="file" onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
            getColorProfileFromImage(reader.result);
          }
          reader.readAsDataURL(file);
        }} />
        <div style={{ marginTop: 20, display: 'flex', gap: 0, flexDirection: 'row', justifyContent: 'space-between', width: '1000px' }} id="color-square">

          {hex && (
            <div style={{
              whiteSpace: 'pre-wrap',
              flexBasis: '50%',
              textAlign: 'left',
              background: '#000',
              width: '100%',
              lineHeight: 1.5
            }}>
              <div style={{
                width: '100%',
                height: '520px',
                borderRadius: '10px 0 0px 10px',
                position: 'relative',
                background: hex,
                backgroundSize: 'cover',
              }}>
                <div style={{
                  bottom: 10,
                  position: 'absolute',
                  padding: 10,
                  color: isLightColor(hex) ? '#000' : '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  textTransform: 'uppercase',
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: 24 }}>{hex}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {rgb}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {hsl}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {cmyk}</span>
                </div>
              </div>
            </div>
          )}
          <div style={{
            borderRadius: '0 10px 10px 0',
            flexBasis: '50%',
            maxWidth: '500px', height: '520px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />

        </div>
        {/* download */}
        {hex && (
          <button onClick={() => {
            html2canvas(document.getElementById('color-square'), {
              backgroundColor: '#000'
            }).then(function (canvas) {
              var a = document.createElement('a');
              a.href = canvas.toDataURL("image/png");
              a.download = 'color.png';
              a.click();
            });
          }} className={styles.button}>
            Download Color Profile
          </button>)}
      </main>
    </>
  )
}
