// duplicate same photo (user input type file) n times (user input), download as zip
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'

export default function DuplicatePhotos() {
  
    const [photos, setPhotos] = useState([])
    const [numberOfDuplicates, setNumberOfDuplicates] = useState(1)
  
    const handleFileChange = (e) => {
      const files = e.target.files
      setPhotos(files)
    }
  
    const handleDuplicateChange = (e) => {
      const value = e.target.value
      setNumberOfDuplicates(value)
    }
  
    const handleDownload = () => {
      const zip = new JSZip()
      // if no photo, return
      if (photos.length === 0) return
      for (let i = 0; i < numberOfDuplicates; i++) {
        zip.file(`${i+1}.jpg`, photos[0])
      }
      zip.generateAsync({type:"blob"})
        .then(content => {
          // create content as photos.zip and download
          const a = document.createElement('a')
          const url = URL.createObjectURL(content)
          a.href = url
          a.download = 'photos.zip'
          a.click()
          URL.revokeObjectURL(url)
          
        })
    }
  
    return (
      <div className={styles.container}>
        <Head>
          <title>Duplicate Photos</title>
          <meta name="description" content="Duplicate same photo many times." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.main}>
          <h1 className={styles.title}>
            Duplicate Photos
          </h1>
  
          <p style={{
            color: '#888',
            fontSize: '16px',
            margin: '20px 0',
            width: '100%',
            textAlign: 'center'
          }}>
            Duplicate same photo many times and download as zip
          </p>
  
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
              }}>Choose your photo</label>
              <input type="file" onChange={handleFileChange} />
            </div>
            <img width={500} src={photos.length > 0 ? URL.createObjectURL(photos[0]) : ''} />
            <div>
              <label style={{
                marginBottom: '10px',
                fontSize: '16px',
                display: 'flex',
                color: '#888',
              }}>Number of duplicates</label>
              <input type="number" value={numberOfDuplicates} onChange={handleDuplicateChange}  style={{
                fontSize: '16px',
                padding: '5px',
                borderRadius: '5px',
                width: '100%',
                border: '1px solid #000'
              }}/>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <button onClick={handleDownload}>Download</button>
            </div>
          </div>
        </main>
      </div>
    )
  }

       