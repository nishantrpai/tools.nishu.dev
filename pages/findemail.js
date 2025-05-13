import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiMail, FiSearch, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

export default function FindEmail() {
  const [domain, setDomain] = useState('')
  const [names, setNames] = useState('')
  const [emails, setEmails] = useState([])
  const [websiteEmails, setWebsiteEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [verificationStatus, setVerificationStatus] = useState({})

  const verifyEmail = async (email) => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setVerificationStatus(prev => ({
        ...prev,
        [email]: data
      }))
      return data
    } catch (error) {
      console.error('Error verifying email:', error)
      setVerificationStatus(prev => ({
        ...prev,
        [email]: { isValid: false, reason: 'Verification error' }
      }))
      return { isValid: false, reason: 'Verification error' }
    }
  }

  const generateEmails = async () => {
    if (!domain || !names) return
    
    setLoading(true)
    const nameList = names.split('\n').filter(n => n.trim())
    const emailFormats = [
      (f, l) => `${f}@${domain}`,
      (f, l) => `${f[0]}${l}@${domain}`,
      (f, l) => `${f}.${l}@${domain}`,
      (f, l) => `${f}_${l}@${domain}`,
      (f, l) => `${f}-${l}@${domain}`,
      (f, l) => `${l}${f[0]}@${domain}`,
      (f, l) => `${f}${l}@${domain}`,
      (f, l) => `${l}.${f}@${domain}`,
      (f, l) => `${l}_${f}@${domain}`,
      (f, l) => `${l}-${f}@${domain}`,
    ]

    const generatedEmails = []
    nameList.forEach(name => {
      const [firstName, ...lastParts] = name.toLowerCase().split(' ')
      const lastName = lastParts.join('')
      if (firstName && lastName) {
        emailFormats.forEach(format => {
          generatedEmails.push(format(firstName, lastName))
        })
      }
    })

    // Fetch website emails
    try {
      const url = `https://${domain}`
      let proxy = 'https://api.codetabs.com/v1/proxy/?quest='
      const response = await fetch(proxy + url, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Origin': 'https://www.google.com',
        }
      })
      const text = await response.text()
      setContent(text)
      
      // Find email addresses in content using regex
      const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g
      let foundEmails = text.match(emailRegex) || []
      foundEmails = [...new Set(foundEmails)] // Remove duplicates
      console.log('Found emails:', foundEmails)
      // Filter only emails from the specified domain
      setWebsiteEmails(foundEmails);
    } catch (error) {
      console.error('Error fetching website:', error)
    }

    setEmails(generatedEmails)
    
    // Start verification only for generated emails (not website emails)
    setVerificationStatus({})
    for (const email of generatedEmails) {
      if (!websiteEmails.includes(email)) {
        setVerificationStatus(prev => ({
          ...prev,
          [email]: { isValid: null, reason: 'Verifying...' }
        }))
        await verifyEmail(email)
      }
    }
    setLoading(false)
  }

  const getStatusIcon = (email) => {
    const status = verificationStatus[email]
    if (!status) return null
    if (status.isValid === null) return <FiLoader className="animate-spin" />
    if (status.isValid) return <FiCheckCircle style={{ color: '#4ade80' }} />
    return <FiXCircle style={{ color: '#ef4444' }} />
  }

  return (
    <>
      <Head>
        <title>Find Email Addresses</title>
        <meta name="description" content="Find email addresses for company contacts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignContent: 'center', fontFamily: 'monospace' }}>
          <FiMail /> Email Finder
        </h1>
        <h2 style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 200, color: '#888', marginBottom: '20px' }}>
          Generate and verify possible email addresses for company contacts
        </h2>

        <div style={{ display: 'flex', width: '100%', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flexBasis: '50%' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Company Domain:</label>
              <input 
                type="text" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #333', 
                  borderRadius: '5px',
                  background: 'none',
                  color: '#fff'
                }} 
                placeholder="example.com" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Names (one per line):</label>
              <textarea 
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  padding: '10px', 
                  border: '1px solid #333', 
                  borderRadius: '5px',
                  background: 'none',
                  color: '#fff'
                }} 
                placeholder="John Doe&#10;Jane Smith"
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={generateEmails}
              >
                Generate & Find Emails
              </button>
            </div>
          </div>

          <div style={{ flexBasis: '50%' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '14px' }}>Generated Email Formats:</h3>
              <div style={{ 
                border: '1px solid #333', 
                borderRadius: '5px', 
                padding: '10px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {emails.map((email, index) => (
                  <div key={index} style={{ 
                    padding: '5px',
                    borderBottom: index < emails.length - 1 ? '1px solid #333' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getStatusIcon(email)}
                      {/* <span style={{ fontSize: '12px', color: '#666' }}>
                        {verificationStatus[email]?.reason}
                      </span> */}
                    </span> 
                  </div>
                ))}
                {emails.length === 0 && (
                  <div style={{ color: '#666' }}>No emails generated yet</div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '14px' }}>
                Emails Found on Website:
                {loading && ' (Loading...)'}
              </h3>
              <div style={{ 
                border: '1px solid #333', 
                borderRadius: '5px', 
                padding: '10px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {websiteEmails.map((email, index) => (
                  <div key={index} style={{ 
                    padding: '5px',
                    borderBottom: index < websiteEmails.length - 1 ? '1px solid #333' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getStatusIcon(email)}
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {verificationStatus[email]?.reason}
                      </span>
                    </span>
                  </div>
                ))}
                {websiteEmails.length === 0 && !loading && (
                  <div style={{ color: '#666' }}>No emails found on website</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}