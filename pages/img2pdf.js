import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { jsPDF } from 'jspdf'

export default function JpegToPdf() {
  
  const [photos, setPhotos] = useState([])
  
  const handleFileChange = (e) => {
  const files = Array.from(e.target.files)
  setPhotos(files)
  }
  
  const handleDownload = async () => {
    if (photos.length === 0) return

    const pdf = new jsPDF()
    
    for (let index = 0; index < photos.length; index++) {
      const photo = photos[index]
      const imgData = await readFileAsDataURL(photo)
      const { width, height } = await getImageDimensions(imgData)
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfWidth / width, pdfHeight / height)
      const scaledWidth = width * ratio
      const scaledHeight = height * ratio
      const x = (pdfWidth - scaledWidth) / 2
      const y = (pdfHeight - scaledHeight) / 2
      
      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight)
      if (index < photos.length - 1) {
        pdf.addPage()
      }
    }
    
    pdf.save('photos.pdf')
  }
  
  const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  }
  
  const getImageDimensions = (src) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = src
  })
  }
  
  return (
  <div className={styles.container}>
    <Head>
    <title>Images to PDF</title>
    <meta name="description" content="Convert multiple images to a single PDF." />
    <link rel="icon" href="/favicon.ico" />
    </Head>
  
    <main className={styles.main}>
    <h1 className={styles.title}>
      Images to PDF
    </h1>
    <h2 className={styles.description}>
      Download multiple images as a single PDF
    </h2>
    
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '20px'
    }}>
      <div>
      <label style={{
        marginBottom: '10px',
        fontSize: '16px',
        display: 'flex',
        color: '#888',
      }}>Choose your photos</label>
      <input type="file" multiple onChange={handleFileChange} />
      </div>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
      }}>
      {photos.map((photo, index) => (
        <img key={index} width={200} src={URL.createObjectURL(photo)} />
      ))}
      </div>
      <div style={{
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center'
      }}>
      <button onClick={handleDownload}>Download PDF</button>
      </div>
    </div>
    </main>
  </div>
  )
}
