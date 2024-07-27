// generate preview mirror page preview for socials
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

export default function MirrorPreview() {
  const [backgroundType, setBackgroundType] = useState('cover')
  async function parseLink(link) {
    // fetch link parse og:image, og:title, og:description
    return new Promise((resolve, reject) => {
      fetch(`https://api.codetabs.com/v1/proxy/?quest=${link}`)
        .then(response => response.text())
        .then(data => {
          // parse html 
          const parser = new DOMParser()
          const html = parser.parseFromString(data, 'text/html')
          let author = html.querySelector('link[rel="icon"]')
          if (author && author.getAttribute('href').charAt(0) === '/') {
            let domain = link.split('/')[2]
            if (!domain.startsWith('http')) domain = `https://${domain}`
            author.setAttribute('href', `${domain}${author.getAttribute('href')}`)
          }
          let favicon = html.querySelector('link[rel="shortcut icon"]')
          // if favicon href is relative, add link to it
          if (favicon && favicon.getAttribute('href').charAt(0) === '/') {
            let domain = link.split('/')[2]
            // add https if not present
            if (!domain.startsWith('http')) domain = `https://${domain}`
            favicon.setAttribute('href', `${domain}${favicon.getAttribute('href')}`)
          }
          const ogImage = html.querySelector('meta[property="og:image"]')
          const ogTitle = html.querySelector('meta[property="og:title"]')
          const ogDescription = html.querySelector('meta[property="og:description"]')
          resolve({
            ogImage: ogImage ? ogImage.getAttribute('content') : null,
            ogTitle: ogTitle ? ogTitle.getAttribute('content') : null,
            ogDescription: ogDescription ? ogDescription.getAttribute('content') : null,
            author: author ? author.getAttribute('href') : null,
            favicon: favicon ? favicon.getAttribute('href') : null
          })
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  const [link, setLink] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!link) return;
    parseLink(link).then(data => {
      console.log(data)
      // for each link add proxy https://api.codetabs.com/v1/proxy/?quest=
      let proxy = `https://api.codetabs.com/v1/proxy/?quest=`
      Object.keys(data).forEach(key => {
        if (data[key].startsWith('http')) {
          data[key] = `${proxy}${data[key]}`
        }
      })
      setPreview(data)
    })

  }, [link])

  return (
    <>
      <Head>
        <title>Mirror Preview</title>
        <meta name="description" content="Mirror Preview for Socials" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Mirror Preview for Socials
        </h1>
        <p className={styles.description}>
          Create previews from mirror  posts for socials
        </p>
        <div className={styles.searchContainer} style={{ marginTop: 0, marginBottom: 1 }}>
          <input className={styles.search} type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder='Enter link' />
        </div>
        {/* div will have divs and elements stacked over each at different z indices */}
        {!preview ? <div style={{ width: '100%', height: 500, borderRadius: 0, border: '1px solid transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Add mirror link to preview</div> :

          <div style={{ position: 'relative', width: '100%', height: 500, borderRadius: 0, overflow: 'hidden', border: '1px solid transparent' }} id="preview">
            {/* <img src={preview?.ogImage} style={{ width: '100%', height: 'auto', borderRadius: 0 }} /> */}
            {/* make a div with background ogImage of 100% 100% width no repeat cover */}
            <div style={{ width: '100%', height: '100%', background: `url(${preview?.ogImage}) no-repeat center center`, backgroundSize: backgroundType, borderRadius: 0 }}></div>
            {/* make a div with transparent black but the transparency decreases as we reach bottom */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,1))', borderRadius: 0 }}></div>
            {/* make a div with text and title */}
            {/* draw favicon on top left  */}
            <img src={preview?.author} style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderRadius: 5 }} />
            {/* next to image 10px away add domain in uppercase helvetic bold */}
            <div style={{ position: 'absolute', top: 25, left: 60, color: 'white', fontFamily: 'Helvetica', fontWeight: '100', textTransform: 'uppercase' }}>{new URL(link).hostname}</div>
            {/* add title 20px away from top */}
            {/* on top right similar distance as author we'll draw favicon with grayscale filter */}
            <img src={preview?.favicon} style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderRadius: 5, filter: 'opacity(0.85)' }} />
            {/* add title 20px away from top */}
            {/* below author image 50px atleast we'll in bold have the title */}
            <div style={{ position: 'absolute', top: 80, left: 20, color: 'white', fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: '2rem' }}>{preview?.ogTitle.toUpperCase()}</div>
            {/* add description 50px below the title in normal font */}
            <div style={{ position: 'absolute', top: 350, left: 20, color: '#fff', opacity: 0.8, fontFamily: 'Helvetica', fontSize: '1.1rem', fontWeight: '100', lineHeight: 2 }}>{preview?.ogDescription}</div>

          </div>}

        {/* add radio button to switch between cover and contain for bg */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, marginTop: 20, width: '100%' }}>
          <span style={{
            fontWeight: 'bold'
          }}>Background</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="radio" name="background" checked={backgroundType === 'cover'} onChange={() => setBackgroundType('cover')} />
            Cover
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="radio" name="background" checked={backgroundType === 'contain'} onChange={() => setBackgroundType('contain')} />
            Contain
          </label>
          {/* add other types as well */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="radio" name="background" checked={backgroundType === 'fill'} onChange={() => setBackgroundType('fill')} />
            Fill
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="radio" name="background" checked={backgroundType === '100% 100%'} onChange={() => setBackgroundType('100% 100%')} />
            100% 100%
          </label>

          {/* copy and download buttons for preview */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: 'auto', width: '100%' }}>
            <button onClick={() => {
              html2canvas(document.getElementById('preview'), {
                allowTaint: true,
                backgroundColor: '#000',
                useCORS: true,
                scale: 4
              }).then(canvas => {
                const link = document.createElement('a')
                link.download = 'preview.png'
                link.href = canvas.toDataURL()
                link.click()
              })
            }}>Download</button>
            <button id="copy-btn" onClick={() => {
              document.getElementById('copy-btn').innerText = 'Copied!'
              setTimeout(() => {
                document.getElementById('copy-btn').innerText = 'Copy'
              }, 2000)
              html2canvas(document.getElementById('preview'), {
                allowTaint: true,
                backgroundColor: '#000',
                useCORS: true,
                scale: 4
              }).then(canvas => {
                // copy to navigator clipboard as image
                canvas.toBlob(blob => {
                  navigator.clipboard.write([
                    new ClipboardItem({
                      'image/png': blob
                    })
                  ])

                })
              })

            }}>Copy</button>
          </div>
        </div>
      </main>
    </>
  )

}