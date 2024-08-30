import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'

export default function FeedbackLoop() {
  const [entity, setEntity] = useState('')
  const [feedbackLoop, setFeedbackLoop] = useState(null)
  const [loading, setLoading] = useState(false)
  const svgRef = useRef(null)
  
  const generateFeedbackLoop = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a concise JSON (don't add prefixes/suffixes or codeblocks) string representation of a simple feedback loop for the system involving: "${entity}". The loop should be circular, not forming multiple loops or a star shape. Include the environment and relevant phenomena or elements as variables. The JSON string should represent an array of 3-4 objects, each with 'name', 'description', and 'connects_to' properties. 'connects_to' should be an array with a single index pointing to the next entity in the loop. Include both positive and negative feedback mechanisms where applicable.`,
          model: 'gpt-4o-mini'
        }),
      })
      const data = await response.json()
      setFeedbackLoop(JSON.parse(data.response))
    } catch (error) {
      console.error("Failed to generate feedback loop:", error)
      setFeedbackLoop(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (feedbackLoop && svgRef.current) {
      const svg = svgRef.current
      const svgNS = "http://www.w3.org/2000/svg"
      
      // Clear previous content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }

      const radius = 150
      const centerX = 250
      const centerY = 250
      
      // Add arrowhead definition
      const defs = document.createElementNS(svgNS, "defs")
      const marker = document.createElementNS(svgNS, "marker")
      marker.setAttribute("id", "arrowhead")
      marker.setAttribute("markerWidth", "10")
      marker.setAttribute("markerHeight", "7")
      marker.setAttribute("refX", "9")
      marker.setAttribute("refY", "3.5")
      marker.setAttribute("orient", "auto")
      const polygon = document.createElementNS(svgNS, "polygon")
      polygon.setAttribute("points", "0 0, 10 3.5, 0 7")
      polygon.setAttribute("fill", "#fff")
      marker.appendChild(polygon)
      defs.appendChild(marker)
      svg.appendChild(defs)

      // Create a group for circles and text
      const circlesAndTextGroup = document.createElementNS(svgNS, "g")
      svg.appendChild(circlesAndTextGroup)

      // Create a group for arrows
      const arrowsGroup = document.createElementNS(svgNS, "g")
      svg.appendChild(arrowsGroup)
      
      feedbackLoop.forEach((entity, index) => {
        const angle = (index / feedbackLoop.length) * 2 * Math.PI
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        // Create circle
        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("cx", x)
        circle.setAttribute("cy", y)
        circle.setAttribute("r", 60)
        circle.setAttribute("fill", entity.name.toLowerCase() === "environment" ? "#222" : "#333")
        circlesAndTextGroup.appendChild(circle)

        // Create text
        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("x", x)
        text.setAttribute("y", y)
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("dominant-baseline", "middle")
        text.setAttribute("fill", "#fff")
        text.setAttribute("font-size", "14px")
        text.textContent = entity.name
        circlesAndTextGroup.appendChild(text)

        // Create arrows
        entity.connects_to.forEach(targetIndex => {
          const targetAngle = (targetIndex / feedbackLoop.length) * 2 * Math.PI
          const targetX = centerX + radius * Math.cos(targetAngle)
          const targetY = centerY + radius * Math.sin(targetAngle)

          const arrow = document.createElementNS(svgNS, "line")
          arrow.setAttribute("x1", x)
          arrow.setAttribute("y1", y)
          arrow.setAttribute("x2", targetX)
          arrow.setAttribute("y2", targetY)
          arrow.setAttribute("stroke", "#888")
          arrow.setAttribute("marker-end", "url(#arrowhead)")
          arrowsGroup.appendChild(arrow)
        })
      })
    }
  }, [feedbackLoop])

  const downloadPNG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "feedback_loop.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  }

  return (
    <>
      <Head>
        <title>Simple Feedback Loop Generator</title>
        <meta name="description" content="Generate simple feedback loops for any entity, including environmental factors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Simple Feedback Loop Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate a simple feedback loop diagram for any entity, including its environment
        </span>

        <input
          type="text"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          placeholder="Enter an entity (e.g., 'Social Media Platform')"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
          }}
        />

        <button onClick={generateFeedbackLoop} className={styles.button}>
          {loading ? 'Generating...' : 'Generate Simple Feedback Loop'}
        </button>

        {feedbackLoop && (
          <>
            <div style={{ marginTop: '20px', width: '100%', height: '500px', border: '1px solid #333', borderRadius: 10, padding: 10 }}>
              <svg ref={svgRef} width="500" height="500" viewBox="0 0 500 500"  style={{ backgroundColor: '#000', width: '100%', height: '100%', overflow: 'visible' }} />
            </div>
            <button onClick={downloadPNG} className={styles.button} style={{ marginTop: '10px' }}>
              Download SVG
            </button>
          </>
        )}
      </main>
    </>
  )
}
