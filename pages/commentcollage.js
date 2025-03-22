import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FiRepeat } from 'react-icons/fi'

export default function CommentCollage() {
  const canvasRef = useRef(null)
  const [bgImage, setBgImage] = useState(null)
  const [comments, setComments] = useState([])
  const [canvasWidth, setCanvasWidth] = useState(1000)
  const [canvasHeight, setCanvasHeight] = useState(1000)
  const [collageDataUrl, setCollageDataUrl] = useState('')
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(-1)
  const [template, setTemplate] = useState('grid') // new state

  const handleBgImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setBgImage(file)
      const img = await loadImage(file)
      setCanvasWidth(img.width)
      setCanvasHeight(img.height)
    }
  }

  const handleCommentImagesChange = (e) => {
    const files = Array.from(e.target.files)
    const newComments = files.map(file => ({
      file,
      x: 0,
      y: 0,
      scale: 1,
      isLocked: false
    }))
    setComments([...comments, ...newComments])
  }

  const updateCommentPosition = (index, changes) => {
    setComments(comments.map((comment, i) =>
      i === index ? { ...comment, ...changes } : comment
    ))
  }

  const toggleLock = (index) => {
    // setComments(comments.map((comment, i) =>
    //   i === index ? { ...comment, isLocked: !comment.isLocked } : comment
    // ))
    if (selectedCommentIndex === index) {
      setSelectedCommentIndex(-1)
    }
  }

  const createCollage = async () => {
    if (!bgImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image
    const bgImg = await loadImage(bgImage)
    ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight)

    // Draw each comment
    for (const comment of comments) {
      const img = await loadImage(comment.file)
      const width = img.width * comment.scale
      const height = img.height * comment.scale
      ctx.drawImage(img, comment.x, comment.y, width, height)
    }

    setCollageDataUrl(canvas.toDataURL())
  }

  const loadImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.src = URL.createObjectURL(file)
    })
  }

  const arrangeComments = async (template) => {
    if (!comments.length || !bgImage) return;
    
    const bgImg = await loadImage(bgImage)
    // Reduce target area to 5% of background
    const targetArea = (bgImg.width * bgImg.height) * 0.2

    const commentImages = await Promise.all(
      comments.map(comment => loadImage(comment.file))
    )

    const newComments = [...comments]
    
    // Improved scaling calculation
    commentImages.forEach((img, i) => {
      const currentArea = img.width * img.height
      const scaleFactor = Math.sqrt(targetArea / currentArea)
      // More conservative scale limits
      newComments[i].scale = Math.min(Math.max(scaleFactor, 0.1), 1)
    })

    switch (template) {
      case 'circle':
        const radius = Math.min(canvasWidth, canvasHeight) * 0.4
        const center = { x: canvasWidth / 2.5, y: canvasHeight / 2.5 }
        comments.forEach((_, i) => {
          const angle = (i / comments.length) * 2 * Math.PI
          newComments[i].x = center.x + radius * Math.cos(angle)
          newComments[i].y = center.y + radius * Math.sin(angle)
        })
        break

      case 'pile':
        const centerX = canvasWidth / 2
        const centerY = canvasHeight / 2
        const spread = Math.min(canvasWidth, canvasHeight) * 0.3
        comments.forEach((_, i) => {
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * spread
          newComments[i].x = centerX + Math.cos(angle) * distance
          newComments[i].y = centerY + Math.sin(angle) * distance
        })
        break

      case 'pinterest':
        const columns = Math.min(5, Math.ceil(Math.sqrt(comments.length)))
        const columnWidth = canvasWidth / columns
        const columns_heights = new Array(columns).fill(50)
        const horizontalPadding = columnWidth * 0.1
        
        comments.forEach((_, i) => {
          const shortestColumn = columns_heights.indexOf(Math.min(...columns_heights))
          newComments[i].x = (shortestColumn * columnWidth) + horizontalPadding
          newComments[i].y = columns_heights[shortestColumn]
          columns_heights[shortestColumn] += 200 // Reduced vertical spacing
        })
        break

      case 'random':
        const padding = Math.min(canvasWidth, canvasHeight) * 0.1
        comments.forEach((_, i) => {
          newComments[i].x = padding + Math.random() * (canvasWidth - padding * 2)
          newComments[i].y = padding + Math.random() * (canvasHeight - padding * 2)
          // Add slight random rotation
          newComments[i].rotation = (Math.random() - 0.5) * 30 // -15 to +15 degrees
        })
        break

      case 'grid':
        const perRow = Math.ceil(Math.sqrt(comments.length))
        const cellWidth = canvasWidth / perRow
        const cellHeight = canvasHeight / perRow
        comments.forEach((_, i) => {
          const row = Math.floor(i / perRow)
          const col = i % perRow
          newComments[i].x = col * cellWidth + cellWidth * 0.2
          newComments[i].y = row * cellHeight + cellHeight * 0.2
        })
        break
    }

    setComments(newComments)
  }

  useEffect(() => {
    createCollage()
  }, [bgImage, comments, canvasWidth, canvasHeight])

  useEffect(() => {
    const handlePaste = async (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const file = item.getAsFile();
          const newComment = {
            file,
            x: 0,
            y: 0,
            scale: 1,
            isLocked: false
          };
          setComments(prev => [...prev, newComment]);
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const templateButtons = (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
      <select 
        value={template} 
        onChange={(e) => {
          setTemplate(e.target.value)
          arrangeComments(e.target.value)
        }}
      >
        <option value="grid">Grid</option>
        <option value="circle">Circle</option>
        <option value="pile">Photo Pile</option>
        <option value="pinterest">Pinterest</option>
        <option value="random">Random</option>
      </select>
      <button style={{height: 40, width: 40}} onClick={() => arrangeComments(template)}>
        <FiRepeat /> 
      </button>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Comment Collage</title>
        <meta name="description" content="Create a comment collage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Comment Collage</h1>
        <h2 className={styles.description}>Create a collage with comments</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <label style={{ color: '#888' }}>Background Image</label>
            <input type="file" accept="image/*" onChange={handleBgImageChange} />
          </div>

          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <label style={{ color: '#888' }}>Add Comments</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="file" multiple accept="image/*" onChange={handleCommentImagesChange} />
              <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                💡 Tip: You can also paste images directly (Ctrl/Cmd + V).
              </p>
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'max-content' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
            {comments.map((comment, index) => (
              <button onClick={() => {
                if (selectedCommentIndex === index) {
                  setSelectedCommentIndex(-1)
                }
                else {
                  setSelectedCommentIndex(index)
                }
              }} key={index}>
                {index + 1}
              </button>
            ))}
            </div>
            <div>
            {selectedCommentIndex > -1 && (
              <div key={selectedCommentIndex} style={{
                padding: '10px'
              }}>
                <h4>Comment {selectedCommentIndex + 1}</h4>
                {!comments[selectedCommentIndex].isLocked && (
                  <>
                    <div>
                      <label>X: </label>
                      <input
                        type="range"
                        min={-canvasWidth}
                        max={canvasWidth}
                        value={comments[selectedCommentIndex].x}
                        onChange={(e) => updateCommentPosition(selectedCommentIndex, { x: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label>Y: </label>
                      <input
                        type="range"
                        min={-canvasHeight}
                        max={canvasHeight}
                        value={comments[selectedCommentIndex].y}
                        onChange={(e) => updateCommentPosition(selectedCommentIndex, { y: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label>Scale: </label>
                      <input
                        type="range"
                        min="0.1"
                        max="20"
                        step="0.1"
                        value={comments[selectedCommentIndex].scale}
                        onChange={(e) => updateCommentPosition(selectedCommentIndex, { scale: Number(e.target.value) })}
                      />
                    </div>
                  </>
                )}
                <button onClick={() => toggleLock(selectedCommentIndex)}>
                  {comments[selectedCommentIndex].isLocked ? 'Unlock' : 'Done'}
                </button>
              </div>
            )}
            </div>
          </div>

          <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            {templateButtons}
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
            💡 Tip: When done selecting images press the <FiRepeat/> button.
              </p>


            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{ width: '100%', display: 'block', border: '1px solid #333' }}
            />
          </div>
          {/* clear canvas */}
          <button onClick={() => setComments([])}>Clear Comments</button>
          <button
            onClick={() => {
              const a = document.createElement('a')
              a.href = collageDataUrl
              a.download = 'comment-collage.png'
              a.click()
            }}
            disabled={!collageDataUrl}
          >
            Download Collage
          </button>
        </div>
      </main>
    </div>
  )
}