import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AskAll() {
  const [query, setQuery] = useState('')
  const [aiServices, setAiServices] = useState([
    { name: 'Grok', url: 'https://x.com/i/grok?text=%s', checked: true },
    { name: 'ChatGPT', url: 'https://chatgpt.com/?q=%s', checked: true },
    { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=%s', checked: true },
    { name: 'Claude', url: 'https://claude.ai/new?q=%s', checked: true },
    { name: 'Mistral', url: 'https://chat.mistral.ai/chat?q=%s', checked: true },
  ])
  const router = useRouter()

  useEffect(() => {
    // Check URL params for query
    if (router.query.q) {
      setQuery(router.query.q)
      if (router.query.auto === 'true') {
        // Auto-open tabs if ?auto=true is set
        openTabs(router.query.q)
      }
    }
  }, [router.query])
  
  const updateAiServiceCheck = (index, checked) => {
    const updatedServices = [...aiServices]
    updatedServices[index].checked = checked
    setAiServices(updatedServices)
  }

  const openTabs = (queryText) => {
    if (!queryText.trim()) return
    
    const encodedQuery = encodeURIComponent(queryText)
    
    aiServices.forEach(service => {
      if (service.checked) {
        const url = service.url.replace('%s', encodedQuery)
        window.open(url, '_blank')
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    openTabs(query)
  }

  const copyShareableLink = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}/askall`
    const queryParam = query ? `?q=${encodeURIComponent(query)}&auto=true` : ''
    const fullUrl = baseUrl + queryParam
    
    navigator.clipboard.writeText(fullUrl)
    alert('Shareable link copied to clipboard!')
  }

  return (
    <>
      <Head>
        <title>Ask All AI Assistants</title>
        <meta name="description" content="Ask multiple AI assistants the same question at once" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Ask All AI Assistants
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Open multiple AI assistants with the same query
        </span>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '20px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              marginBottom: '10px'
            }}
          />

          <div style={{ marginBottom: '20px' }}>
            {aiServices.map((service, index) => (
              <div key={service.name} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={service.checked}
                    onChange={(e) => updateAiServiceCheck(index, e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  {service.name}
                </label>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className={styles.button}>
              Open Selected AI Tabs
            </button>
            
            <button 
              type="button" 
              className={styles.button}
              onClick={copyShareableLink}
              style={{ background: '#555' }}
            >
              Copy Shareable Link
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
          <p>Tip: You can share a link that automatically opens AI assistants by adding <code>?q=your question&auto=true</code> to the URL.</p>
        </div>
      </main>
    </>
  )
}