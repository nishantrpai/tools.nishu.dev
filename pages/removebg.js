import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { removeBackground } from '@imgly/background-removal'

export default function RemoveBg() {
  const [img, setImg] = useState(null)
  const [processedImg, setProcessedImg] = useState(null)
  const [loading, setLoading] = useState(false)

  const removeBg = async (imageSrc) => {
    try {
      setLoading(true)
      const blob = await removeBackground(imageSrc)
      const url = URL.createObjectURL(blob)
      setLoading(false)
      return url
    } catch (error) {
      console.error('Background removal failed:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!img) return
    removeBg(img).then((processedImg) => {
      setProcessedImg(processedImg)
    })
  }, [img])

  return (
    <>
      <Head>
        <title>Remove Background</title>
        <meta name="description" content="Remove background from any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Remove Background
        </h1>
        <h2 className={styles.description}>
          Remove background from any image
        </h2>
        {processedImg && (
          <img src={processedImg} alt="Processed image" style={{ maxWidth: '100%', border: '1px solid #333', borderRadius: 10 }} />
        )}
        <span>
          {loading ? 'Removing background...' : 'Upload image'}
        </span>
        
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(URL.createObjectURL(file))
          }}
        />
        {processedImg && (
          <button
            onClick={() => {
              const a = document.createElement('a')
              a.href = processedImg
              a.download = 'removed_background.png'
              a.click()
            }}
          >
            Download
          </button>
        )}
      </main>
    </>
  )
}
