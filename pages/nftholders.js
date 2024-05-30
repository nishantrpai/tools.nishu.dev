// enter contract address and get all holders
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function NFTHolders() {

  const [contract, setContract] = useState('');
  const [holders, setHolders] = useState([]);

  function getPageURL(contract, page) {
    // let proxy = 'https://cors-proxy-production-a6e6.up.railway.app/?url=';
    let url = `https://etherscan.io/token/generic-tokenholders2?m=light&a=${contract}&s=5147&sid=0aa60146f4a6765e6bfcdfcee5e02a2a&p=${page}`;
    // return `${proxy}${url}`
  }

  const getTokenHolders = async (tokenAddress) => {
    const holders = {};
  
    // Define the Transfer event signature
    const transferEventSignature = web3.utils.sha3('Transfer(address,address,uint256)');
  
    // Get all past Transfer events
    const events = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: tokenAddress,
      topics: [transferEventSignature]
    });
  
    // Process each event
    events.forEach(event => {
      const from = '0x' + event.topics[1].slice(26);
      const to = '0x' + event.topics[2].slice(26);
      const value = web3.utils.toBN(event.data);
  
      if (!holders[from]) {
        holders[from] = web3.utils.toBN(0);
      }
      if (!holders[to]) {
        holders[to] = web3.utils.toBN(0);
      }
  
      holders[from] = holders[from].sub(value);
      holders[to] = holders[to].add(value);
    });
  
    // Filter out addresses with zero balance
    const filteredHolders = Object.keys(holders).filter(address => holders[address].gt(web3.utils.toBN(0)));
  
    return filteredHolders.map(address => ({
      address,
      balance: holders[address].toString()
    }));
  };
  

  async function getHolders(contract) {
    // api to get all holders
    return new Promise((resolve, reject) => {


      // keep fetching all pages until no more data, or page 10
      Promise.all(Array.from({ length: 4 }, (_, i) => {
        // add 3 second timeout to avoid rate limiting
        setTimeout(() => {
          console.log(`Fetching page ${i + 1}`);
          fetch(getPageURL(contract, i + 1), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if (data.holders) {
                setHolders([...holders, ...data.holders]);
              }
            });
        }, 10000 * i);
      }))
    });
  }

  useEffect(() => {
    if (!contract) return;
    getHolders(contract);
  }, [contract]);


  const PiChart = ({ shares }) => {
    const radius = 100; // Radius of the pie chart
    const centerX = 120; // Center X coordinate
    const centerY = 120; // Center Y coordinate
    let cumulativeAngle = 0; // Starting angle

    let total = shares.reduce((acc, value) => acc + value, 0);
    let remaining = 1 - total;
    if (remaining > 0) {
      shares.push(remaining);
    }

    // Function to convert polar to cartesian coordinates
    const polarToCartesian = (cx, cy, radius, angle) => {
      const angleRad = (angle - 90) * (Math.PI / 180.0);
      return {
        x: cx + radius * Math.cos(angleRad),
        y: cy + radius * Math.sin(angleRad)
      };
    };

    // Function to create an SVG path for a pie slice
    const createPieSlice = (startAngle, endAngle) => {
      const start = polarToCartesian(centerX, centerY, radius, startAngle);
      const end = polarToCartesian(centerX, centerY, radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      const d = [
        `M ${centerX} ${centerY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        "Z"
      ].join(" ");

      return d;
    }
    // Generate pie slices
    const slices = shares.map((value, index) => {
      const sliceAngle = value * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle += sliceAngle;

      return (
        <path
          key={index}
          className="pie-slice"
          id={`pie-slice-${index}`}
          d={createPieSlice(startAngle, endAngle)}
          fill={`hsl(0, 0%, ${100 - index * (100 / shares.length)}%)`}
        />
      );
    });

    return (
      <svg width="480" height="480" viewBox="0 0 240 240">
        {slices}
      </svg>
    );

  }


  return (
    <>
      <Head>
        <title>NFT Holders</title>
        <meta name="keywords" content="NFT Holders" />
        <meta name="description" content="Get aggregated view of NFT holders" />
      </Head>
      <main>
        <h1 className={styles.title}>NFT Holders</h1>
        <p className={styles.description}>Enter contract address and get all holders</p>
        <input type="text" placeholder="Enter contract address" style={{
          padding: '10px',
          width: '100%',
          margin: '10px 0',
          fontSize: '16px',
          border: '1px solid #333',
          background: '#000',
          borderRadius: '5px',
        }}
          onChange={(e) => setContract(e.target.value)}
        />
        <button>
          Get Holders
        </button>

        {/* visualize holder using holder share as pi chart */}
        <PiChart
          shares={holders.map(holder => holder.share)}
        />
      </main>
    </>
  )
}