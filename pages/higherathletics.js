import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherAthletics() {
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [distance, setDistance] = useState('')
  const [bg, setBg] = useState(null)
  const arrow = '/arrow.png'

  const handleImage = async (event) => {
    // set image as bg usestate not canvas
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setBg(event.target.result);
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    // draw image on canvas
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    if (bg) {
      const image = new Image();
      image.src = bg;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        console.log('drawing img')
        // draw a translacent #000 bg
        context.fillRect(0, 0, image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);
        context.fillStyle = 'rgba(0, 0, 0, 0.25)';
        context.fillRect(0, 0, image.width, image.height);
        const arrowImg = new Image();
        arrowImg.src = arrow;
        arrowImg.onload = () => {
          // should be relative to image size
          context.drawImage(arrowImg, (image.width / 2) - (image.width/25.5), 50, image.width / 12, image.width / 12);
        }
        // font should be relative to image size
        let fontSize = image.width/12
        console.log('font size', fontSize)
        context.font = `bold ${fontSize}px Helvetica`;
        context.fillStyle = 'white';
        // draw in center
        context.textAlign = 'left';
        // draw above location
        let x = (image.width / 20) + 20
        context.fillText('HIGHER ATHLETICS:', x, image.height / 2 - fontSize);
        context.fillText(location.toUpperCase(), x, image.height / 2);
        let subFontSize = fontSize / 3
        context.font = `bold ${subFontSize}px Helvetica`;
        context.fillText('DISTANCE:    ' + distance.toUpperCase(), x + (image.width/2.25) , image.height / 2 + fontSize);
        context.fillText('DATE:            ' + date.toUpperCase(), x + (image.width/2.25) , image.height / 2 + fontSize + (2 * subFontSize));
        context.fillText('TIME:             ' + time.toUpperCase(), x + (image.width/2.25) , image.height / 2 + fontSize + (4 * subFontSize));
        // context.fillText(date, 50, 100);
        // context.fillText(time, 50, 150);
        // context.fillText(distance, 50, 200);
      }
    }
  }, [bg, location, date, time, distance])

  return (
    <>
      <Head>
        <title>Higher Athletics</title>
        <meta name="description" content="Create higher athletics event poster" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Athletics
        </h1>
        <h2 className={styles.description}>
          Create higher athletics event poster
        </h2>
        <canvas style={{width: '100%', height: '100%'}}/>
        <input type="file" accept="image/*" onChange={handleImage} />
        <input type="text" placeholder="Location" onChange={(event) => setLocation(event.target.value)} 
        style={{
          marginTop: 20,
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          backgroundColor: '#000',
          outline: 'none',
          color: '#fff',
        }}/>
        <input type="text" placeholder="Distance" onChange={(event) => setDistance(event.target.value)}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          backgroundColor: '#000',
          outline: 'none',
          color: '#fff',
        }}/>
        <input type="text" placeholder="Date" onChange={(event) => setDate(event.target.value)} 
        style={{
          marginTop: 20,
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          backgroundColor: '#000',
          outline: 'none',
          color: '#fff',
        }}/>
        <input type="text" placeholder="Time" onChange={(event) => setTime(event.target.value)} 
        style={{
          marginTop: 20,
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          backgroundColor: '#000',
          outline: 'none',
          color: '#fff',
        }}/>
      </main>
    </>
  )

}