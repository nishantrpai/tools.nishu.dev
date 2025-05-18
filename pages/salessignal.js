// Search Query Generator for finding companies and founders
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'


export default function Home() {
  const [query, setQuery] = useState('')
  const [searchQueries, setSearchQueries] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const generateSearchQueries = async () => {
    setLoading(true)
    
    const prompt = `Create 8 highly effective search queries for finding companies and founders matching: "${query}"
    
    Format your queries to optimize for:
    1. Finding company websites and profiles
    2. Discovering founder names and profiles
    3. Locating contact information
    4. Identifying industry-specific platforms
    
    Include at least one query for each of these platforms:
    - LinkedIn company pages
    - Crunchbase organization listings
    - AngelList/Wellfound profiles
    - Company about/team pages
    - Twitter profiles
    - ProductHunt
    
    Each query should use proper Google search syntax with:
    - Precise site: operators with exact URL paths
    - Exact phrase matching with quotes
    - Boolean operators (AND, OR, NOT)
    - Parentheses for grouping when needed
    
    Return a JSON with:
    - originalQuery: the original query
    - enhancedQueries: array of search queries (8 total)
    - explanation: clear explanation of your approach and what each query targets`
    
    const systemPrompt = `You are an expert search query specialist with deep knowledge of search engines, Boolean operators, and platform-specific search techniques for finding company and founder information.
    
    Create highly precise, targeted search queries to find specific companies, startups, and their founders. Optimize queries for these key platforms:
    
    LinkedIn:
    - Use site:linkedin.com/company/ for company profiles
    - Use site:linkedin.com/in/ for founder/executive profiles
    - Use quotes for exact phrase matching
    
    Crunchbase:
    - Use site:crunchbase.com/organization/ for company data
    - Use site:crunchbase.com/person/ for founder profiles
    
    AngelList/Wellfound:
    - Use site:wellfound.com/company/ for startup profiles
    - Use site:wellfound.com/p/ for founder profiles
    
    YCombinator:
    - Use site:ycombinator.com/companies/ for YC companies
    
    ProductHunt:
    - Use site:producthunt.com/@username for founder profiles
    
    Twitter:
    - Use site:twitter.com/ for company and founder profiles
    
    Always format queries for maximum effectiveness:
    - Use exact quotes for multi-word phrases
    - Use AND, OR, NOT operators with correct syntax
    - Use parentheses for complex queries
    - Target specific URL paths whenever possible
    - Include industry/location terms when relevant`
    
    const res = await fetch(`/api/gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        prompt,
        system: systemPrompt,
        model: 'gpt-4o',
        response_format: { type: "json_object" }
      })
    })
    
    const data = await res.json()
    console.log('Response from API:', data)
    try {
      const result = JSON.parse(data.response || '{}')
      setSearchQueries(result)
    } catch (error) {
      console.error('Error parsing JSON response:', error)
      setSearchQueries({
        originalQuery: query,
        enhancedQueries: [],
        explanation: 'Error generating search queries. Please try again.'
      })
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Search Query Generator</title>
        <meta name="description" content="Generate optimized search queries for finding companies and founders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Search Query Generator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate highly effective search queries for finding companies and founders
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company or industry (e.g., AI healthcare startups)"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            marginBottom: '15px',
            borderRadius: '5px'
          }}
        />

        <button onClick={generateSearchQueries} className={styles.button}>
          {loading ? 'Generating...' : 'Generate Search Queries'}
        </button>

        {searchQueries && (
          <div style={{ 
            marginTop: '20px',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Search Queries for: {searchQueries.originalQuery}</h2>
            
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #333',
              borderRadius: '5px',
              background: '#111'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Explanation</h3>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>{searchQueries.explanation}</p>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Enhanced Queries</h3>
            <ul style={{ 
              padding: '0',
              margin: '0',
              listStyleType: 'none'
            }}>
              {searchQueries.enhancedQueries.map((query, index) => (
                <li key={index} style={{ 
                  padding: '12px',
                  margin: '10px 0',
                  background: '#000',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  position: 'relative'
                }}>
                  {query}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(query);
                      alert('Copied to clipboard!');
                    }}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      background: '#444',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
