import Head from "next/head";
import { useState } from "react";
import styles from '@/styles/Tool.module.css'

const DayDiff = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [diff, setDiff] = useState("");

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  const dateDiff = (timestamp1, timestamp2) => {
    let a = new Date(timestamp1);
    let b = new Date(timestamp2);
    const utc1 = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
    const utc2 = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
  };


  const handleDate1Change = (e) => {
    setDate1(e.target.value);
  };

  const handleDate2Change = (e) => {
    setDate2(e.target.value);
  };

  const handleCalculate = () => {
    const diff = dateDiff(date1, date2);
    setDiff(diff);
  };

  return (
    <>
    <Head>
      <title>Day Difference Calculator</title>
      <meta name="description" content="Calculate the difference between two dates in days." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <a href='/' className={styles.home}>🏠</a>
      <h1>Day Difference Calculator</h1>
      <input
        type="date"
        value={date1}
        onChange={handleDate1Change}
        placeholder="Enter date 1"
      />
      <input
        type="date"
        value={date2}
        onChange={handleDate2Change}
        placeholder="Enter date 2"
      />
      <button className={styles.copy} onClick={handleCalculate}>Calculate</button>
      <p>{diff}</p>
    </main>
    </>
  );
}

export default DayDiff;
