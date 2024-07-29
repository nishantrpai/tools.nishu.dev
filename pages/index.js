import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'


export const tools = [
  {
    title: 'Boolean Search',
    description: 'Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find.',
    publishDate: '26th March 2024',
    icon: '🔍',
    url: '/booleansearch'
  },
  {
    title: 'Day Difference Calculator',
    description: 'Calculate the difference between two dates in days.',
    publishDate: '27th March 2024',
    icon: '⏳',
    url: '/daydiff'
  },
  {
    title: 'NFT v/s NFT',
    description: 'Compare two NFTs side by side.',
    publishDate: '28th March 2024',
    icon: '🖼️/🖼️',
    url: '/nftcompare'
  },
  {
    title: 'Voice to Text',
    description: 'Convert your voice to text.',
    publishDate: '29th March 2024',
    icon: '🎤',
    url: '/voice2txt'
  },
  {
    title: 'Food Breakdown',
    description: 'Get the breakdown of food in terms of protein, carbs, and fats.',
    publishDate: '30th March 2024',
    icon: '🍔',
    url: '/foodbreakdown'
  },
  {
    title: 'Draw',
    description: 'Simple tool for drawing and copying that image to clipboard',
    publishDate: '31st March 2024',
    icon: '✏️',
    url: '/draw'
  },
  {
    title: 'QR Code Generator',
    description: 'Generate QR code for any text.',
    publishDate: '1st April 2024',
    icon: '🔲',
    url: '/qrcode'
  },
  {
    title: 'Prompt Enhancer',
    description: 'Enhance your image prompt with more details.',
    publishDate: '2nd April 2024',
    icon: '🖼️',
    url: '/promptenhancer'
  },
  {
    title: 'What Are People Asking',
    description: 'What are people asking on the internet for your idea.',
    publishDate: '3rd April 2024',
    icon: '❓',
    url: '/peopleasking'
  },
  {
    title: 'Encrypt',
    description: 'Encrypt text using MD5, SHA1, SHA256, SHA512.',
    publishDate: '4th April 2024',
    icon: '🔐',
    url: '/encrypt'
  },
  {
    title: 'Website speed',
    description: 'Check the speed of a website.',
    publishDate: '5th April 2024',
    icon: '🚀',
    url: '/websitespeed'
  },
  {
    title: 'Multiplayer Drawing',
    description: 'Draw with your friends in real-time.',
    publishDate: '6th April 2024',
    icon: '🎨',
    url: '/multidraw'
  },
  {
    title: 'Simple Timer',
    description: 'Set a timer for your tasks.',
    publishDate: '7th April 2024',
    icon: '⏱️',
    url: '/timer'
  },
  {
    title: 'Random Number Generator',
    description: 'Generate random numbers.',
    publishDate: '8th April 2024',
    icon: '🎲',
    url: '/random'
  },
  {
    title: 'Workout for each muscle',
    description: 'Get a workout for each muscle in your body.',
    publishDate: '9th April 2024',
    icon: '💪',
    url: '/workout'
  },
  {
    title: 'Tweetdeck for Warpcast',
    description: 'Tweetdeck for Warpcast',
    publishDate: '10th April 2024',
    icon: '📁',
    url: '/warpdeck',
    publishDate: '10th April 2024',
  },
  {
    title: 'What time is it right now in ___',
    description: 'Get the current time in any city.',
    publishDate: '11th April 2024',
    icon: '⏰',
    url: '/whattime'
  },
  {
    title: 'Text to Speech',
    description: 'Convert text to speech.',
    publishDate: '12th April 2024',
    icon: '🔊',
    url: '/tts'
  },
  {
    title: 'Voice to Todo List',
    description: 'Convert your voice to a todo list.',
    publishDate: '13th April 2024',
    icon: '🗒️',
    url: '/voicetodo'
  },
  {
    title: 'WarpSpaces',
    description: 'WarpSpaces: Twitter Spaces for Warpcast',
    publishDate: '14th April 2024',
    icon: '🎤',
    url: '/warpspaces'
  },
  {
    title: 'Pick random winner from a list',
    description: 'Pick a random winner from a list of names.',
    publishDate: '15th April 2024',
    icon: '🎉',
    url: '/randomwinner'
  },
  {
    title: 'WarpCanvas',
    description: 'WarpCanvas: Draw with your friends in real-time.',
    publishDate: '16th April 2024',
    icon: '🎨',
    url: '/warpcanvas'
  },
  {
    title: 'Higher',
    description: 'Add "↑" on any image',
    publishDate: '17th April 2024',
    url: '/higher',
    icon: '↑',
  },
  {
    title: 'Rep Aloud',
    description: 'Tell reps aloud',
    publishDate: '18th April 2024',
    url: '/repaloud',
    icon: '🔊',
  },
  {
    title: 'Infinite Canvas',
    description: 'Browse the internet on an infinite canvas',
    publishDate: '19th April 2024',
    url: '/infinitecanvas',
    icon: '🌐',
  },
  {
    title: 'Duplicate Photos',
    description: 'Duplicate your photos 100s or 1000s of times',
    publishDate: '20th April 2024',
    url: '/duplicatephotos',
    icon: '📸',
  },
  {
    title: 'Voice to Emoji style voiceover',
    description: 'Convert your voice to emoji style voiceover',
    publishDate: '22nd April 2024',
    url: '/voicetoemoji',
    icon: '🎤',
  },
  {
    title: 'Interval Timer',
    description: 'Set a fixed timer and beeps at different intervals',
    publishDate: '23rd April 2024',
    url: '/intervaltimer',
    icon: '🔊',
  },
  {
    title: 'NFT Music Player',
    description: 'Play music from NFTs',
    publishDate: '24th April 2024',
    url: '/mus1c',
    icon: '🎵',
  },
  {
    title: 'Blend layer onto image',
    description: 'Blend a layer onto an image',
    publishDate: '25th April 2024',
    url: '/blend',
    icon: '🎨',
  },
  {
    title: 'Bulk blend layer onto image',
    description: 'Bulk blend a layer onto images',
    publishDate: '26th April 2024',
    url: '/bulkblend',
    icon: '🎨',
  },
  {
    title: 'Reframe a sentence',
    description: 'Reframe a sentence to paint the picture you want',
    publishDate: '27th April 2024',
    url: '/reframe',
    icon: '🖼️',
  },
  {
    title: 'Know your farcaster',
    description: 'Know your farcaster',
    publishDate: '28th April 2024',
    url: '/kyf',
    icon: '🧑'
  },
  {
    title: 'Idea to problem',
    description: 'Find problems that are solved with your idea',
    publishDate: '29th April 2024',
    url: '/idea2problem',
    icon: '❓'
  },
  {
    title: 'Similar Phrases',
    description: 'Find similar phrases to your phrase',
    publishDate: '30th April 2024',
    url: '/similarphrases',
    icon: '🔍'
  },
  {
    title: 'Sensationalize',
    description: 'Sensationalize your text',
    publishDate: '1st May 2024',
    url: '/sensationalize',
    icon: '🔥',
  },
  {

    title: 'Ask youtube video',
    description: 'Ask questions in a youtube video',
    publishDate: '2nd May 2024',
    url: '/askyt',
    icon: '🎥',
  },
  {
    title: 'Valid email',
    description: 'Check if an email is valid',
    publishDate: '3rd May 2024',
    url: '/validemail',
  },
  {
    title: 'Poll Best Time',
    description: 'Poll your friends for the best time for an event',
    publishDate: '4th May 2024',
    url: '/besttime',
  },
  {
    title: 'Compress Text',
    description: 'Make your text precise and concise',
    publishDate: '6th May 2024',
    url: '/compresstext',
  },
  {
    title: 'AI Canvas',
    description: 'Draw with AI, save aesthetics and style',
    publishDate: '8th May 2024',
    url: '/aicanvas',
  },
  {
    title: 'Grade Text',
    description: 'Grade your text based on readability',
    publishDate: '8th May 2024',
    url: '/gradetext',
  },
  {
    title: 'Flex NFT',
    description: 'Flex your NFTs',
    publishDate: '9th May 2024',
    url: '/flexnft',
  },
  {
    title: 'NFT Tier List',
    description: 'Create a tier list of NFTs',
    publishDate: '10th May 2024',
    url: '/nfttier',
  },
  {
    title: 'Lovecaster',
    description: 'Find love on warpcast',
    publishDate: '11th May 2024',
    url: '/lovecaster',
  },
  {
    title: 'Read Smart Contract',
    description: 'Read a smart contract, regardless of whether it is verified or not',
    publishDate: '13th May 2024',
    url: '/readsc',
  },
  {
    title: 'Get ideas from subreddit',
    description: 'Get frequently asked questions from a subreddit',
    publishDate: '14th May 2024',
    url: '/subredditideas',
  },
  {
    title: 'Is there a tool for that',
    description: 'Find tools for your idea',
    publishDate: '17th May 2024',
    url: '/isthereatool',
  },
  {
    title: 'Is it gpt?',
    description: 'Check if a text is generated by gpt',
    publishDate: '18th May 2024',
    url: '/isitgpt',
  },
  {
    title: 'Word for',
    description: 'Find words for a given word',
    publishDate: '19th May 2024',
    url: '/wordfor',
  },
  {
    title: 'Extract Images from PDF/DOCX/PPTX',
    description: 'Extract images from PDF/DOCX/PPTX',
    publishDate: '20th May 2024',
    url: '/extractimages',
  },
  {
    title: 'Elaborate',
    description: 'Elaborate on your text to provide more context',
    publishDate: '21st May 2024',
    url: '/elaborate',
  },
  {
    title: 'Sales Signals',
    description: 'Find sales signals for your idea',
    publishDate: '22nd May 2024',
    url: '/salessignal',
  },
  {
    title: 'Text to Gradient',
    description: 'Convert text to gradient',
    publishDate: '23rd May 2024',
    url: '/txt2gradient',
  },
  {
    title: 'Mix Words',
    description: 'Mix two words to create a new word',
    publishDate: '24th May 2024',
    url: '/mix',
  },
  {
    title: 'Mix Colors',
    description: 'Mix two colors to create a gradient',
    publishDate: '24th May 2024',
    url: '/mixcolors',
  },
  {
    title: 'What does your message sound like',
    description: 'What does your message sound like or trigger in the mind',
    publishDate: '25th May 2024',
    url: '/soundlike',
  },
  {
    title: 'Chrono Canvas',
    description: 'Capture frames of your canvas and create a beautiful picture',
    publishDate: '26th May 2024',
    url: '/chronocanvas',
  },
  {
    title: 'Audience to Idea',
    description: 'Find ideas from your audience',
    publishDate: '27th May 2024',
    url: '/audience2idea',
  },
  {
    title: 'URL Parser',
    description: 'Parse a URL into its components',
    publishDate: '28th May 2024',
    url: '/urlparser',
  },
  {
    title: 'Phrase Remixer',
    description: 'Remix a phrase to create a new phrase',
    publishDate: '29th May 2024',
    url: '/phraseremixer',
  },
  {
    title: 'Text to SVG',
    description: 'Convert text to SVG',
    publishDate: '30th May 2024',
    url: '/text2svg',
  },
  {
    title: 'Reverse Keyword Lookup',
    description: 'Find keywords that are related to your website',
    publishDate: '1st June 2024',
    url: '/reversekeyword',
  },
  {
    title: 'Physics to Metaphysics',
    description: 'Convert physics to metaphysics',
    publishDate: '2nd June 2024',
    url: '/phys2meta',
  },
  {
    title: 'Greed',
    description: 'What stocks would be affected by current news',
    publishDate: '3rd June 2024',
    url: '/greed',
  },
  {
    title: 'Text to SVG Pattern',
    description: 'Convert text to SVG background pattern',
    publishDate: '4th June 2024',
    url: '/text2bg',
  },
  {
    title: 'Text to Zorbit',
    description: 'Convert text to zorbit',
    publishDate: '5th June 2024',
    url: '/text2zorbit',
  },
  {
    title: 'Text to Opepen',
    description: 'Convert text to opepen',
    publishDate: '6th June 2024',
    url: '/text2opepen',
  },
  {
    title: 'Text to 8pepen',
    description: 'Convert text to 8pepen',
    publishDate: '7th June 2024',
    url: '/text28pepen',
  },
  {
    title: 'Text to 8bit art',
    description: 'Convert text to 8bit art',
    publishDate: '8th June 2024',
    url: '/8bitcanvas',
  },
  {
    title: 'Text to Pepe Mandorian',
    description: 'Convert text to pepe mandorian',
    publishDate: '9th June 2024',
    url: '/text2pepe',
  },
  {
    title: 'Warpcast Psychographics',
    description: 'Warpcast psychographics',
    publishDate: '10th June 2024',
    url: '/psychcast',
  },
  {
    title: 'Chess Blindspots',
    description: 'Find blindspots in your chess game',
    publishDate: '11th June 2024',
    url: '/chessblindspots',
  },
  {
    title: 'Pixelate Image',
    description: 'Pixelate an image',
    publishDate: '13th June 2024',
    url: '/pixelate',
  },
  {
    title: 'Text to Glass Punk',
    description: 'Convert text to glass punk',
    publishDate: '14th June 2024',
    url: '/text2glasspunk',
  },
  {
    title: 'Text to RGB Punk',
    description: 'Convert text to RGB punk',
    publishDate: '15th June 2024',
    url: '/text2rgbpunk',
  },
  {
    title: 'Text to Checks',
    description: 'Convert text to checks',
    publishDate: '15th June 2024',
    url: '/text2checks',
  },
  {
    title: 'Text to Apepepen',
    description: 'Convert text to apepepen',
    publishDate: '16th June 2024',
    url: '/text2apepen',
  },
  {
    title: 'Scapes',
    description: 'Use scapes to create beautiful thumbnails for your videos/podcasts/articles',
    publishDate: '17th June 2024',
    url: '/scapes',
  },
  {
    title: 'Text to Scapepe',
    description: 'Convert text to scapepe',
    publishDate: '18th June 2024',
    url: '/text2scapepe',
  },
  {
    title: 'Punkscapes',
    description: 'Merge punks and scapes',
    publishDate: '19th June 2024',
    url: '/punkscapes',
  },
  {
    title: 'Higher Hat',
    description: 'Add "↑" hat on any image',
    publishDate: '20th June 2024',
    url: '/higherhat',
  },
  {
    title: 'Intl Meme Fund Hats',
    description: 'Add Meme Fund hats on any image',
    publishDate: '20th June 2024',
    url: '/intlmemefundhat',
  },
  {
    title: 'Oviators',
    description: 'Add oviators on any image',
    publishDate: '21st June 2024',
    url: '/oviators',
  },
  {
    title: 'Text to Opepixel',
    description: 'Convert text to opepixel',
    publishDate: '22nd June 2024',
    url: '/text2opepixel',
  },
  {
    title: 'Boys Club World',
    description: 'Add boys club hat on any image',
    publishDate: '23rd June 2024',
    url: '/boysclub',
  },
  {
    title: 'Mog',
    description: 'Add pit viper glasses on any image',
    publishDate: '24th June 2024',
    url: '/mog',
  },
  {
    title: 'Polymarket Intern Hat',
    description: 'Add Polymarket intern hat on any image',
    publishDate: '24th June 2024',
    url: '/polymarketintern',
  },
  {
    title: '8pepen x Scapes',
    description: 'Merge 8pepen and scapes',
    publishDate: '25th June 2024',
    url: '/8scapepe',
  },
  {
    title: 'Grainy',
    description: 'Add grainy effect to your image',
    publishDate: '25th June 2024',
    url: '/grainy'
  },
  {
    title: 'Noggles',
    description: 'Add Noggles on any image',
    publishDate: '26th June 2024',
    url: '/noggles'
  }, 
  {
    title: 'Hat Protocol',
    description: 'Add hat protocol hats on any image',
    publishDate: '26th June 2024',
    url: '/hatsprotocol'
  },
  {
    title: 'Color Profile',
    description: 'Get color profile of any hex code',
    publishDate: '27th June 2024',
    url: '/colorprofile'
  },
  {
    title: 'VVR x Scape',
    description: 'Merge VVR and scapes',
    publishDate: '28th June 2024',
    url: '/vvrscape'
  },
  {
    title: 'VVR x pepe',
    description: 'Merge VVR and pepe',
    publishDate: '28th June 2024',
    url: '/vvrpepe'
  },
  {
    title: 'Image Profile',
    description: 'Get image profile of any image',
    publishDate: '29th June 2024',
    url: '/imgprofile'
  },
  {
    title: 'Thug Life',
    description: 'Add thug life glasses on any image',
    publishDate: '30th June 2024',
    url: '/thuglife'
  },
  {
    title: 'Pepe',
    description: 'Fill any image with pepe color',
    publishDate: '1st July 2024',
    url: '/pepefy'
  },
  {
    title: 'NFT Beats',
    description: 'Play beats from NFTs',
    publishDate: '2nd July 2024',
    url: '/nftbeats'
  },
  {
    title: 'Higher Pilled',
    description: 'Add higher eyes on any image',
    publishDate: '4th July 2024',
    url: '/higherpilled'
  },
  {
    title: 'Opepen Chat Cover',
    description: 'Create a cover for Opepen Chat',
    publishDate: '5th July 2024',
    url: '/opepenchat'
  },
  {
    title: 'Paradox',
    description: 'Generate paradoxes',
    publishDate: '6th July 2024',
    url: '/paradox'
  },
  {
    title: 'Based Hat',
    description: 'Add Based Hat on any image',
    publishDate: '7th July 2024',
    url: '/basedhat' 
  },
  {
    title: 'Higher Scanner',
    description: 'Add Higher Scanner on any image',
    publishDate: '8th July 2024',
    url: '/higherscanner'
  },
  {
    title: '8pepeblend',
    description: 'Blend 8pepen and any image',
    publishDate: '9th July 2024',
    url: '/8pepeblend'
  },
  {
    title: 'Black and White Filter',
    description: 'Add black and white filter on any image',
    publishDate: '10th July 2024',
    url: '/bwfilter'
  },
  {
    title: 'Text 2 Base',
    description: 'Convert text to base logo',
    publishDate: '11th July 2024',
    url: '/text2base'
  },
  {
    title: 'Text 2 Alien Toadz',
    description: 'Convert text to alien toadz',
    publishDate: '12th July 2024',
    url: '/text2alientoadz'
  }, 
  {
    title: 'Regulatoor',
    description: 'Add regulatoor on any image',
    publishDate: '13th July 2024',
    url: '/regulatoor'
  },
  {
    title: 'America',
    description: 'Add American flag to any nft or image',
    publishDate: '14th July 2024',
    url: '/america'
  },
  {
    title: 'Bulk Ens Resolver',
    description: 'Resolve multiple ENS names at once',
    publishDate: '15th July 2024',
    url: '/bulkens'
  },
  {
    title: 'Higher TM',
    description: 'Add Higher TM on any image',
    publishDate: '16th July 2024',
    url: '/highertm'
  },
  {
    title: 'Higher Banner',
    description: 'Make your own higher banner',
    publishDate: '17th July 2024',
    url: '/higherbanner'
  },
  {
    title: 'ELI5',
    description: 'Explain like I am 5',
    publishDate: '17th July 2024',
    url: '/eli5'
  },
  {
    title: 'Which Font',
    description: 'Detect the font in the image',
    publishDate: '18th July 2024',
    url: '/whichfont'
  },
  {
    title: 'Pick Color',
    description: 'Pick colors from any image',
    publishDate: '19th July 2024',
    url: '/pickcolor'
  },
  {
    title: 'Ask a smart contract',
    description: 'Ask any questions to a smart contract',
    publishDate: '20th July 2024',
    url: '/asksc'
  },
  {
   title: 'Youtube Quotes',
    description: 'Get quotes from youtube videos',
    publishDate: '21st July 2024',
    url: '/ytquotes' 
  },
  {
    title: 'Checks Banner',
    description: 'Make your own checks banner',
    publishDate: '22nd July 2024',
    url: '/checksbanner'
  },
  {
    title: 'Check Facts',
    description: 'Check facts that are outdated or need to be updated since your high school graduation',
    publishDate: '22nd July 2024',
    url: '/checkfacts'
  },
  {
    title: 'Short Status',
    description: 'Turn large text into short status',
    publishDate: '23rd July 2024',
    url: '/text2status'
  },
  {
    title: 'SEO Keywords',
    description: 'Get SEO keywords for your idea',
    publishDate: '24th July 2024',
    url: '/seokeywords'
  },
  {
    title: 'Suggest Slug or domain for idea',
    description: 'Suggest a slug or domain for your idea',
    publishDate: '24th July 2024',
    url: '/suggestslugordomain'
  },
  {
    title: 'Higher Gifs',
    description: 'Make your gifs higher',
    publishDate: '25th July 2024',
    url: '/highergifs'
  },
  {
    title: 'Permissionless Ideas',
    description: 'Get permissionless ideas and ways to monetize them from Jack Butcher',
    publishDate: '26th July 2024',
    url: '/permissionlessideas'
  },
  {
    title: 'Fear Greed',
    description: 'Visualize fear and greed',
    publishDate: '27th July 2024',
    url: '/feargreed'
  },
  {
    title: 'Mirror Socials',
    description: 'Create image previews from @viamirror  posts for socials',
    publishDate: '27th July 2024',
    url: '/mirrorsocials'
  },
  {
    title: 'Paragraph Preview',
    description: 'Create a preview of for paragraph.xyz post',
    publishDate: '28th July 2024',
    url: '/paragraphpreview'
  },
  {
    title: 'Get prompt from image',
    description: 'Get prompt from an image',
    publishDate: '29th July 2024',
    url: '/getprompt'
  },
  {
    title: 'Resale value',
    description: 'Check the resale value of a product',
    publishDate: '29th July 2024',
    url: '/resalevalue'
  }
  // {
  // better as a chrome extension
  //   title: 'Content Diet',
  //   description: 'Log your content diet',
  //   publishDate: '23rd July 2024',
  //   url: '/contentdiet'
  // }
  
  // {
  //   title: 'Face Swap',
  //   description: 'Swap faces in gifs',
  //   publishDate: '1st May 2024',
  //   url: '/faceswap',
  //   icon: '👥'
  // }

]

export default function Home() {


  const [search, setSearch] = useState('')
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    setFilteredTools(tools.filter(tool => tool.title.toLowerCase().includes(search.toLowerCase()) || tool.description.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  return (
    <>
      <Head>
        <title>Tools by Nishu</title>
        <meta name="description" content="tools.nishu.dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* <input className={styles.search} onChange={(e) => {
          setSearch(e.target.value)
        }}>
        </input> */}
        {/* create an input with search icon */}
        {/* add twitter at the top */}
        <a href='https://twitter.com/PaiNishant' style={{
          top: '10px',
          right: '10px',
          color: '#888',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '10px',
        }}
          target='_blank'
        >
          @PaiNishant
        </a>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input className={styles.search} onChange={(e) => {
            setSearch(e.target.value)
          }} placeholder="Search for tools... for e.g., 'nft'"/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', marginBottom: 30 }}>
          {filteredTools.map((tool, index) => (
            <a key={index} href={tool.url}>
              <p style={{
                fontSize: '1rem',
                color: '#eee',
                marginBottom: '10px',
              }}>{index + 1}. {tool.title}</p>
              <p style={{
                fontSize: '0.8rem',
                display: 'flex',
                color: '#888',
                marginBottom: '10px',
              }}>{tool.description}</p>
              <span className={styles.date}>{tool.publishDate}</span>
            </a>
          ))}
        </div>

      </main>
    </>
  )
}
