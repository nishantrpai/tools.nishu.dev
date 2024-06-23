// text to punk
import Head from 'next/head'
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Text2Punk() {
  const [punkID, setPunkID] = useState(null)
  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://rpc.eth.gateway.fm',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }

  const PUNK_CONTRACT = "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2"

  const getPunkData = async (id) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS['ETHEREUM'].rpc)
      const contract = new ethers.Contract(PUNK_CONTRACT, [
        'function punkAttributes(uint256) external view returns (string memory)',
      ], provider)
      console.log('contract', contract)
      const svg = await contract.punkAttributes(id)
      console.log('svg', svg)
      return { svg }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!punkID) return
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    getPunkData(punkID).then((data) => {
      console.log(data)
      if(!data) return;
      const img = new Image()
      img.src = data.svg
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    })

  }, [punkID])

  return (
    <>
      <main>
        <input type="number" value={punkID} onChange={(e) => setPunkID(e.target.value)} style={{
          border: '1px solid #888'
        }} />
        <canvas id="canvas" width="1000" height="1000"></canvas>

      </main>
    </>
  )

}