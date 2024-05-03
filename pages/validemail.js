import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
const validator = require('email-validator');

export default function ValidEmail() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);


  const validateEmail = (email) => {
    // make call to server of email provider to check if email is valid
    return validator.validate(email);
  }

  useEffect(() => {
    // check if email is valid
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

  
    // setIsValid(isValidEmail(email));
    setIsValid(validateEmail(email));
  }, [email]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Valid Email</title>
        <meta name="description" content="Check if an email is valid" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Check if an email is valid
        </h1>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{border: '1px solid #333', width: '100%', padding: '10px', fontSize: '1.5rem', outline: 'none'}}
        />

        {isValid && <p style={{ fontSize: '2rem', marginTop: 20}}> ✅ Email is valid</p>}
        {!isValid && email && <p style={{ fontSize: '2rem', marginTop: 20}}>❌  Email is not valid</p>}
      </main>
    </div>
  )
}