import Head from 'next/head';
import React, { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.css';
import html2canvas from 'html2canvas';

const AddImage = () => {
  const [baseImage, setBaseImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState(0.1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  const handleBaseImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBaseImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOverlayImage(e.target.result);
        // Reset position and scale when a new overlay image is uploaded
        setPosition({ x: 100, y: -200 });
        setScale(0.1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotation = (axis) => (e) => {
    setRotation(prev => ({ ...prev, [axis]: Number(e.target.value) }));
  };

  const handleScale = (e) => {
    setScale(Number(e.target.value));
  };

  const handlePosition = (axis) => (e) => {
    setPosition(prev => ({ ...prev, [axis]: Number(e.target.value) }));
  };

  const handleDownload = useCallback(() => {
    if (containerRef.current) {
      html2canvas(containerRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'combined-image.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  }, []);

  return (
    <>
    <Head>
      <title>Add Image</title>
      <meta name="description" content="Add image to your image" />
      <meta name="keywords" content="add image, image overlay, image manipulation" />
    </Head>
    <main style={{maxWidth: '1500px', margin: '0 auto'}}>
      <h1>Add Image</h1>
      <h2 className={styles.description}>Add image to your image</h2>

      <input type="file" onChange={handleBaseImageUpload} accept="image/*" />
      <input type="file" onChange={handleOverlayImageUpload} accept="image/*" />
      
      <div ref={containerRef} style={{ position: 'relative', perspective: '1000px' }}>
        {baseImage && <img src={baseImage} alt="Base" style={{ width: '100%', height: '100%' }} />}
        
        {overlayImage && (
          <Draggable
            position={position}
            onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
          >
            <div
              style={{
                position: 'absolute',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                transformOrigin: 'center',
                cursor: 'move',
              }}
            >
              <img
                ref={overlayRef}
                src={overlayImage}
                alt="Overlay"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                  width: `${100 * scale}%`,
                  height: `${100 * scale}%`,
                }}
              />
            </div>
          </Draggable>
        )}
      </div>

      <div>
        <label>
          Rotation X:
          <input type="range" min="-180" max="180" value={rotation.x} onChange={handleRotation('x')} />
          <input type="number" value={rotation.x} onChange={handleRotation('x')} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <div>
        <label>
          Rotation Y:
          <input type="range" min="-180" max="180" value={rotation.y} onChange={handleRotation('y')} />
          <input type="number" value={rotation.y} onChange={handleRotation('y')} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <div>
        <label>
          Rotation Z:
          <input type="range" min="-180" max="180" value={rotation.z} onChange={handleRotation('z')} />
          <input type="number" value={rotation.z} onChange={handleRotation('z')} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <div>
        <label>
          Scale:
          <input type="range" min="0.1" max="2" step="0.1" value={scale} onChange={handleScale} />
          <input type="number" value={scale} onChange={handleScale} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <div>
        <label>
          Position X:
          <input type="range" min="-3500" max="3500" value={position.x} onChange={handlePosition('x')} />
          <input type="number" value={position.x} onChange={handlePosition('x')} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <div>
        <label>
          Position Y:
          <input type="range" min="-3500" max="3500" value={position.y} onChange={handlePosition('y')} />
          <input type="number" value={position.y} onChange={handlePosition('y')} style={{width: '50px', border: '1px solid #333', background: '#000', color: '#fff', borderRadius: '5px', marginLeft: '10px'}} />
        </label>
      </div>
      <button onClick={handleDownload}>Download Combined Image</button>
    </main>
    </>
  );
};

export default AddImage;