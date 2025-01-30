import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function DoorknobEffect() {
  const [image, setImage] = useState(null)
  const [distortionStrength, setDistortionStrength] = useState(2)
  const [radius, setRadius] = useState(0.8)
  const canvasRef = useRef(null)
  const glRef = useRef(null)

  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
      v_texCoord = a_texCoord;
    }
  `

  const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_distortionStrength;
    uniform float u_radius;
    uniform vec2 u_center;
    varying vec2 v_texCoord;

    void main() {
      vec2 center = u_center;
      vec2 pos = v_texCoord - center;
      float dist = length(pos);
      float distortionFactor = 1.0;
      
      if (dist < u_radius) {
        distortionFactor = 1.0 + (u_distortionStrength * (1.0 - (dist / u_radius)));
        pos = pos * distortionFactor;
      }
      
      vec2 newTexCoord = pos + center;
      if (newTexCoord.x < 0.0 || newTexCoord.x > 1.0 || 
          newTexCoord.y < 0.0 || newTexCoord.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
        gl_FragColor = texture2D(u_image, newTexCoord);
      }
    }
  `

  const initWebGL = () => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')
    if (!gl) return

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)

    // Set up attributes and uniforms
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    
    // Create buffers
    const positionBuffer = gl.createBuffer()
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const texCoordBuffer = gl.createBuffer()
    const texCoords = new Float32Array([
      0, 1,  // Changed from 0,0
      1, 1,  // Changed from 1,0
      0, 0,  // Changed from 0,1
      1, 0   // Changed from 1,1
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)

    glRef.current = {
      gl,
      program,
      positionLocation,
      texCoordLocation,
      positionBuffer,
      texCoordBuffer
    }
  }

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
  }

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    return program
  }

  const applyEffect = () => {
    const { gl, program, positionLocation, texCoordLocation, positionBuffer, texCoordBuffer } = glRef.current
    if (!gl || !image) return

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Set up texture
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // Set uniforms
    gl.uniform1f(gl.getUniformLocation(program, 'u_distortionStrength'), distortionStrength)
    gl.uniform1f(gl.getUniformLocation(program, 'u_radius'), radius)
    gl.uniform2f(gl.getUniformLocation(program, 'u_center'), 0.5, 0.5)

    // Draw
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  useEffect(() => {
    if (canvasRef.current) {
      initWebGL()
    }
  }, [canvasRef])

  useEffect(() => {
    if (image && glRef.current) {
      applyEffect()
    }
  }, [image, distortionStrength, radius])

  return (
    <>
      <Head>
        <title>Doorknob Effect</title>
        <meta name="description" content="Peephole Camera Effect" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Doorknob Effect</h1>
        <h2 className={styles.description}>Create a peephole camera effect</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setImage(img)
              }
            }
            reader.readAsDataURL(file)
          }} />

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="distortion">Distortion Strength: </label>
            <input
              type="range"
              id="distortion"
              min="0.1"
              max="5"
              step="0.1"
              value={distortionStrength}
              onChange={(e) => setDistortionStrength(Number(e.target.value))}
            />
          </div>

          <div style={{ marginTop: '20px' }}></div>
            <label htmlFor="radius">Peephole Size: </label>
            <input
              type="range"
              id="radius"
              min="0.1"
              max="1"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'peephole_effect.png'
            a.click()
          }}>Download</button>
      </main>
    </>
  )
}
