import cheerio from 'cheerio'

function parseNftHtmlToJson(response) {
  const html = response.d.data[0].NftColumn || ''
  const $ = cheerio.load(html)

  const items = $('.nft-block-wrapper').map((i, el) => {
    const linkHref = $(el).find("a[href^='/nft/']").attr('href') || ''
    const imgSrc = $(el).find('img').attr('src') || null
    const type = $(el).find('.nft-block-badge').text().trim() || null
    const tokenAnchorText = $(el).find(".text-truncate[href*='/token/']").first().text().trim() || null

    let contract = null
    let tokenId = null
    if (linkHref) {
      const parts = linkHref.split('/')
      contract = parts[2] || null
      tokenId = parts[3] || null
    } else {
      // fallback: try to parse token id from token anchors
      const tokenHref = $(el).find("a[href*='/token/']").last().attr('href') || ''
      if (tokenHref.includes('?a=')) {
        const parts = tokenHref.split('?a=')
        // sometimes token id is last part
        tokenId = parts[1] || null
      }
    }

    return {
      contract,
      token_id: tokenId,
      name: tokenAnchorText || null,
      type,
      image: imgSrc
    }
  }).get()

  return items
}

export default async function handler(req, res) {
  const { address, page = '1' } = req.query
  if (!address) {
    return res.status(400).json({ error: 'address required' })
  }

  const pageNumber = parseInt(page, 10) || 1
  const startIndex = (pageNumber - 1) * 12  // 12 items per page

  try {
    const response = await fetch('https://etherscan.io/address-nft-holding.aspx/GetNftDetails', {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        "dataTableModel": {
          "draw": pageNumber,
          "columns": [{"data":"NftColumn","name":"","searchable":true,"orderable":false,"search":{"value":"","regex":false}}],
          "order": [],
          "start": startIndex,
          "length": 12,
          "search": {"value":"","regex":false}
        },
        "model": {
          "address": address,
          "filteredContract": "",
          "hideZeroAssets": false,
          "showEthPrice": false
        }
      })
    })

    const data = await response.json()

    const allNfts = []
    
    // Parse the HTML in NftColumn to extract NFTs
    if (data.d && data.d.data) {
      data.d.data.forEach(item => {
        if (item.NftColumn) {
          const fakeResponse = {d: {data: [{NftColumn: item.NftColumn}]}};
          const nfts = parseNftHtmlToJson(fakeResponse);
          allNfts.push(...nfts);
        }
      })
    }

    
    // Extract pagination info from Etherscan response
    const recordsTotal = data.d?.recordsTotal || 0;
    const totalPages = data.d?.totalPage || 1;
    const currentPage = data.d?.currentPage || pageNumber;
    
    // Map to expected format
    const formattedNfts = allNfts.map(nft => {
      let imageUrl = nft.image
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = 'https://etherscan.io' + imageUrl
      }
      return {
        contractAddress: nft.contract,
        tokenId: nft.token_id,
        name: nft.name,
        type: nft.type,
        imageUrl
      }
    })

    res.status(200).json({ 
      data: formattedNfts,
      pagination: {
        currentPage,
        totalPages,
        recordsTotal,
        hasMore: currentPage < totalPages
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}