import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function HtmlTable2Csv() {
  const [htmlCode, setHtmlCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleHtmlChange = (e) => {
    setHtmlCode(e.target.value)
  }

  const convertHtmlTableToCsv = () => {
    setLoading(true)
    try {
      // Create a DOM parser
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlCode, 'text/html')
      
      // Find the first table in the HTML
      const table = doc.querySelector('table')
      
      if (!table) {
        alert('No table found in the provided HTML')
        setLoading(false)
        return
      }
      
      // Get all rows
      const rows = table.querySelectorAll('tr')
      const csvRows = []
      
      // Process each row
      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th')
        const csvRow = []
        
        // Process each cell
        cells.forEach(cell => {
          // Remove commas and quotes to avoid CSV formatting issues
          let text = cell.textContent.trim().replace(/"/g, '""')
          
          // Wrap the content in quotes if it contains commas, newlines, or quotes
          if (text.includes(',') || text.includes('\n') || text.includes('"')) {
            text = `"${text}"`
          }
          
          csvRow.push(text)
        })
        
        // Add the row to our CSV rows
        csvRows.push(csvRow.join(','))
      })
      
      // Combine all rows into a CSV string
      const csvContent = csvRows.join('\n')
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'table.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
    } catch (error) {
      alert(`Error converting table: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>HTML Table to CSV Converter</title>
        <meta name="description" content="Convert HTML Table to CSV" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          HTML Table to CSV Converter
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Paste your HTML table code and download it as CSV.</span>

        <textarea
          value={htmlCode}
          onChange={handleHtmlChange}
          placeholder="Paste your HTML table code here"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            height: '300px',
          }}
        />

        <button onClick={convertHtmlTableToCsv}>
          {loading ? 'Converting...' : 'Download as CSV'}
        </button>
      </main>
    </>
  )
}