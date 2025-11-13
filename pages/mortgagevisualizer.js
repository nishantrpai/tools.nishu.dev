import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function MortgageVisualizer() {
  const [housePrice, setHousePrice] = useState(500000)
  const [downPayment, setDownPayment] = useState(100000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  const calculateMortgage = () => {
    const loanAmount = housePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12

    if (monthlyRate === 0) {
      const payment = loanAmount / numPayments
      setMonthlyPayment(payment)
      setTotalPayments(payment * numPayments)
      setTotalInterest(0)
      return
    }

    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    const totalPaid = payment * numPayments
    const totalInterestPaid = totalPaid - loanAmount

    setMonthlyPayment(payment)
    setTotalPayments(totalPaid)
    setTotalInterest(totalInterestPaid)
  }

  useEffect(() => {
    calculateMortgage()
  }, [housePrice, downPayment, interestRate, loanTerm])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const loanAmount = housePrice - downPayment
  const yearlyPayment = monthlyPayment * 12

  return (
    <>
      <Head>
        <title>Mortgage Visualizer</title>
        <meta name="description" content="Visualize your mortgage payments and affordability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          Mortgage Visualizer
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Calculate and visualize your mortgage payments
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'start' }}>
          {/* Left side - Inputs */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <h2 style={{ marginBottom: '20px' }}>Loan Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>House Price ($)</label>
                <input
                  type="number"
                  value={housePrice}
                  onChange={(e) => setHousePrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: '1px solid #333',
                    padding: '10px',
                    outline: 'none',
                    background: '#111',
                    color: '#fff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Down Payment ($)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: '1px solid #333',
                    padding: '10px',
                    outline: 'none',
                    background: '#111',
                    color: '#fff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: '1px solid #333',
                    padding: '10px',
                    outline: 'none',
                    background: '#111',
                    color: '#fff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Loan Term (years)</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: '1px solid #333',
                    padding: '10px',
                    outline: 'none',
                    background: '#111',
                    color: '#fff',
                  }}
                >
                  <option value={5}>5 years</option>
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                  <option value={30}>30 years</option>
                  <option value={50}>50 years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right side - Outputs */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '15px' }}>Loan Summary</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div style={{ padding: '15px', border: '1px solid #333', background: '#111' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Loan Amount</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(loanAmount)}</div>
                </div>
                <div style={{ padding: '15px', border: '1px solid #333', background: '#111' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Monthly Payment</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(monthlyPayment)}</div>
                </div>
                <div style={{ padding: '15px', border: '1px solid #333', background: '#111' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Total Payments</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(totalPayments)}</div>
                </div>
                <div style={{ padding: '15px', border: '1px solid #333', background: '#111' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Total Interest</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(totalInterest)}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: '15px' }}>Payment Schedule</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #333' }}>
                <thead>
                  <tr style={{ background: '#111' }}>
                    <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'left', color: '#fff' }}>Period</th>
                    <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>Monthly</th>
                    <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>Yearly</th>
                    {loanTerm > 5 && <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>5 Years</th>}
                    {loanTerm > 10 && <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>10 Years</th>}
                    <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #333', color: '#fff' }}>Payment Amount</td>
                    <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>{formatCurrency(monthlyPayment)}</td>
                    <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>{formatCurrency(yearlyPayment)}</td>
                    {loanTerm > 5 && <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>{formatCurrency(yearlyPayment * 5)}</td>}
                    {loanTerm > 10 && <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>{formatCurrency(yearlyPayment * 10)}</td>}
                    <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }}>{formatCurrency(totalPayments)}</td>
                  </tr>
                  <tr style={{ background: '#111' }}>
                    <td style={{ padding: '10px', border: '1px solid #333', color: '#fff' }}>Principal + Interest</td>
                    <td style={{ padding: '10px', border: '1px solid #333', textAlign: 'right', color: '#fff' }} colSpan={loanTerm <= 5 ? 3 : loanTerm <= 10 ? 4 : 5}>
                      {formatCurrency(monthlyPayment)} per month for {loanTerm} years
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
