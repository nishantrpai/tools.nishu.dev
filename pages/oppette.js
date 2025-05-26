import { useState, useRef, useEffect } from 'react';

// Default colors and styles
const DEFAULT_SKIN_COLOR = '#F9D7B5';
const DEFAULT_HAIR_COLOR = '#000000';
const DEFAULT_MOUTH_COLOR = '#CC3333';
const DEFAULT_GLASS_COLOR = '#000000';
const GLASSES_STYLES = ['none', 'round', 'square', 'sunglasses'];
const BRUSH_SIZES = [5, 10, 20, 30];

function OppetteAvatar({ skinColor, mouthColor, backgroundColor, drawingRef }) {
  return (
    <svg
      id="opepette"
      className="border rounded-md aspect-auto border-white/10"
      viewBox="0 -500 1000 2031"
      fill="none"
      width="400px"
      height="400px"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect x="-500" y="-1000" width="2000" height="3500" fill={backgroundColor} />
      
      {/* Forehead */}
      <path
        id="forehead"
        className="cursor-pointer"
        d="M0.363281 510.449H1024.28V766.429C1024.28 907.803 909.677 1022.41 768.303 1022.41H256.343C114.969 1022.41 0.363281 907.803 0.363281 766.429V510.449Z"
        fill={skinColor}
        transform="rotate(180 512 520)"
      />

      {/* Jaw */}
      <path
        id="jaw"
        className="cursor-pointer"
        d="M0.363281 510.449H1024.28V766.429C1024.28 907.803 909.677 1022.41 768.303 1022.41H256.343C114.969 1022.41 0.363281 907.803 0.363281 766.429V510.449Z"
        fill={skinColor}
      />

      {/* Chest */}
      <path
        id="chest"
        className="cursor-pointer"
        d="M0.363281 1530.45H1019.46C1019.46 1390.9 906.33 1277.77 766.78 1277.77H253.04C113.491 1277.77 0.363281 1390.9 0.363281 1530.45Z"
        fill={skinColor}
      />
      
      {/* Mouth - half circle */}
      <path
        d="M362 800 C362 900, 662 900, 662 800"
        fill={mouthColor}
        transform='scale(2, 3.5) translate(-150, -630)' // Flip vertically and translate
        strokeWidth="10"
      />
      
      {/* Drawing layer on top of everything for overlay drawing */}
      <g id="drawing-layer" ref={drawingRef}></g>
    </svg>
  );
}

export default function Oppette() {
  const [skinColor, setSkinColor] = useState(DEFAULT_SKIN_COLOR);
  const [brushColor, setBrushColor] = useState(DEFAULT_HAIR_COLOR);
  const [mouthColor, setMouthColor] = useState(DEFAULT_MOUTH_COLOR);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState('draw'); // 'draw' or 'erase'
  const [lastPoint, setLastPoint] = useState(null); // Store last point for smooth drawing
  
  const svgRef = useRef(null);
  const drawingLayerRef = useRef(null);
  
  // Drawing functionality
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svgContainer = svgRef.current;
    const svg = svgContainer.querySelector('svg');
    if (!svg) return;
    
    const svgPoint = svg.createSVGPoint();
    
    function getMousePosition(evt) {
      svgPoint.x = evt.clientX;
      svgPoint.y = evt.clientY;
      return svgPoint.matrixTransform(svg.getScreenCTM().inverse());
    }
    
    function startDrawing(evt) {
      setIsDrawing(true);
      const loc = getMousePosition(evt.type.includes('touch') ? evt.touches[0] : evt);
      setLastPoint({ x: loc.x, y: loc.y });
      drawPoint(loc.x, loc.y);
    }
    
    function drawPoint(x, y) {
      if (!drawingLayerRef.current) return;
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", brushSize);
      
      if (drawingMode === 'draw') {
        circle.setAttribute("fill", brushColor);
      } else {
        // Eraser - use background color for erasing
        circle.setAttribute("fill", backgroundColor);
      }
      
      drawingLayerRef.current.appendChild(circle);
    }
    
    // Draw a smooth line between points
    function drawSmoothLine(x1, y1, x2, y2) {
      if (!drawingLayerRef.current) return;
      
      // Calculate distance between the two points
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      // If the distance is very small, just draw a point
      if (distance < 5) {
        drawPoint(x2, y2);
        return;
      }
      
      // Calculate how many points we need to fill the gap for a smooth line
      const steps = Math.max(Math.floor(distance / 2), 10);
      
      // Draw intermediate points
      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps;
        const x = x1 + (x2 - x1) * ratio;
        const y = y1 + (y2 - y1) * ratio;
        drawPoint(x, y);
      }
    }
    
    function draw(evt) {
      if (!isDrawing) return;
      const loc = getMousePosition(evt.type.includes('touch') ? evt.touches[0] : evt);
      
      // If we have a previous point, draw a line between them for smoother drawing
      if (lastPoint) {
        drawSmoothLine(lastPoint.x, lastPoint.y, loc.x, loc.y);
      } else {
        drawPoint(loc.x, loc.y);
      }
      
      // Update the last point
      setLastPoint({ x: loc.x, y: loc.y });
    }
    
    function endDrawing() {
      setIsDrawing(false);
      setLastPoint(null); // Reset lastPoint when drawing ends
    }
    
    // Mouse events
    svg.addEventListener('mousedown', startDrawing);
    svg.addEventListener('mousemove', draw);
    svg.addEventListener('mouseup', endDrawing);
    svg.addEventListener('mouseleave', endDrawing);
    
    // Touch events for mobile
    svg.addEventListener('touchstart', startDrawing);
    svg.addEventListener('touchmove', draw);
    svg.addEventListener('touchend', endDrawing);
    svg.addEventListener('touchcancel', endDrawing);
    
    return () => {
      // Clean up mouse events
      svg.removeEventListener('mousedown', startDrawing);
      svg.removeEventListener('mousemove', draw);
      svg.removeEventListener('mouseup', endDrawing);
      svg.removeEventListener('mouseleave', endDrawing);
      
      // Clean up touch events
      svg.removeEventListener('touchstart', startDrawing);
      svg.removeEventListener('touchmove', draw);
      svg.removeEventListener('touchend', endDrawing);
      svg.removeEventListener('touchcancel', endDrawing);
    };
  }, [isDrawing, brushSize, brushColor, drawingMode, backgroundColor, lastPoint]);
  
  // Clear drawing
  const clearDrawing = () => {
    if (drawingLayerRef.current) {
      while (drawingLayerRef.current.firstChild) {
        drawingLayerRef.current.removeChild(drawingLayerRef.current.firstChild);
      }
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Oppette Avatar Creator</h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        position: 'relative'
      }}>
        <div ref={svgRef} style={{ position: 'relative', width: 400, height: 400 }}>
          <OppetteAvatar
            skinColor={skinColor}
            mouthColor={mouthColor}
            backgroundColor={backgroundColor}
            drawingRef={drawingLayerRef}
          />
        </div>
      </div>

      {/* Drawing Tools */}
      <div style={{ marginTop: 20, padding: 15, backgroundColor: '#111', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Drawing Tools</h3>
        
        <div style={{ display: 'flex', gap: 15, alignItems: 'center', marginBottom: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Brush Color:</label>
            <input 
              type="color" 
              value={brushColor} 
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ width: 40, height: 40, padding: 0, border: 'none' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Brush Size:</label>
            <div style={{ display: 'flex', gap: 8 }}>
                <input 
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: 150 }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Mode:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setDrawingMode('draw')}
              >
                Draw
              </button>
              <button
                onClick={() => setDrawingMode('erase')}
              >
                Erase
              </button>
              <button
                onClick={clearDrawing}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Customization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 20 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Skin Color:</label>
          <input 
            type="color" 
            value={skinColor} 
            onChange={(e) => setSkinColor(e.target.value)}
            style={{ width: '100%', height: 40, cursor: 'pointer' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Mouth Color:</label>
          <input 
            type="color" 
            value={mouthColor} 
            onChange={(e) => setMouthColor(e.target.value)}
            style={{ width: '100%', height: 40, cursor: 'pointer' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Background Color:</label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ width: '100%', height: 40, cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <button
          onClick={() => {
            // Get the SVG element
            const svg = document.querySelector('#opepette');
            const serializer = new XMLSerializer();
            const svgStr = serializer.serializeToString(svg);
            
            // Directly download SVG for high quality
            const svgBlob = new Blob([svgStr], {type: 'image/svg+xml;charset=utf-8'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            const a = document.createElement('a');
            a.href = svgUrl;
            a.download = 'my-oppette.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up the object URL
            setTimeout(() => URL.revokeObjectURL(svgUrl), 100);
          }}
        >
          Download Avatar
        </button>
      </div>
    </div>
  );
}
