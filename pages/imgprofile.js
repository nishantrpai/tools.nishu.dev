// simple tool for getting color profile of any hex
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function ColorProfile() {
  const [color, setColor] = useState('#000000')
  const [loading, setLoading] = useState(false)
  const [hex, setHex] = useState('')
  const [rgb, setRgb] = useState('')
  const [hsl, setHsl] = useState('')
  const [cmyk, setCmyk] = useState('')
  const [colorName, setColorName] = useState('')
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
      let color = {};
      for (let i = 0; i < imageData.length; i += 4) {
        let r = imageData[i];
        let g = imageData[i + 1];
        let b = imageData[i + 2];
        let rgb = `rgb(${r},${g},${b})`;
        if (color[rgb]) {
          color[rgb]++;
        } else {
          color[rgb] = 1;
        }
      }
      let max = 0;
      for (let key in color) {
        console.log(key, color[key]);
        if (color[key] > max && key !== 'rgb(0,0,0)') {
          max = color[key];
          dominantColor = key;
        }
      }
      console.log(dominantColor);
      setColor(dominantColor);
      
    }
  }

  useEffect(() => {
    if (color) {
      getColorProfile()
    }
  }, [color])

  // make prompt to /api/gpt asking for color profile of the hex as json
  const getColorProfile = async () => {
    setLoading(true)
    let prompt = `given the color: ${color}, provide the color profile as json including hex, rgb, hsl, cmyk, and color name. Keys should be hex, rgb, hsl, cmyk, and colorName. Provide valid hex, will be used as bg. Only 1 level json, don't make sub keys. Rgb should be rgb() or rgba(). E.g., of response {"hex": "#000000", "rgb": "rgb(0,0,0)", "hsl": "hsl(0,0%,0%)", "cmyk": "cmyk(0,0,0,100)", "colorName": "black"}`;

    const res = await fetch(`/api/gpt?prompt`, {
      method: 'POST',
      body: JSON.stringify({
        prompt
      })
    })
    let { response: data } = await res.json()
    data = JSON.parse(data)
    setHex(data.hex)
    setRgb(data.rgb)
    setHsl(data.hsl)
    setCmyk(data.cmyk)
    setColorName(data.colorName)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Color Profile</title>
        <meta name="description" content="Get color profile of any color" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          Color Profile
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Get color profile of any color
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
        <div style={{ marginTop: 20, display: 'flex', gap: 20, flexDirection: 'row', justifyContent: 'space-between', width: '1000px' }}>
          <div style={{
            borderRadius: 10, flexBasis: '50%', border: '1px solid #333', maxWidth: '500px', height: '520px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
          }} />

          {hex && (
            <div style={{ whiteSpace: 'pre-wrap', flexBasis: '50%', textAlign: 'left', border: '1px solid #333', background: '#000', borderRadius: 10, width: '100%', lineHeight: 1.5 }}>
              <div style={{
                width: '100%',
                height: '520px',
                borderRadius: 10,
                position: 'relative',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }} id="color-square">
                <div style={{
                  bottom: 10,
                  position: 'absolute',
                  padding: 10,
                  color: isLightColor(hex) ? '#000' : '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  textTransform: 'uppercase',
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: 24 }}>{colorName}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {hex}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {rgb}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {hsl}</span>
                  <span style={{ fontSize: 12, opacity: '0.75' }}> {cmyk}</span>
                </div>
              </div>
            </div>
          )}

        </div>
        {/* download */}
        {hex && (
          <button onClick={() => {
            html2canvas(document.getElementById('color-square'), {
              backgroundColor: 'transparent'
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
