import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiPlus, FiMinus, FiCopy } from 'react-icons/fi'

export default function Home() {
  const [text, setText] = useState(`John is a senior software engineer at Google. 
Yesterday he met Sarah, who is an architect. 
In the same room, Mike said he is a data scientist, 
but I'm not sure.`)
  const [regexPattern, setRegexPattern] = useState('\\b(\\w+)\\s+(is|am|are)\\s+(a|an)\\s+([A-Za-z][A-Za-z\\s\\-]+)\\b')
  const [flags, setFlags] = useState('g')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [highlightedText, setHighlightedText] = useState('')
  const [extractIndex, setExtractIndex] = useState('4')
  const [searchFilter, setSearchFilter] = useState('')



  const testRegex = () => {
    if (!regexPattern.trim() || !text.trim()) {
      setResult(null)
      setHighlightedText('')
      return
    }

    try {
      const regex = new RegExp(regexPattern, flags)
      const matches = []
      const extractedValues = []
      let match
      let lastIndex = 0
      let highlightedHtml = ''

      // Reset regex lastIndex to avoid issues with global flag
      regex.lastIndex = 0

      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        highlightedHtml += text.slice(lastIndex, match.index)
        
        // Add highlighted match
        highlightedHtml += `<span style="background-color: #ffff00; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${match[0]}</span>`
        
        // Store match data
        matches.push({
          match: match[0],
          groups: match.slice(1),
          index: match.index,
          input: text
        })

        // Extract values from capture groups
        match.slice(1).forEach((group, index) => {
          if (group !== undefined && group.trim()) {
            extractedValues.push({
              group: index + 1,
              value: group.trim(),
              matchIndex: matches.length - 1
            })
          }
        })

        lastIndex = match.index + match[0].length
        
        // Prevent infinite loop for zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
        
        // Break if not global to prevent infinite loop
        if (!flags.includes('g')) break
      }

      // Add remaining text
      highlightedHtml += text.slice(lastIndex)
      
      setHighlightedText(highlightedHtml)
      // Create column array for specific index
      let columnArray = extractIndex ? 
        matches.map(match => match.groups[parseInt(extractIndex) - 1] || '').filter(v => v.trim()) : []
      
      // Filter column array based on search filter
      if (searchFilter.trim()) {
        columnArray = columnArray.filter(value => 
          value.toLowerCase().includes(searchFilter.toLowerCase())
        )
      }
      
      setResult({
        matches,
        totalMatches: matches.length,
        extractedValues: extractedValues,
        columnArray: columnArray,
        extractIndex: parseInt(extractIndex),
        regexPattern,
        flags
      })
    } catch (error) {
      setResult({
        error: error.message
      })
      setHighlightedText('')
    }
  }

  // Test regex in real-time
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      testRegex()
    }, 300)
    
    return () => clearTimeout(debounceTimer)
  }, [regexPattern, flags, text, extractIndex, searchFilter])

  return (
    <>
      <Head>
        <title>Regex Tester & Extractor</title>
        <meta name="description" content="Test regular expressions and extract capture groups with live highlighting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style>{`
      .highlight::selection { background: #ffff00; color: #000; }
      .match-highlight::selection { background: #555; color: #fff; }
      `}</style>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Regex Tester & Extractor
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Test regular expressions and extract capture groups in real-time with live highlighting.</span>

        {/* Regex Pattern & Flags */}
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Regular Expression Pattern</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="Enter regex pattern, e.g., (\\w+)\\s+(is|am|are)\\s+(a|an)\\s+([A-Za-z\\s\\-]+)"
              style={{
                flex: 1,
                border: '1px solid #333',
                padding: '10px',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(`/${regexPattern}/${flags}`)}
              style={{
                padding: '10px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FiCopy /> Copy
            </button>
          </div>
        </div>

        {/* Regex Flags */}
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Regex Flags</label>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={flags.includes('g')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev + 'g')
                  } else {
                    setFlags(prev => prev.replace('g', ''))
                  }
                }}
              />
              <strong>g</strong> Global
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={flags.includes('i')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev + 'i')
                  } else {
                    setFlags(prev => prev.replace('i', ''))
                  }
                }}
              />
              <strong>i</strong> Ignore Case
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={flags.includes('m')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev + 'm')
                  } else {
                    setFlags(prev => prev.replace('m', ''))
                  }
                }}
              />
              <strong>m</strong> Multiline
            </label>
            <span style={{ marginLeft: '10px', fontFamily: 'monospace', color: '#777' }}>Current flags: /{flags}</span>
          </div>
        </div>

        {/* Extract Specific Group */}
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Extract Group as Column</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              value={extractIndex}
              onChange={(e) => setExtractIndex(e.target.value)}
              placeholder="Group number (e.g., 4)"
              min="1"
              style={{
                width: '150px',
                border: '1px solid #333',
                padding: '10px',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <span style={{ color: '#777', fontSize: '14px' }}>Extract all values from capture group #{extractIndex} as a column array</span>
          </div>
        </div>

        {/* Test Text */}
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Test Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your test text here..."
            style={{
              width: '100%',
              height: '150px',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'monospace'
            }}
          />
        </div>

       

        {/* Live Preview */}

        {/* Results */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>Results</h2>
            {result && !result.error && (
              <span style={{ color: '#777', fontSize: '14px' }}>
                {result.totalMatches} {result.totalMatches === 1 ? 'match' : 'matches'} found
              </span>
            )}
          </div>
          
          {result && !result.error && result.totalMatches > 0 ? (
            <div style={{ 
              border: '1px solid #333', 
              borderRadius: '8px', 
              background: '#000', 
              color: '#fff',
              overflow: 'hidden'
            }}>
               {/* Search Filter */}
        <div style={{ margin: 'auto', width: '95%' }}>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search extracted values..."
          />
          {searchFilter.trim() && result && result.columnArray && (
            <span style={{ color: '#777', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Showing {result.columnArray.length} of {result.extractedValues ? result.extractedValues.filter(ev => ev.group === parseInt(extractIndex)).length : 0} results
            </span>
          )}
        </div>
              {/* Column Array Section */}
              {result.columnArray && result.columnArray.length > 0 && (
                <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.columnArray.join('\n'))}
                    >
                      <FiCopy size={12} /> Copy Column
                    </button>
                  </div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                  }}>
                    {result.columnArray.map((value, index) => (
                      <div key={`column-${index}`} style={{ 
                        color: '#e6edf3',
                        marginBottom: '4px',
                        fontSize: '14px'
                      }}>
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              
              {/* All Matches Details */}
            </div>
          ) : result && !result.error ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              border: '1px solid #333', 
              borderRadius: '8px',
              background: '#1a1a1a',
              color: '#888'
            }}>
              No matches found. Try adjusting your regex pattern or test text.
            </div>
          ) : null}
        </div>

        {result && result.error && (
          <div style={{ padding: '10px', border: '1px solid #f00', borderRadius: 10, background: '#200', width: '100%', color: '#f00'}}>
            <p style={{margin: 0}}>Pattern Error: {result.error}</p>
          </div>
        )}
      </main>
    </>
  )
}
