import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FaHistory } from "react-icons/fa";


// IndexedDB utility functions
const indexedDBUtils = {
  DB_NAME: 'BlendGalleryDB',
  STORE_NAME: 'images',
  DB_VERSION: 1,

  // Open database connection
  openDB: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(indexedDBUtils.DB_NAME, indexedDBUtils.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(indexedDBUtils.STORE_NAME)) {
          db.createObjectStore(indexedDBUtils.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject('Error opening IndexedDB');
      };
    });
  },

  // Get all images from the database
  getAllImages: async () => {
    try {
      const db = await indexedDBUtils.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([indexedDBUtils.STORE_NAME], 'readonly');
        const store = transaction.objectStore(indexedDBUtils.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = (event) => {
          console.error('Error getting images:', event.target.error);
          reject('Error retrieving images from IndexedDB');
        };
      });
    } catch (error) {
      console.error('Failed to get images:', error);
      return [];
    }
  },

  // Add an image to the database
  addImage: async (imageData) => {
    try {
      const db = await indexedDBUtils.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([indexedDBUtils.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(indexedDBUtils.STORE_NAME);
        const request = store.add(imageData);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('Error adding image:', event.target.error);
          reject('Error saving image to IndexedDB');
        };
      });
    } catch (error) {
      console.error('Failed to add image:', error);
      return false;
    }
  },

  // Remove an image from the database
  removeImage: async (id) => {
    try {
      const db = await indexedDBUtils.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([indexedDBUtils.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(indexedDBUtils.STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('Error removing image:', event.target.error);
          reject('Error deleting image from IndexedDB');
        };
      });
    } catch (error) {
      console.error('Failed to remove image:', error);
      return false;
    }
  },

  // Clear all images from the database
  clearAllImages: async () => {
    try {
      const db = await indexedDBUtils.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([indexedDBUtils.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(indexedDBUtils.STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('Error clearing images:', event.target.error);
          reject('Error clearing images from IndexedDB');
        };
      });
    } catch (error) {
      console.error('Failed to clear images:', error);
      return false;
    }
  }
};

const BlendLayer = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [blendMode, setBlendMode] = useState('normal')
  const [opacity, setOpacity] = useState(1)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [gallery, setGallery] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [dbError, setDbError] = useState(null)

  // Load gallery from IndexedDB on component mount
  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      try {
        const images = await indexedDBUtils.getAllImages();
        setGallery(images.sort((a, b) => b.date - a.date)); // Sort by date descending
        setDbError(null);
      } catch (error) {
        console.error('Failed to load gallery', error);
        setDbError('Failed to load images from database');
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  // No need to save gallery to localStorage on change as we're using IndexedDB directly

  const handleImage1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage1(image)
        console.log(getImageData(image))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImage2 = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage2(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleBlendMode = (e) => {
    setBlendMode(e.target.value)
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const getImageData = (image1) => {
    let image = image1;
    return { width: image.width, height: image.height }
  }

  const addToGallery = async (dataURL) => {
    const timestamp = new Date().getTime();
    const newGalleryItem = {
      id: timestamp,
      dataURL,
      date: timestamp,
      blendMode,
    };

    setIsLoading(true);
    try {
      // Add to IndexedDB
      await indexedDBUtils.addImage(newGalleryItem);

      // Update state with the new gallery
      setGallery(prevGallery => {
        // Keep only the most recent 50 items to prevent database from getting too large
        const updatedGallery = [newGalleryItem, ...prevGallery].slice(0, 100);
        return updatedGallery;
      });

      setDbError(null);
    } catch (error) {
      console.error('Failed to add image to gallery', error);
      setDbError('Failed to save image to database');
    } finally {
      setIsLoading(false);
    }
  };

  const selectGalleryImage = (dataURL, imageNumber) => {
    const image = new Image()
    image.src = dataURL
    image.onload = () => {
      if (imageNumber === 1) {
        setImage1(image)
      } else if (imageNumber === 2) {
        setImage2(image)
      } else if (imageNumber === 3) {
        setImage1(image)
      }
    }
  }

  const removeFromGallery = async (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent click handler

    setIsLoading(true);
    try {
      // Remove from IndexedDB
      await indexedDBUtils.removeImage(id);

      // Update state by filtering out the removed item
      setGallery(prevGallery => prevGallery.filter(item => item.id !== id));
      setDbError(null);
    } catch (error) {
      console.error('Failed to remove image from gallery', error);
      setDbError('Failed to delete image from database');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    // get higher resolution image
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    // Add to gallery
    addToGallery(dataURL)
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `blended-image-${new Date().getTime()}.png`
    a.click()
  }

  const copyImage = async () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    // Add to gallery
    addToGallery(dataURL)
    try {
      const blob = await (await fetch(dataURL)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      alert('Blended image copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy image: ', err)
    }
  }

  const downloadComposite = () => {
    const compositeCanvas = document.createElement('canvas');
    const compositeCtx = compositeCanvas.getContext('2d');

    const minWidth = Math.min(image1.width, image2.width, canvas.width);

    // Calculate heights while maintaining aspect ratios
    const image1Height = (image1.height / image1.width) * minWidth;
    const image2Height = (image2.height / image2.width) * minWidth;
    const canvasHeight = (canvas.height / canvas.width) * minWidth;

    const totalHeight = image1Height + image2Height + canvasHeight;

    compositeCanvas.width = minWidth;
    compositeCanvas.height = totalHeight;

    // Draw image1
    compositeCtx.drawImage(image1, 0, 0, minWidth, image1Height);

    // Draw image2
    compositeCtx.drawImage(image2, 0, image1Height, minWidth, image2Height);

    // Draw the blended canvas (image3)
    compositeCtx.drawImage(canvas, 0, image1Height + image2Height, minWidth, canvasHeight);

    // Draw the '+' signs
    compositeCtx.font = '48px Arial';
    compositeCtx.fillStyle = 'white';
    compositeCtx.textAlign = 'center';
    compositeCtx.textBaseline = 'middle';
    compositeCtx.fillText('+', minWidth / 2, image1Height + 24);
    compositeCtx.fillText('=', minWidth / 2, image1Height + image2Height + 24);

    const dataURL = compositeCanvas.toDataURL('image/png');
    // Add to gallery
    addToGallery(dataURL)
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `blended-composite-${new Date().getTime()}.png`;
    a.click();
  }

  const copyComposite = async () => {
    const compositeCanvas = document.createElement('canvas');
    const compositeCtx = compositeCanvas.getContext('2d');

    const minWidth = Math.min(image1.width, image2.width, canvas.width);

    // Calculate heights while maintaining aspect ratios
    const image1Height = (image1.height / image1.width) * minWidth;
    const image2Height = (image2.height / image2.width) * minWidth;
    const canvasHeight = (canvas.height / canvas.width) * minWidth;

    const totalHeight = image1Height + image2Height + canvasHeight;

    compositeCanvas.width = minWidth;
    compositeCanvas.height = totalHeight;

    // Draw image1
    compositeCtx.drawImage(image1, 0, 0, minWidth, image1Height);

    // Draw image2
    compositeCtx.drawImage(image2, 0, image1Height, minWidth, image2Height);

    // Draw the blended canvas (image3)
    compositeCtx.drawImage(canvas, 0, image1Height + image2Height, minWidth, canvasHeight);

    // Draw the '+' signs
    compositeCtx.font = '48px Arial';
    compositeCtx.fillStyle = 'white';
    compositeCtx.textAlign = 'center';
    compositeCtx.textBaseline = 'middle';
    compositeCtx.fillText('+', minWidth / 2, image1Height + 24);
    compositeCtx.fillText('=', minWidth / 2, image1Height + image2Height + 24);

    const dataURL = compositeCanvas.toDataURL('image/png');
    // Add to gallery
    addToGallery(dataURL);
    try {
      const blob = await (await fetch(dataURL)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      alert('Composite image copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy composite image: ', err)
    }
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (image1 && image2 && canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = opacity
      ctx.globalCompositeOperation = blendMode
      let scaleFactor = canvas.width / image2.width
      const scaledHeight = image2.height * scaleFactor
      const center = (canvas.height - scaledHeight) / 2
      ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(image2, 0, center, canvas.width, scaledHeight)
    }
  }, [image1, image2, blendMode, opacity, canvas, ctx])

  const clearGallery = async () => {
    if (confirm('Are you sure you want to clear your gallery? This cannot be undone.')) {
      setIsLoading(true);
      try {
        // Clear all images from IndexedDB
        await indexedDBUtils.clearAllImages();

        // Update state
        setGallery([]);
        setDbError(null);
      } catch (error) {
        console.error('Failed to clear gallery', error);
        setDbError('Failed to clear images from database');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Blend Layer</title>
        <meta name="description" content="Blend two images together using canvas in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Blend Layer
        </h1>

        <p className={styles.description}>
          Blend two images together
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="file" onChange={handleImage1} />
            <input type="file" onChange={handleImage2} />
            <select onChange={handleBlendMode} value={blendMode}>
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="hue">Hue</option>
              <option value="saturation">Saturation</option>
              <option value="color">Color</option>
              <option value="luminosity">Luminosity</option>
            </select>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={handleOpacity} />
            <canvas id="canvas" width={image1?.width || 500} height={image1?.height || 500}></canvas>

            <button  onClick={downloadImage}>Download Blended Image</button>
            <button  onClick={copyImage}>Copy Blended Image</button>
            <button  onClick={downloadComposite}>Download Composite</button>
            <button  onClick={copyComposite}>Copy Composite</button>

            {/* Gallery Section */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: 14, marginBottom: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FaHistory /> History

              </h3>

              {/* Show error message if any */}
              {dbError && (
                <div style={{
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}>
                  Error: {dbError}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Loading...
                </div>
              )}

              {!isLoading && gallery.length > 0 ? (
                <>
                  <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={clearGallery}
                    >
                      Clear
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          position: 'relative',
                          borderRadius: '5px',
                          border: '1px solid #333',
                          padding: 5,
                        }}
                      >
                        {/* Gallery item - same as before */}
                        <div style={{ position: 'relative' }}>
                          <img
                            src={item.dataURL}
                            alt={`Gallery image from ${new Date(item.date).toLocaleString()}`}
                            style={{ width: '100%', cursor: 'pointer', height: 200 , objectFit: 'cover'}}
                            loading="lazy" // Add lazy loading for better performance
                          />

                          {/* Use as Result button */}
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: '5px',
                          padding: '5px',
                          fontSize: '5px',
                        }}>
                          <button
                            onClick={() => selectGalleryImage(item.dataURL, 1)}
                            style={{ fontSize: 10 }}
                          >
                            Use Img1
                          </button>
                          <button
                            onClick={() => selectGalleryImage(item.dataURL, 2)}
                            style={{ fontSize: 10 }}

                          >
                            Use Img2
                          </button>
                          <button
                            onClick={() => selectGalleryImage(item.dataURL, 3)}
                            style={{ fontSize: 10 }}

                          >
                            Use Blended
                          </button>
                          <button
                            onClick={(e) => removeFromGallery(item.id, e)}
                            style={{ fontSize: 10 }}

                            disabled={isLoading}
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : !isLoading && (
                <p>No saved images yet. Blend and save images to see them here.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default BlendLayer