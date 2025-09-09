import { useState, useEffect, useRef } from 'react'
import { parseGIF, decompressFrames } from 'gifuct-js';
import GIF from 'gif.js.optimized';

const BlendGifImg = () => {
  const [staticImage, setStaticImage] = useState(null);
  const [gifFile, setGifFile] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [blendMode, setBlendMode] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [gifFrames, setGifFrames] = useState([]);
  const [gifWidth, setGifWidth] = useState(0);
  const [gifHeight, setGifHeight] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const previewCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const handleStaticImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        setStaticImage(image);
        updatePreview();
      };
    };
    reader.readAsDataURL(file);
  };

  const handleGifFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGifFile(file);

    const arrayBuffer = await file.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);

    setGifFrames(frames);
    setGifWidth(gif.lsd.width);
    setGifHeight(gif.lsd.height);
    setCurrentFrameIndex(0);
    updatePreview();
  };

  const handleOpacity = (e) => {
    setOpacity(e.target.value);
    updatePreview();
  };

  const handleBlendMode = (e) => {
    setBlendMode(e.target.value);
    updatePreview();
  };

  const updatePreview = () => {
    if (!staticImage || !gifFrames.length || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const frame = gifFrames[currentFrameIndex];

    canvas.width = gifWidth;
    canvas.height = gifHeight;

    // Clear canvas
    ctx.clearRect(0, 0, gifWidth, gifHeight);

    // Draw static image first
    ctx.drawImage(staticImage, 0, 0, gifWidth, gifHeight);

    // Set blend mode and opacity for the GIF frame
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = blendMode;

    // Create a temporary canvas for the frame
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = gifWidth;
    frameCanvas.height = gifHeight;
    const frameCtx = frameCanvas.getContext('2d');

    // Create ImageData from frame patch
    const frameImageData = frameCtx.createImageData(gifWidth, gifHeight);
    frameImageData.data.set(frame.patch);
    frameCtx.putImageData(frameImageData, frame.dims.left, frame.dims.top);

    // Draw the frame canvas onto the main canvas with blend mode
    ctx.drawImage(frameCanvas, 0, 0, gifWidth, gifHeight);

    // Reset global settings
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  // Animate the GIF preview
  useEffect(() => {
    if (!gifFrames.length) return;

    let lastTime = 0;
    let accumulatedTime = 0;

    const animate = (currentTime) => {
      if (currentTime - lastTime >= 16) { // ~60fps
        accumulatedTime += currentTime - lastTime;

        const currentFrame = gifFrames[currentFrameIndex];
        const frameDelay = currentFrame.delay * 10; // Convert to milliseconds

        if (accumulatedTime >= frameDelay) {
          setCurrentFrameIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % gifFrames.length;
            return nextIndex;
          });
          accumulatedTime = 0;
        }

        lastTime = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gifFrames, currentFrameIndex]);

  // Update preview when frame changes
  useEffect(() => {
    updatePreview();
  }, [currentFrameIndex, staticImage, gifFrames, opacity, blendMode]);

  const blendGif = async () => {
    if (!staticImage || !gifFrames.length) return;

    setIsLoading(true);

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: gifWidth,
      height: gifHeight,
    });

    for (const frame of gifFrames) {
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = gifWidth;
      frameCanvas.height = gifHeight;
      const frameCtx = frameCanvas.getContext('2d');

      // Clear frame canvas
      frameCtx.clearRect(0, 0, gifWidth, gifHeight);

      // Draw static image first
      frameCtx.drawImage(staticImage, 0, 0, gifWidth, gifHeight);

      // Set blend mode and opacity for the GIF frame
      frameCtx.globalAlpha = opacity;
      frameCtx.globalCompositeOperation = blendMode;

      // Create a temporary canvas for the frame data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = gifWidth;
      tempCanvas.height = gifHeight;
      const tempCtx = tempCanvas.getContext('2d');

      // Create ImageData from frame patch
      const frameImageData = tempCtx.createImageData(gifWidth, gifHeight);
      frameImageData.data.set(frame.patch);
      tempCtx.putImageData(frameImageData, frame.dims.left, frame.dims.top);

      // Draw the temp canvas onto the frame canvas with blend mode
      frameCtx.drawImage(tempCanvas, 0, 0, gifWidth, gifHeight);

      // Reset global settings
      frameCtx.globalAlpha = 1;
      frameCtx.globalCompositeOperation = 'source-over';

      gif.addFrame(frameCanvas, { delay: frame.delay });
    }

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().getTime();

      // Download
      const a = document.createElement('a');
      a.href = url;
      a.download = `blended-gif-${timestamp}.gif`;
      a.click();

      setIsLoading(false);
    });

    gif.render();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input type="file" accept="image/*" onChange={handleStaticImage} />
        <input type="file" accept=".gif" onChange={handleGifFile} />
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
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Opacity: {Math.round(opacity * 100)}%
        </div>

        {/* Preview Canvas */}
        {staticImage && gifFrames.length > 0 && (
          <div style={{ border: '1px solid #333', borderRadius: '5px', padding: '10px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Preview</h3>
            <canvas
              ref={previewCanvasRef}
              style={{
                height: 'auto',
                border: '1px solid #ddd',
                borderRadius: '3px'
              }}
            />
          </div>
        )}

        <button onClick={blendGif} disabled={!staticImage || !gifFrames.length || isLoading}>
          {isLoading ? 'Blending...' : 'Blend and Download GIF'}
        </button>
      </div>
    </div>
  );
};

export default BlendGifImg;
