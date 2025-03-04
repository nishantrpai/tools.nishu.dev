import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

const ThreeScene = ({ modelData }) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
  const mirrorMeshRef = useRef(null)
  
  // Initialize and update Three.js scene
  useEffect(() => {
    if (!containerRef.current || !modelData) return
    
    // Setup scene
    const scene = new THREE.Scene()
    
    // If hasTransparency is true, set scene background to transparent
    if (modelData.hasTransparency) {
      scene.background = null // This makes the background transparent
    } else {
      scene.background = new THREE.Color(0xffffff)
    }
    
    sceneRef.current = scene
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    )
    camera.position.z = 5
    
    // Setup renderer with alpha support for transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable alpha channel for transparent rendering
    })
    
    // Set clear color with alpha 0 for transparency
    if (modelData.hasTransparency) {
      renderer.setClearColor(0x000000, 0) // Second parameter 0 is alpha (fully transparent)
    }
    
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
      modelData.resolution,
      modelData.hasTransparency,
      modelData.enable360View
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
        
        // If we have a 360 view with a mirror mesh, create a group containing both meshes
        let exportObject = meshRef.current;
        if (modelData.enable360View && mirrorMeshRef.current) {
          const group = new THREE.Group();
          group.add(meshRef.current.clone());
          group.add(mirrorMeshRef.current.clone());
          exportObject = group;
        }
        
        const stl = exporter.parse(exportObject, { binary: true })
        
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
  const createMeshFromDepthMap = (imageUrl, depthMapUrl, width, height, depthStrength, resolution, hasTransparency, enable360View) => {
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
      
      // Track the maximum depth for proper mirror positioning
      let maxDepth = 0
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = (positions[i] + 2) / 4  // normalize from [-2, 2] to [0, 1]
        const y = 1 - ((positions[i + 1] + 2) / 4) // normalize and flip y
        
        // Sample depth map
        const pixelX = Math.floor(x * (canvas.width - 1))
        const pixelY = Math.floor(y * (canvas.height - 1))
        const pixelIndex = (pixelY * canvas.width + pixelX) * 4
        
        // Use depth value to displace vertex along z-axis
        const depth = (depthData[pixelIndex] / 255) * depthScale
        positions[i + 2] = depth
        
        // Track maximum depth for mirror positioning
        maxDepth = Math.max(maxDepth, depth)
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
        flatShading: false,
        transparent: hasTransparency,
        alphaTest: hasTransparency ? 0.1 : 0 // Use alphaTest to determine which pixels to render
      })
      
      // Remove existing mesh if any
      if (meshRef.current && sceneRef.current) {
        sceneRef.current.remove(meshRef.current)
      }
      
      // If we have a mirror mesh, remove it too
      if (mirrorMeshRef.current && sceneRef.current) {
        sceneRef.current.remove(mirrorMeshRef.current)
        mirrorMeshRef.current = null
      }
      
      // Create mesh and add to scene
      const mesh = new THREE.Mesh(geometry, material)
      sceneRef.current.add(mesh)
      meshRef.current = mesh
      
      // If 360 view is enabled, create a mirrored mesh for the back
      if (enable360View) {
        // Clone the geometry and material
        const mirrorGeometry = geometry.clone()
        const mirrorMaterial = material.clone()
        
        // Create the mirror mesh
        const mirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorMaterial)
        
        // Rotate it to face backward
        mirrorMesh.rotation.y = Math.PI * -1;
        
        // Position it based on the maximum depth to create a seamless 360° model
        // Multiply by 2 to account for the full thickness of the model
        mirrorMesh.position.z += maxDepth // Small additional offset to prevent z-fighting
        
        // Add to scene
        sceneRef.current.add(mirrorMesh)
        mirrorMeshRef.current = mirrorMesh
      }
    }
    
    depthImage.src = depthMapUrl
  }

  // Add a CSS class to the container if transparency is enabled
  const containerStyle = {
    width: '100%',
    height: '100%',
    ...(modelData?.hasTransparency && { 
      backgroundColor: 'transparent',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    })
  }

  return <div ref={containerRef} style={containerStyle}></div>
}

export default ThreeScene
