import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

const ThreeScene = ({ modelData }) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
  
  // Initialize and update Three.js scene
  useEffect(() => {
    if (!containerRef.current || !modelData) return
    
    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    sceneRef.current = scene
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    )
    camera.position.z = 5
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(renderer.domElement)
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x707070)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    
    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    
    // Create the 3D mesh
    createMeshFromDepthMap(
      modelData.imageUrl, 
      modelData.depthMapUrl, 
      modelData.width, 
      modelData.height, 
      modelData.depthStrength,
      modelData.resolution
    )
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    
    // Export function for STL download
    window.ThreeSceneExport = {
      downloadSTL: () => {
        if (!meshRef.current) return
        
        const exporter = new STLExporter()
        const stl = exporter.parse(meshRef.current, { binary: true })
        
        const blob = new Blob([stl], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = 'model.stl'
        a.click()
        
        URL.revokeObjectURL(url)
      }
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.ThreeSceneExport = null
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [modelData])

  // Create 3D mesh from depth map
  const createMeshFromDepthMap = (imageUrl, depthMapUrl, width, height, depthStrength, resolution) => {
    // Create a new TextureLoader
    const textureLoader = new THREE.TextureLoader()
    
    // Load depth map texture
    const depthTexture = textureLoader.load(depthMapUrl)
    
    // Load original image as texture
    const diffuseTexture = textureLoader.load(imageUrl)
    
    // Create depth map canvas for reading pixel values
    const depthImage = new Image()
    depthImage.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = depthImage.width
      canvas.height = depthImage.height
      ctx.drawImage(depthImage, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const depthData = imageData.data
      
      // Create a plane geometry with subdivisions
      const segmentsX = resolution
      const segmentsY = Math.floor(resolution * (height / width))
      const geometry = new THREE.PlaneGeometry(4, 4 * (height / width), segmentsX, segmentsY)
      
      // Apply displacement to vertices
      const positions = geometry.attributes.position.array
      const depthScale = depthStrength / 100
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = (positions[i] + 2) / 4  // normalize from [-2, 2] to [0, 1]
        const y = 1 - ((positions[i + 1] + 2) / 4) // normalize and flip y
        
        // Sample depth map
        const pixelX = Math.floor(x * (canvas.width - 1))
        const pixelY = Math.floor(y * (canvas.height - 1))
        const pixelIndex = (pixelY * canvas.width + pixelX) * 4
        
        // Use depth value to displace vertex along z-axis
        positions[i + 2] = (depthData[pixelIndex] / 255) * depthScale
      }
      
      // Update vertex positions
      geometry.attributes.position.needsUpdate = true
      
      // Recalculate normals
      geometry.computeVertexNormals()
      
      // Create material with textures
      const material = new THREE.MeshStandardMaterial({
        map: diffuseTexture,
        displacementMap: depthTexture,
        displacementScale: 0, // We already displaced vertices
        side: THREE.DoubleSide,
        flatShading: false
      })
      
      // Remove existing mesh if any
      if (meshRef.current && sceneRef.current) {
        sceneRef.current.remove(meshRef.current)
      }
      
      // Create mesh and add to scene
      const mesh = new THREE.Mesh(geometry, material)
      sceneRef.current.add(mesh)
      meshRef.current = mesh
    }
    
    depthImage.src = depthMapUrl
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
}

export default ThreeScene
