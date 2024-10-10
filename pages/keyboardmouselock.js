import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiLock, FiUnlock } from 'react-icons/fi';

export default function KeyboardMouseLock() {
  const [isKeyboardLocked, setIsKeyboardLocked] = useState(false)
  const [isMouseLocked, setIsMouseLocked] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isKeyboardLocked) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      // Release mouse lock on Escape key press
      if (e.key === 'Escape' && isMouseLocked) {
        setIsMouseLocked(false)
      }
    }

    const handleMouseMove = (e) => {
      if (isMouseLocked) {
        e.preventDefault()
      }
    }

    const addKeyboardListeners = () => {
      window.addEventListener('keydown', handleKeyDown, true)
      window.addEventListener('keyup', handleKeyDown, true)
      window.addEventListener('keypress', handleKeyDown, true)
    }

    const removeKeyboardListeners = () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyDown, true)
      window.removeEventListener('keypress', handleKeyDown, true)
    }

    if (isKeyboardLocked) {
      addKeyboardListeners()
    } else {
      removeKeyboardListeners()
    }

    // Always add keydown listener for Escape key
    window.addEventListener('keydown', handleKeyDown)

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      removeKeyboardListeners()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isKeyboardLocked, isMouseLocked])

  const toggleKeyboardLock = () => {
    setIsKeyboardLocked(!isKeyboardLocked)
    setIsMouseLocked(false)
  }

  const toggleMouseLock = () => {
    setIsMouseLocked(!isMouseLocked)
    setIsKeyboardLocked(false)
  }

  return (
    <>
      <Head>
        <title>Keyboard Mouse Lock</title>
        <meta name="description" content="Lock your keyboard or mouse for cleaning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{maxWidth: '1500px'}}>
        <h1 className={styles.title}>
          Keyboard Mouse Lock
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Click on the keyboard or mouse to lock/unlock</span>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', width: '100%',padding: '20px', borderRadius: '10px'}}>
          <svg width="480" height="240" viewBox="0 0 240 120" style={{ marginRight: '40px', cursor: 'pointer' }} onClick={toggleKeyboardLock}>
            <rect width="240" height="100" rx="10" fill={isKeyboardLocked ? '#f26d6d' : '#333'} />
            <rect x="10" y="10" width="220" height="60" rx="6" fill={isKeyboardLocked ? '#f26d6d' : '#333'} />
            {[...Array(4)].map((_, i) => (
              <g key={i}>
                {[...Array(11)].map((_, j) => (
                  <rect key={j} x={6 + j * 21} y={12 + i * 19.5} width="18" height="16" rx="4" fill={isKeyboardLocked ? '#c22b2b' : '#555'} />
                ))}
              </g>
            ))}
            {/* <text x="120" y="110" textAnchor="middle" fill="white" fontSize="24">Keyboard</text> */}
          </svg>
          <svg width="120" height="180" viewBox="0 0 120 180" style={{ cursor: 'pointer' }} onClick={toggleMouseLock}>
            <path d="M60 0 C26.863 0 0 26.863 0 60 V120 C0 153.137 26.863 180 60 180 S120 153.137 120 120 V60 C120 26.863 93.137 0 60 0 Z" fill={isMouseLocked ? '#ff6b6b' : '#333'} />
            <rect x="55" y="10" width="10" height="30" rx="5" fill="#555" />
            <circle cx="60" cy="70" r="8" fill="#333" />
          </svg>
        </div>

        {(isKeyboardLocked || isMouseLocked) && (
          <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
            {isKeyboardLocked ? 'Keyboard Locked' : 'Keyboard Unlocked'}
            <br />
            {isMouseLocked ? 'Mouse Locked' : 'Mouse Unlocked'}
          </div>
        )}
        {isMouseLocked && (
          <div style={{ marginTop: '10px', fontSize: '16px', color: '#777' }}>
            Press Escape to unlock the mouse
          </div>
        )}
        {isKeyboardLocked && (
          <div style={{ marginTop: '10px', fontSize: '16px', color: '#777' }}>
            Click on the keyboard image to unlock
          </div>
        )}
      </main>
    </>
  )
}
