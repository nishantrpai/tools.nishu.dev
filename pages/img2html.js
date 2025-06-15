import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiUpload, FiCamera } from 'react-icons/fi';

export default function ImgToHtml() {
  const [image, setImage] = useState(null);
  const [combinedHtml, setCombinedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setImage(URL.createObjectURL(file));
    }

    img.src = URL.createObjectURL(file);
  }

  const convertImageToHtml = async () => {
    if (!image) return;

    setIsLoading(true);
    setCombinedHtml('');

    try {
      const canvas = document.getElementById('canvas');

      // Reduce the size of the image for API transmission
      let tempCanvas = document.createElement('canvas');
      let tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = 500;
      tempCanvas.height = 500;
      tempCtx.drawImage(canvas, 0, 0, 500, 500);
      const dataURL = tempCanvas.toDataURL();

      // Get complete HTML directly
      const htmlResponse = await fetch('/api/gpt', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `Convert this UI image to a complete HTML webpage with inline CSS. 
                  Requirements:
                  1. Create a single, complete HTML document with proper doctype, head, and body
                  2. Use semantic HTML5 and modern CSS3 practices
                  3. Replace all images with placeholder.co URLs
                  4. Make the design fully responsive
                  5. Use only inline CSS (no external stylesheets)
                  6. Include meta tags for viewport and charset
                  
                  Return ONLY the clean HTML code, nothing else. Do not include markdown code blocks or backticks.`,
          image_url: dataURL,
          model: 'gpt-4o',
          response_format: { type: "text" }
        }),
      });

      const htmlData = await htmlResponse.json();
      let completeHtml = htmlData.response.trim();

      // Clean up any markdown formatting if present
      if (completeHtml.includes('```')) {
        const match = completeHtml.match(/```(?:html)?\s*([\s\S]*?)```/);
        if (match && match[1]) {
          completeHtml = match[1].trim();
        } else {
          completeHtml = completeHtml.replace(/```html|```/g, '').trim();
        }
      }

      setCombinedHtml(completeHtml);
    } catch (error) {
      console.error('Error converting image to HTML:', error);
      alert('An error occurred while processing the image.');
    } finally {
      setIsLoading(false);
    }
  }

  const downloadHtml = () => {
    const htmlBlob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(htmlBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webpage.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  useEffect(() => {
    const handlePaste = (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              setImage(event.target.result);
            }
            img.src = event.target.result;
          }
          reader.readAsDataURL(blob);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Image to HTML</title>
        <meta name="description" content="Convert image UI to HTML code" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: 1200 }}>
        <h1 className={styles.title}>
          Image to HTML
        </h1>
        <h2 className={styles.description}>
          Convert UI designs to HTML code
        </h2>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 20, width: '100%' }}>
          {/* Left Side - Image Input */}
          <div style={{ flex: 1 }}>
            <canvas
              id="canvas"
              width={1000}
              height={1000}
              style={{
                width: '100%',
                height: 'auto',
                marginBottom: 10,
                border: '1px solid #333',
              }}
            ></canvas>

            <div style={{ display: 'flex', marginBottom: 10, fontSize: 24 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <label htmlFor="file-upload">
                  <FiUpload />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <label htmlFor="file-camera">
                  <FiCamera />
                </label>
                <input
                  id="file-camera"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  capture="environment"
                  style={{ display: 'none' }}
                />
              </div>
            </div>



            {isLoading && (
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <p>Processing image...</p>
              </div>
            )}
          </div>

          {/* Right Side - HTML Preview */}
          <div style={{ flex: 1 }}>
            {combinedHtml ? (
              <>
                <iframe
                  srcDoc={combinedHtml}
                  style={{
                    width: '100%',
                    height: '500px',
                    border: '1px solid #333',
                    borderRadius: '5px',
                  }}
                  title="HTML Preview"
                />
              </>
            ) : (
              <div style={{
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '5px',
              }}>
                <p>HTML preview will appear here</p>
              </div>
            )}
          </div>


        </div>
        <button
          onClick={convertImageToHtml}
          disabled={isLoading || !image}
        >
          {isLoading ? 'Converting...' : 'Convert to HTML'}
        </button>

        {combinedHtml && (
          <div>
            <button onClick={downloadHtml}>
              Download HTML
            </button>
          </div>

        )}
      </main>
    </>
  );
}
