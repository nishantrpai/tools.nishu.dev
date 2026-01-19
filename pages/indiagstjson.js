// India GST JSON/CSV Generator
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [gstin, setGstin] = useState('');
  const [fp, setFp] = useState(''); // Format: MMYYYY
  const [filingType, setFilingType] = useState('M'); // M for Monthly, Q for Quarterly
  const [outputFormat, setOutputFormat] = useState('json'); // json or csv
  const [exportType, setExportType] = useState('WOPAY'); // WOPAY or WPAY

  async function handleFileChange(event) {
    const files = Array.from(event.target.files);
    const extractedInvoices = [];

    for (const file of files) {
      const reader = new FileReader();
      
      const invoiceData = await new Promise((resolve) => {
        reader.onload = async () => {
          const arrayBuffer = reader.result;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const data = await extractInvoiceFromPDF(pdf, file.name);
          resolve(data);
        };
        reader.readAsArrayBuffer(file);
      });

      if (invoiceData) {
        extractedInvoices.push(invoiceData);
      }
    }

    setInvoices(prev => [...prev, ...extractedInvoices]);
  }

  async function extractInvoiceFromPDF(pdf, filename) {
    let text = '';
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(' ') + '\n';
    }

    // Parse Stripe invoice data
    const invoice = parseStripeInvoice(text, filename);
    return invoice;
  }

  function parseStripeInvoice(text, filename) {
    // Extract invoice details from Stripe PDF text
    // This is a basic parser - adjust regex patterns based on your actual Stripe invoice format
    
    const invoiceNumberMatch = text.match(/Invoice\s+#?\s*([A-Z0-9-]+)/i) || 
                               text.match(/Invoice Number[:\s]+([A-Z0-9-]+)/i);
    const dateMatch = text.match(/Date[:\s]+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i) ||
                      text.match(/(\d{1,2}\s+\w+\s+\d{4})/i);
    const amountMatch = text.match(/Total[:\s]+\$?([\d,]+\.?\d*)/i) ||
                        text.match(/Amount[:\s]+\$?([\d,]+\.?\d*)/i);
    const taxMatch = text.match(/Tax[:\s]+\$?([\d,]+\.?\d*)/i) ||
                     text.match(/GST[:\s]+\$?([\d,]+\.?\d*)/i);

    const invoiceNumber = invoiceNumberMatch ? invoiceNumberMatch[1] : filename.replace('.pdf', '');
    const invoiceDate = dateMatch ? formatDate(dateMatch[1]) : formatDate(new Date().toLocaleDateString());
    const totalAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
    const taxAmount = taxMatch ? parseFloat(taxMatch[1].replace(/,/g, '')) : 0;

    // Calculate taxable value and rate
    const taxableValue = totalAmount - taxAmount;
    const taxRate = taxAmount > 0 ? Math.round((taxAmount / taxableValue) * 100) : 0;

    return {
      invoiceNumber,
      invoiceDate,
      totalAmount,
      taxableValue,
      taxAmount,
      taxRate,
      cessAmount: 0
    };
  }

  function formatDate(dateStr) {
    // Convert various date formats to DD-MM-YYYY
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function generateGSTR1JSON() {
    const gstr1Data = {
      gstin: gstin,
      fp: fp,
      filing_typ: filingType,
      gt: 0.0,
      cur_gt: 0.0,
      exp: [
        {
          inv: invoices.map(inv => ({
            itms: [{
              csamt: inv.cessAmount,
              rt: inv.taxRate,
              txval: inv.taxableValue,
              iamt: inv.taxAmount
            }],
            val: inv.totalAmount,
            flag: "N",
            idt: inv.invoiceDate,
            inum: inv.invoiceNumber,
            chksum: generateChecksum(inv)
          })),
          exp_typ: exportType
        }
      ],
      fil_dt: formatDate(new Date().toLocaleDateString())
    };

    return gstr1Data;
  }

  function generateChecksum(invoice) {
    // Generate a simple checksum (in production, use proper crypto hash)
    const str = JSON.stringify(invoice);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  function generateExpCSV() {
    // Generate CSV for export invoices (exp.csv format)
    let csv = 'Export Type,Invoice Number,Invoice date,Invoice Value,Port Code,Shipping Bill Number,Shipping Bill Date,Rate,Taxable Value,Cess Amount\n';
    
    invoices.forEach(inv => {
      csv += `${exportType},${inv.invoiceNumber},${inv.invoiceDate},${inv.totalAmount},,,,,${inv.taxRate},${inv.taxableValue},${inv.cessAmount}\n`;
    });

    return csv;
  }

  function generateB2BCSV() {
    // Generate CSV for B2B invoices (b2b,sez,de.csv format)
    let csv = 'GSTIN/UIN of Recipient,Receiver Name,Invoice Number,Invoice date,Invoice Value,Place Of Supply,Reverse Charge,Applicable % of Tax Rate,Invoice Type,E-Commerce GSTIN,Rate,Taxable Value,Cess Amount\n';
    
    invoices.forEach(inv => {
      csv += `,,${inv.invoiceNumber},${inv.invoiceDate},${inv.totalAmount},,,,,,,${inv.taxRate},${inv.taxableValue},${inv.cessAmount}\n`;
    });

    return csv;
  }

  function downloadJSON() {
    const data = generateGSTR1JSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gstr1_${fp}_${gstin}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCSV(type = 'exp') {
    let csv = type === 'exp' ? generateExpCSV() : generateB2BCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gstr1_${type}_${fp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeInvoice(index) {
    setInvoices(prev => prev.filter((_, i) => i !== index));
  }

  function updateInvoice(index, field, value) {
    setInvoices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Recalculate if needed
      if (field === 'taxableValue' || field === 'taxAmount') {
        updated[index].totalAmount = updated[index].taxableValue + updated[index].taxAmount;
      }
      if (field === 'taxableValue' && updated[index].taxAmount > 0) {
        updated[index].taxRate = Math.round((updated[index].taxAmount / updated[index].taxableValue) * 100);
      }
      return updated;
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>India GST GSTR1 Generator</title>
        <meta name="description" content="Generate GSTR1 JSON and CSV from Stripe invoices" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js"></script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          India GST GSTR1 Generator
        </h1>
        <h2 className={styles.description}>
          Convert Stripe invoice PDFs to GSTR1 JSON/CSV format
        </h2>

        <div style={{ maxWidth: '1200px', width: '100%', padding: '20px' }}>
          {/* Configuration Section */}
          <div style={{ 
            background: '#111', 
            border: '1px solid #333', 
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3>Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>GSTIN:</label>
                <input 
                  type="text" 
                  value={gstin} 
                  onChange={e => setGstin(e.target.value)}
                  placeholder="27DKRPP5069Q1ZV"
                  style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#000', border: '1px solid #333', color: '#fff' }}
                />
              </div>
              <div>
                <label>Filing Period (MMYYYY):</label>
                <input 
                  type="text" 
                  value={fp} 
                  onChange={e => setFp(e.target.value)}
                  placeholder="122024"
                  style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#000', border: '1px solid #333', color: '#fff' }}
                />
              </div>
              <div>
                <label>Filing Type:</label>
                <select 
                  value={filingType} 
                  onChange={e => setFilingType(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#000', border: '1px solid #333', color: '#fff' }}
                >
                  <option value="M">Monthly</option>
                  <option value="Q">Quarterly</option>
                </select>
              </div>
              <div>
                <label>Export Type:</label>
                <select 
                  value={exportType} 
                  onChange={e => setExportType(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#000', border: '1px solid #333', color: '#fff' }}
                >
                  <option value="WOPAY">Export without payment of tax (WOPAY)</option>
                  <option value="WPAY">Export with payment of tax (WPAY)</option>
                </select>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div style={{ 
            background: '#111', 
            border: '1px solid #333', 
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3>Upload Invoice PDFs</h3>
            <input 
              type="file" 
              accept="application/pdf" 
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: '10px' }}
            />
            <p style={{ fontSize: '14px', color: '#888' }}>
              Upload Stripe invoice PDFs (multiple files supported)
            </p>
          </div>

          {/* Invoices Table */}
          {invoices.length > 0 && (
            <div style={{ 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              overflowX: 'auto'
            }}>
              <h3>Invoices ({invoices.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Invoice #</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Taxable Value</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Tax Rate %</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Tax Amount</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px' }}>
                        <input 
                          type="text" 
                          value={inv.invoiceNumber}
                          onChange={e => updateInvoice(idx, 'invoiceNumber', e.target.value)}
                          style={{ background: '#000', border: '1px solid #333', padding: '4px', color: '#fff', width: '120px' }}
                        />
                      </td>
                      <td style={{ padding: '10px' }}>
                        <input 
                          type="text" 
                          value={inv.invoiceDate}
                          onChange={e => updateInvoice(idx, 'invoiceDate', e.target.value)}
                          style={{ background: '#000', border: '1px solid #333', padding: '4px', color: '#fff', width: '100px' }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <input 
                          type="number" 
                          value={inv.taxableValue}
                          onChange={e => updateInvoice(idx, 'taxableValue', parseFloat(e.target.value))}
                          style={{ background: '#000', border: '1px solid #333', padding: '4px', color: '#fff', width: '100px', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <input 
                          type="number" 
                          value={inv.taxRate}
                          onChange={e => updateInvoice(idx, 'taxRate', parseFloat(e.target.value))}
                          style={{ background: '#000', border: '1px solid #333', padding: '4px', color: '#fff', width: '60px', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <input 
                          type="number" 
                          value={inv.taxAmount}
                          onChange={e => updateInvoice(idx, 'taxAmount', parseFloat(e.target.value))}
                          style={{ background: '#000', border: '1px solid #333', padding: '4px', color: '#fff', width: '100px', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        {inv.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <button 
                          onClick={() => removeInvoice(idx)}
                          style={{ 
                            background: '#d00', 
                            border: 'none', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#fff'
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Export Section */}
          {invoices.length > 0 && (
            <div style={{ 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3>Export</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={downloadJSON}
                  style={{ 
                    background: '#0070f3', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Download GSTR1 JSON
                </button>
                <button 
                  onClick={() => downloadCSV('exp')}
                  style={{ 
                    background: '#0070f3', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Download Export CSV
                </button>
                <button 
                  onClick={() => downloadCSV('b2b')}
                  style={{ 
                    background: '#0070f3', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Download B2B CSV
                </button>
              </div>
              
              {/* Preview */}
              <details style={{ marginTop: '20px' }}>
                <summary style={{ cursor: 'pointer', padding: '10px', background: '#000', borderRadius: '4px' }}>
                  Preview JSON
                </summary>
                <pre style={{ 
                  background: '#000', 
                  border: '1px solid #333', 
                  padding: '15px', 
                  borderRadius: '4px',
                  marginTop: '10px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(generateGSTR1JSON(), null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Instructions */}
          <div style={{ 
            background: '#111', 
            border: '1px solid #333', 
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3>Instructions</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Enter your GSTIN and Filing Period (MMYYYY format)</li>
              <li>Select filing type (Monthly/Quarterly) and export type</li>
              <li>Upload Stripe invoice PDFs (supports multiple files)</li>
              <li>Review and edit extracted invoice data in the table</li>
              <li>Download GSTR1 JSON or CSV files as needed</li>
            </ol>
            <p style={{ marginTop: '15px', fontSize: '14px', color: '#888' }}>
              Note: The PDF parser extracts basic invoice information. Please verify all data before filing.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
