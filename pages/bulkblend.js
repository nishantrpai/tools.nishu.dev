import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [images, setImages] = useState([])
  const [opacity, setOpacity] = useState(1)
  const allBlends = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
  const [files, setFiles] = useState([])
  const [batchCount, setBatchCount] = useState(1)
  const [blendBatches, setBlendBatches] = useState([])
  const observerRef = useRef(null)
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [currentBatchInfo, setCurrentBatchInfo] = useState('')
  const [currentProcessing, setCurrentProcessing] = useState([])

  const handleImages = async (e) => {
    setCurrentProcessing([])
    const fileList = e.target.files
    setFiles(Array.from(fileList))
    setImages([])
    setBlendBatches([]) // Reset batches
    setBatchCount(1) // Reset batch count
    if (!fileList) return
    for (let i = 0; i < fileList.length; i++) {
      const image = await loadImage(fileList[i])
      setImages(prevImages => [...prevImages, image])
    }
  }

  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          resolve(image)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const getImageCombinations = (batchNum) => {
    const combinations = []
    // Only include previous results if we have any batches
    const previousResults = blendBatches.length > 0 
      ? blendBatches.flatMap(batch => batch.results || [])
      : [];
    const allSources = [...images, ...previousResults];
    
    // For first batch, only combine original images
    if (batchNum === 1 || blendBatches.length === 0) {
      for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
          combinations.push({
            img1: images[i],
            img2: images[j],
            name1: files[i].name,
            name2: files[j].name,
            index1: i,
            index2: j
          })
        }
      }
    } else {
      // For subsequent batches, blend previous results with everything
      const lastBatchIndex = blendBatches.length - 1;
      const previousBatch = blendBatches[lastBatchIndex]?.results || [];
      
      if (previousBatch.length > 0) {
        for (let i = 0; i < previousBatch.length; i++) {
          for (let j = 0; j < allSources.length; j++) {
            combinations.push({
              img1: previousBatch[i],
              img2: allSources[j],
              name1: `Blend${batchNum-1}_${i}`,
              name2: j < images.length ? files[j].name : `Blend${Math.floor(j/images.length)}_${j%images.length}`,
              index1: i,
              index2: j
            })
          }
        }
      }
    }
    return combinations;
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const downloadImage = (canvas) => {
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `blended-image-${Date.now()}.png`
    a.click()
  }

  const renderCanvas = (image1, image2, canvas, blendMode) => {
    const ctx = canvas.getContext('2d')
    canvas.width = 400 // Set fixed width for better performance
    canvas.height = 400 // Set fixed height for better performance
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // First image
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    
    // Second image
    ctx.globalAlpha = opacity
    ctx.globalCompositeOperation = blendMode
    ctx.drawImage(image2, 0, 0, canvas.width, canvas.height)
    
    return canvas
  }

  const createBlendResult = (canvas) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.src = canvas.toDataURL('image/png')
      img.onload = () => resolve(img)
    })
  }

  const handleScroll = (entries) => {
    if (entries[0].isIntersecting) {
      setBatchCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      observerRef.current = new IntersectionObserver(handleScroll, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      })
      observerRef.current.observe(containerRef.current)
    }
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    async function processNewBatch() {
      if (images.length >= 2 && !loading) {
        setLoading(true)
        try {
          const combinations = getImageCombinations(batchCount)
          if (combinations.length === 0) {
            setLoading(false)
            return
          }

          setCurrentBatchInfo(`Processing batch ${batchCount}: Starting...`)
          const batchResults = []
          const canvas = document.createElement('canvas')
          let processedCount = 0
          
          for (const combo of combinations) {
            for (const blend of allBlends) {
              renderCanvas(combo.img1, combo.img2, canvas, blend)
              const blendResult = await createBlendResult(canvas)
              batchResults.push(blendResult)
              processedCount++
              
              // Add to current processing results immediately
              setCurrentProcessing(prev => [...prev, {
                result: blendResult,
                combo,
                blend,
                batchNum: batchCount,
                index: processedCount - 1
              }])
              
              setCurrentBatchInfo(`Processing batch ${batchCount}: ${processedCount}/${combinations.length * allBlends.length} blends complete`)
              // Small delay to allow UI to update
              await new Promise(resolve => setTimeout(resolve, 10))
            }
          }

          // Move current processing to completed batch
          setBlendBatches(prev => [...prev, {
            batchNum: batchCount,
            combinations,
            results: batchResults
          }])
          setCurrentProcessing([])
          setCurrentBatchInfo('')
        } catch (error) {
          console.error('Blend processing error:', error)
          setCurrentBatchInfo('Error processing batch')
        }
        setLoading(false)
      }
    }
    processNewBatch()
  }, [batchCount, images])

  return (
    <>
      <Head>
        <title>Bulk Blend Layer</title>
        <meta name="description" content="Bulk blend a layer onto images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{maxWidth: '100vw', padding: '0 1rem', height: '200vh'}}>
        <h1 className={styles.title}>Blend Layer</h1>
        <p className={styles.description}>Select multiple images to see all possible blend combinations</p>

        <div className={styles.searchContainer}>
          <input type='file' onChange={handleImages} multiple />
          <input 
            type='range' 
            min='0' 
            max='1' 
            step='0.01' 
            value={opacity} 
            onChange={handleOpacity} 
          />
          {loading && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              {currentBatchInfo}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', // Increased size
          gap: '0.5rem',
          padding: '0.5rem',
          width: '100%',
          maxWidth: '2400px',
          margin: '0 auto'
        }}>
          {/* Show completed batches */}
          {blendBatches.map((batch, batchIndex) => (
            batch.combinations.map((combo, i) => (
              allBlends.map((blend, k) => {
                const resultIndex = i * allBlends.length + k
                const result = batch.results[resultIndex]
                return result ? (
                  <div key={`${batchIndex}-${i}-${k}`} style={{
                    border: '1px solid #111',
                    borderRadius: '4px',
                    padding: '0.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '0.7rem'
                  }}>
                    <img 
                      src={result.src}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        cursor: 'pointer',
                        borderRadius: '2px'
                      }} 
                      onDoubleClick={(e) => {
                        const canvas = document.createElement('canvas')
                        renderCanvas(combo.img1, combo.img2, canvas, blend)
                        downloadImage(canvas)
                      }}
                      title={`Double click to download`}
                    />
                    <div style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      <div style={{fontWeight: 'bold'}}>{blend}</div>
                      <div style={{color: '#666', fontSize: '0.65rem'}}>
                        Batch {batch.batchNum}: {combo.name1.slice(0, 10)}... + {combo.name2.slice(0, 10)}...
                      </div>
                      <div style={{color: '#888', fontSize: '0.65rem'}}>
                        {Math.round(opacity * 100)}% opacity
                      </div>
                    </div>
                  </div>
                ) : null
              })
            ))
          ))}

          {/* Show currently processing blends */}
          {currentProcessing.map((item, index) => (
            <div key={`processing-${index}`} style={{
              border: '1px solid #111',
              borderRadius: '4px',
              padding: '0.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.7rem',
              animation: 'fadeIn 0.3s ease-in',
              background: '#000'
            }}>
              <img 
                src={item.result.src}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }} 
                onDoubleClick={() => {
                  const canvas = document.createElement('canvas')
                  renderCanvas(item.combo.img1, item.combo.img2, canvas, item.blend)
                  downloadImage(canvas)
                }}
                title={`Double click to download`}
              />
              <div style={{
                width: '100%',
                marginTop: '0.25rem',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                <div style={{fontWeight: 'bold'}}>{item.blend}</div>
                <div style={{color: '#666', fontSize: '0.65rem'}}>
                  Processing Batch {item.batchNum}: {item.combo.name1.slice(0, 10)}... + {item.combo.name2.slice(0, 10)}...
                </div>
                <div style={{color: '#888', fontSize: '0.65rem'}}>
                  {Math.round(opacity * 100)}% opacity
                </div>
              </div>
            </div>
          ))}
          
          <div ref={containerRef} style={{ height: '20px' }} />
        </div>
      </main>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}