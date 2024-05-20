// Extract images from a PDF/Docx/Doc/PPTX/PPT file
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'

export default function ExtractImages() {
  const handleFileChange = (e) => {
    console.log(e.target.files)
    // extract images from the files
    let files = e.target.files
    if (files.length === 0) return
    files = Array.from(files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        console.log('loaded')
      }
      reader.readAsDataURL(file)
    })
  }
  const handleDownload = (e) => {
    console.log('download')
  }
  return (
    <div className={styles.container}>
    <Head>
      <title>Extract Images</title>
      <meta name="description" content="Extract images from a PDF/Docx/Doc/PPTX/PPT file." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>
        Extract Images
      </h1>

      <p style={{
        color: '#888',
        fontSize: '16px',
        margin: '20px 0',
        width: '100%',
        textAlign: 'center'
      }}>
        Extract images from a PDF/Docx/Doc/PPTX/PPT file
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
          <input type="file" onChange={handleFileChange} style={{border: '1px solid #333'}}/>
        </div>
        <div>
          <label style={{
            marginBottom: '10px',
            fontSize: '16px',
            display: 'flex',
            color: '#888',
          }}>Number of duplicates</label>
          {/* <input type="number" value={numberOfDuplicates} onChange={handleDuplicateChange}  style={{
            fontSize: '16px',
            padding: '5px',
            borderRadius: '5px',
            width: '100%',
            border: '1px solid #000'
          }}/> */}
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
