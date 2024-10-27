import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/router'

export const tools = [
  {
      "title": "Boolean Search",
      "description": "Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find.",
      "publishDate": "26th March 2024",
      "icon": "🔍",
      "url": "/booleansearch",
      "tags": []
  },
  {
      "title": "Day Difference Calculator",
      "description": "Calculate the difference between two dates in days.",
      "publishDate": "27th March 2024",
      "icon": "⏳",
      "url": "/daydiff",
      "tags": []
  },
  {
      "title": "NFT v/s NFT",
      "description": "Compare two NFTs side by side.",
      "publishDate": "28th March 2024",
      "icon": "🖼️/🖼️",
      "url": "/nftcompare",
      "tags": []
  },
  {
      "title": "Voice to Text",
      "description": "Convert your voice to text.",
      "publishDate": "29th March 2024",
      "icon": "🎤",
      "url": "/voice2txt",
      "tags": []
  },
  {
      "title": "Food Breakdown",
      "description": "Get the breakdown of food in terms of protein, carbs, and fats.",
      "publishDate": "30th March 2024",
      "icon": "🍔",
      "url": "/foodbreakdown",
      "tags": []
  },
  {
      "title": "Draw",
      "description": "Simple tool for drawing and copying that image to clipboard",
      "publishDate": "31st March 2024",
      "icon": "✏️",
      "url": "/draw",
      "tags": []
  },
  {
      "title": "QR Code Generator",
      "description": "Generate QR code for any text.",
      "publishDate": "1st April 2024",
      "icon": "🔲",
      "url": "/qrcode",
      "tags": []
  },
  {
      "title": "Prompt Enhancer",
      "description": "Enhance your image prompt with more details.",
      "publishDate": "2nd April 2024",
      "icon": "🖼️",
      "url": "/promptenhancer",
      "tags": []
  },
  {
      "title": "What Are People Asking",
      "description": "What are people asking on the internet for your idea.",
      "publishDate": "3rd April 2024",
      "icon": "❓",
      "url": "/peopleasking",
      "tags": []
  },
  {
      "title": "Encrypt",
      "description": "Encrypt text using MD5, SHA1, SHA256, SHA512.",
      "publishDate": "4th April 2024",
      "icon": "🔐",
      "url": "/encrypt",
      "tags": []
  },
  {
      "title": "Website speed",
      "description": "Check the speed of a website.",
      "publishDate": "5th April 2024",
      "icon": "🚀",
      "url": "/websitespeed",
      "tags": []
  },
  {
      "title": "Multiplayer Drawing",
      "description": "Draw with your friends in real-time.",
      "publishDate": "6th April 2024",
      "icon": "🎨",
      "url": "/multidraw",
      "tags": []
  },
  {
      "title": "Simple Timer",
      "description": "Set a timer for your tasks.",
      "publishDate": "7th April 2024",
      "icon": "⏱️",
      "url": "/timer",
      "tags": []
  },
  {
      "title": "Random Number Generator",
      "description": "Generate random numbers.",
      "publishDate": "8th April 2024",
      "icon": "🎲",
      "url": "/random",
      "tags": []
  },
  {
      "title": "Workout for each muscle",
      "description": "Get a workout for each muscle in your body.",
      "publishDate": "9th April 2024",
      "icon": "💪",
      "url": "/workout",
      "tags": []
  },
  {
      "title": "Tweetdeck for Warpcast",
      "description": "Tweetdeck for Warpcast",
      "publishDate": "10th April 2024",
      "icon": "📁",
      "url": "/warpdeck",
      "tags": []
  },
  {
      "title": "What time is it right now in ___",
      "description": "Get the current time in any city.",
      "publishDate": "11th April 2024",
      "icon": "⏰",
      "url": "/whattime",
      "tags": []
  },
  {
      "title": "Text to Speech",
      "description": "Convert text to speech.",
      "publishDate": "12th April 2024",
      "icon": "🔊",
      "url": "/tts",
      "tags": []
  },
  {
      "title": "Voice to Todo List",
      "description": "Convert your voice to a todo list.",
      "publishDate": "13th April 2024",
      "icon": "🗒️",
      "url": "/voicetodo",
      "tags": []
  },
  {
      "title": "WarpSpaces",
      "description": "WarpSpaces: Twitter Spaces for Warpcast",
      "publishDate": "14th April 2024",
      "icon": "🎤",
      "url": "/warpspaces",
      "tags": []
  },
  {
      "title": "Pick random winner from a list",
      "description": "Pick a random winner from a list of names.",
      "publishDate": "15th April 2024",
      "icon": "🎉",
      "url": "/randomwinner",
      "tags": []
  },
  {
      "title": "WarpCanvas",
      "description": "WarpCanvas: Draw with your friends in real-time.",
      "publishDate": "16th April 2024",
      "icon": "🎨",
      "url": "/warpcanvas",
      "tags": []
  },
  {
      "title": "Higher",
      "description": "Add \"↑\" on any image",
      "publishDate": "17th April 2024",
      "url": "/higherarrow",
      "icon": "↑",
      "tags": ['higher']
  },
  {
      "title": "Rep Aloud",
      "description": "Tell reps aloud",
      "publishDate": "18th April 2024",
      "url": "/repaloud",
      "icon": "🔊",
      "tags": []
  },
  {
      "title": "Infinite Canvas",
      "description": "Browse the internet on an infinite canvas",
      "publishDate": "19th April 2024",
      "url": "/infinitecanvas",
      "icon": "🌐",
      "tags": []
  },
  {
      "title": "Duplicate Photos",
      "description": "Duplicate your photos 100s or 1000s of times",
      "publishDate": "20th April 2024",
      "url": "/duplicatephotos",
      "icon": "📸",
      "tags": []
  },
  {
      "title": "Voice to Emoji style voiceover",
      "description": "Convert your voice to emoji style voiceover",
      "publishDate": "22nd April 2024",
      "url": "/voicetoemoji",
      "icon": "🎤",
      "tags": []
  },
  {
      "title": "Interval Timer",
      "description": "Set a fixed timer and beeps at different intervals",
      "publishDate": "23rd April 2024",
      "url": "/intervaltimer",
      "icon": "🔊",
      "tags": []
  },
  {
      "title": "NFT Music Player",
      "description": "Play music from NFTs",
      "publishDate": "24th April 2024",
      "url": "/mus1c",
      "icon": "🎵",
      "tags": []
  },
  {
      "title": "Blend layer onto image",
      "description": "Blend a layer onto an image",
      "publishDate": "25th April 2024",
      "url": "/blend",
      "icon": "🎨",
      "tags": []
  },
  {
      "title": "Bulk blend layer onto image",
      "description": "Bulk blend a layer onto images",
      "publishDate": "26th April 2024",
      "url": "/bulkblend",
      "icon": "🎨",
      "tags": []
  },
  {
      "title": "Reframe a sentence",
      "description": "Reframe a sentence to paint the picture you want",
      "publishDate": "27th April 2024",
      "url": "/reframe",
      "icon": "🖼️",
      "tags": []
  },
  {
      "title": "Know your farcaster",
      "description": "Know your farcaster",
      "publishDate": "28th April 2024",
      "url": "/kyf",
      "icon": "🧑",
      "tags": []
  },
  {
      "title": "Idea to problem",
      "description": "Find problems that are solved with your idea",
      "publishDate": "29th April 2024",
      "url": "/idea2problem",
      "icon": "❓",
      "tags": []
  },
  {
      "title": "Similar Phrases",
      "description": "Find similar phrases to your phrase",
      "publishDate": "30th April 2024",
      "url": "/similarphrases",
      "icon": "🔍",
      "tags": []
  },
  {
      "title": "Sensationalize",
      "description": "Sensationalize your text",
      "publishDate": "1st May 2024",
      "url": "/sensationalize",
      "icon": "🔥",
      "tags": []
  },
  {
      "title": "Ask youtube video",
      "description": "Ask questions in a youtube video",
      "publishDate": "2nd May 2024",
      "url": "/askyt",
      "icon": "🎥",
      "tags": []
  },
  {
      "title": "Valid email",
      "description": "Check if an email is valid",
      "publishDate": "3rd May 2024",
      "url": "/validemail",
      "tags": []
  },
  {
      "title": "Poll Best Time",
      "description": "Poll your friends for the best time for an event",
      "publishDate": "4th May 2024",
      "url": "/besttime",
      "tags": []
  },
  {
      "title": "Compress Text",
      "description": "Make your text precise and concise",
      "publishDate": "6th May 2024",
      "url": "/compresstext",
      "tags": []
  },
  {
      "title": "AI Canvas",
      "description": "Draw with AI, save aesthetics and style",
      "publishDate": "8th May 2024",
      "url": "/aicanvas",
      "tags": []
  },
  {
      "title": "Grade Text",
      "description": "Grade your text based on readability",
      "publishDate": "8th May 2024",
      "url": "/gradetext",
      "tags": []
  },
  {
      "title": "Flex NFT",
      "description": "Flex your NFTs",
      "publishDate": "9th May 2024",
      "url": "/flexnft",
      "tags": []
  },
  {
      "title": "NFT Tier List",
      "description": "Create a tier list of NFTs",
      "publishDate": "10th May 2024",
      "url": "/nfttier",
      "tags": []
  },
  {
      "title": "Lovecaster",
      "description": "Find love on warpcast",
      "publishDate": "11th May 2024",
      "url": "/lovecaster",
      "tags": []
  },
  {
      "title": "Read Smart Contract",
      "description": "Read a smart contract, regardless of whether it is verified or not",
      "publishDate": "13th May 2024",
      "url": "/readsc",
      "tags": []
  },
  {
      "title": "Get ideas from subreddit",
      "description": "Get frequently asked questions from a subreddit",
      "publishDate": "14th May 2024",
      "url": "/subredditfaq",
      "tags": []
  },
  {
      "title": "Is there a tool for that",
      "description": "Find tools for your idea",
      "publishDate": "17th May 2024",
      "url": "/isthereatool",
      "tags": []
  },
  {
      "title": "Is it gpt?",
      "description": "Check if a text is generated by gpt",
      "publishDate": "18th May 2024",
      "url": "/isitgpt",
      "tags": []
  },
  {
      "title": "Word for",
      "description": "Find words for a given word",
      "publishDate": "19th May 2024",
      "url": "/wordfor",
      "tags": []
  },
  {
      "title": "Extract Images from PDF/DOCX/PPTX",
      "description": "Extract images from PDF/DOCX/PPTX",
      "publishDate": "20th May 2024",
      "url": "/extractimages",
      "tags": []
  },
  {
      "title": "Elaborate",
      "description": "Elaborate on your text to provide more context",
      "publishDate": "21st May 2024",
      "url": "/elaborate",
      "tags": []
  },
  {
      "title": "Sales Signals",
      "description": "Find sales signals for your idea",
      "publishDate": "22nd May 2024",
      "url": "/salessignal",
      "tags": []
  },
  {
      "title": "Text to Gradient",
      "description": "Convert text to gradient",
      "publishDate": "23rd May 2024",
      "url": "/txt2gradient",
      "tags": []
  },
  {
      "title": "Mix Words",
      "description": "Mix two words to create a new word",
      "publishDate": "24th May 2024",
      "url": "/mix",
      "tags": []
  },
  {
      "title": "Mix Colors",
      "description": "Mix two colors to create a gradient",
      "publishDate": "24th May 2024",
      "url": "/mixcolors",
      "tags": []
  },
  {
      "title": "What does your message sound like",
      "description": "What does your message sound like or trigger in the mind",
      "publishDate": "25th May 2024",
      "url": "/soundlike",
      "tags": []
  },
  {
      "title": "Chrono Canvas",
      "description": "Capture frames of your canvas and create a beautiful picture",
      "publishDate": "26th May 2024",
      "url": "/chronocanvas",
      "tags": []
  },
  {
      "title": "Audience to Idea",
      "description": "Find ideas from your audience",
      "publishDate": "27th May 2024",
      "url": "/audience2idea",
      "tags": []
  },
  {
      "title": "URL Parser",
      "description": "Parse a URL into its components",
      "publishDate": "28th May 2024",
      "url": "/urlparser",
      "tags": []
  },
  {
      "title": "Phrase Remixer",
      "description": "Remix a phrase to create a new phrase",
      "publishDate": "29th May 2024",
      "url": "/phraseremixer",
      "tags": []
  },
  {
      "title": "Text to SVG",
      "description": "Convert text to SVG",
      "publishDate": "30th May 2024",
      "url": "/text2svg",
      "tags": []
  },
  {
      "title": "Reverse Keyword Lookup",
      "description": "Find keywords that are related to your website",
      "publishDate": "1st June 2024",
      "url": "/reversekeyword",
      "tags": []
  },
  {
      "title": "Physics to Metaphysics",
      "description": "Convert physics to metaphysics",
      "publishDate": "2nd June 2024",
      "url": "/phys2meta",
      "tags": []
  },
  {
      "title": "Greed",
      "description": "What stocks would be affected by current news",
      "publishDate": "3rd June 2024",
      "url": "/greed",
      "tags": []
  },
  {
      "title": "Text to SVG Pattern",
      "description": "Convert text to SVG background pattern",
      "publishDate": "4th June 2024",
      "url": "/text2bg",
      "tags": []
  },
  {
      "title": "Text to Zorbit",
      "description": "Convert text to zorbit",
      "publishDate": "5th June 2024",
      "url": "/text2zorbit",
      "tags": []
  },
  {
      "title": "Text to Opepen",
      "description": "Convert text to opepen",
      "publishDate": "6th June 2024",
      "url": "/text2opepen",
      "tags": []
  },
  {
      "title": "Text to 8pepen",
      "description": "Convert text to 8pepen",
      "publishDate": "7th June 2024",
      "url": "/text28pepen",
      "tags": []
  },
  {
      "title": "Text to 8bit art",
      "description": "Convert text to 8bit art",
      "publishDate": "8th June 2024",
      "url": "/8bitcanvas",
      "tags": []
  },
  {
      "title": "Text to Pepe Mandorian",
      "description": "Convert text to pepe mandorian",
      "publishDate": "9th June 2024",
      "url": "/text2pepe",
      "tags": []
  },
  {
      "title": "Warpcast Psychographics",
      "description": "Warpcast psychographics",
      "publishDate": "10th June 2024",
      "url": "/psychcast",
      "tags": []
  },
  {
      "title": "Chess Blindspots",
      "description": "Find blindspots in your chess game",
      "publishDate": "11th June 2024",
      "url": "/chessblindspots",
      "tags": []
  },
  {
      "title": "Pixelate Image",
      "description": "Pixelate an image",
      "publishDate": "13th June 2024",
      "url": "/pixelate",
      "tags": []
  },
  {
      "title": "Text to Glass Punk",
      "description": "Convert text to glass punk",
      "publishDate": "14th June 2024",
      "url": "/text2glasspunk",
      "tags": []
  },
  {
      "title": "Text to RGB Punk",
      "description": "Convert text to RGB punk",
      "publishDate": "15th June 2024",
      "url": "/text2rgbpunk",
      "tags": []
  },
  {
      "title": "Text to Checks",
      "description": "Convert text to checks",
      "publishDate": "15th June 2024",
      "url": "/text2checks",
      "tags": []
  },
  {
      "title": "Text to Apepepen",
      "description": "Convert text to apepepen",
      "publishDate": "16th June 2024",
      "url": "/text2apepen",
      "tags": []
  },
  {
      "title": "Scapes",
      "description": "Use scapes to create beautiful thumbnails for your videos/podcasts/articles",
      "publishDate": "17th June 2024",
      "url": "/scapes",
      "tags": []
  },
  {
      "title": "Text to Scapepe",
      "description": "Convert text to scapepe",
      "publishDate": "18th June 2024",
      "url": "/text2scapepe",
      "tags": []
  },
  {
      "title": "Punkscapes",
      "description": "Merge punks and scapes",
      "publishDate": "19th June 2024",
      "url": "/punkscapes",
      "tags": []
  },
  {
      "title": "Higher Hat",
      "description": "Add \"↑\" hat on any image",
      "publishDate": "20th June 2024",
      "url": "/higherhat",
      "tags": ['higher']
  },
  {
      "title": "Intl Meme Fund Hats",
      "description": "Add Meme Fund hats on any image",
      "publishDate": "20th June 2024",
      "url": "/intlmemefundhat",
      "tags": []
  },
  {
      "title": "Oviators",
      "description": "Add oviators on any image",
      "publishDate": "21st June 2024",
      "url": "/oviators",
      "tags": []
  },
  {
      "title": "Text to Opepixel",
      "description": "Convert text to opepixel",
      "publishDate": "22nd June 2024",
      "url": "/text2opepixel",
      "tags": []
  },
  {
      "title": "Boys Club World",
      "description": "Add boys club hat on any image",
      "publishDate": "23rd June 2024",
      "url": "/boysclub",
      "tags": []
  },
  {
      "title": "Mog",
      "description": "Add pit viper glasses on any image",
      "publishDate": "24th June 2024",
      "url": "/mog",
      "tags": []
  },
  {
      "title": "Polymarket Intern Hat",
      "description": "Add Polymarket intern hat on any image",
      "publishDate": "24th June 2024",
      "url": "/polymarketintern",
      "tags": []
  },
  {
      "title": "8pepen x Scapes",
      "description": "Merge 8pepen and scapes",
      "publishDate": "25th June 2024",
      "url": "/8scapepe",
      "tags": []
  },
  {
      "title": "Grainy",
      "description": "Add grainy effect to your image",
      "publishDate": "25th June 2024",
      "url": "/grainy",
      "tags": []
  },
  {
      "title": "Noggles",
      "description": "Add Noggles on any image",
      "publishDate": "26th June 2024",
      "url": "/noggles",
      "tags": []
  },
  {
      "title": "Hat Protocol",
      "description": "Add hat protocol hats on any image",
      "publishDate": "26th June 2024",
      "url": "/hatsprotocol",
      "tags": []
  },
  {
      "title": "Color Profile",
      "description": "Get color profile of any hex code",
      "publishDate": "27th June 2024",
      "url": "/colorprofile",
      "tags": []
  },
  {
      "title": "VVR x Scape",
      "description": "Merge VVR and scapes",
      "publishDate": "28th June 2024",
      "url": "/vvrscape",
      "tags": []
  },
  {
      "title": "VVR x pepe",
      "description": "Merge VVR and pepe",
      "publishDate": "28th June 2024",
      "url": "/vvrpepe",
      "tags": []
  },
  {
      "title": "Image Profile",
      "description": "Get image profile of any image",
      "publishDate": "29th June 2024",
      "url": "/imgprofile",
      "tags": []
  },
  {
      "title": "Thug Life",
      "description": "Add thug life glasses on any image",
      "publishDate": "30th June 2024",
      "url": "/thuglife",
      "tags": []
  },
  {
      "title": "Pepe",
      "description": "Fill any image with pepe color",
      "publishDate": "1st July 2024",
      "url": "/pepefy",
      "tags": []
  },
  {
      "title": "NFT Beats",
      "description": "Play beats from NFTs",
      "publishDate": "2nd July 2024",
      "url": "/nftbeats",
      "tags": []
  },
  {
      "title": "Higher Pilled",
      "description": "Add higher eyes on any image",
      "publishDate": "4th July 2024",
      "url": "/higherpilled",
      "tags": ['higher']
  },
  {
      "title": "Opepen Chat Cover",
      "description": "Create a cover for Opepen Chat",
      "publishDate": "5th July 2024",
      "url": "/opepenchat",
      "tags": []
  },
  {
      "title": "Paradox",
      "description": "Generate paradoxes",
      "publishDate": "6th July 2024",
      "url": "/paradox",
      "tags": []
  },
  {
      "title": "Based Hat",
      "description": "Add Based Hat on any image",
      "publishDate": "7th July 2024",
      "url": "/basedhat",
      "tags": []
  },
  {
      "title": "Higher Scanner",
      "description": "Add Higher Scanner on any image",
      "publishDate": "8th July 2024",
      "url": "/higherscanner",
      "tags": ['higher']
  },
  {
      "title": "8pepeblend",
      "description": "Blend 8pepen and any image",
      "publishDate": "9th July 2024",
      "url": "/8pepeblend",
      "tags": []
  },
  {
      "title": "Black and White Filter",
      "description": "Add black and white filter on any image",
      "publishDate": "10th July 2024",
      "url": "/bwfilter",
      "tags": []
  },
  {
      "title": "Text 2 Base",
      "description": "Convert text to base logo",
      "publishDate": "11th July 2024",
      "url": "/text2base",
      "tags": []
  },
  {
      "title": "Text 2 Alien Toadz",
      "description": "Convert text to alien toadz",
      "publishDate": "12th July 2024",
      "url": "/text2alientoadz",
      "tags": []
  },
  {
      "title": "Regulatoor",
      "description": "Add regulatoor on any image",
      "publishDate": "13th July 2024",
      "url": "/regulatoor",
      "tags": []
  },
  {
      "title": "America",
      "description": "Add American flag to any nft or image",
      "publishDate": "14th July 2024",
      "url": "/america",
      "tags": []
  },
  {
      "title": "Bulk Ens Resolver",
      "description": "Resolve multiple ENS names at once",
      "publishDate": "15th July 2024",
      "url": "/bulkens",
      "tags": []
  },
  {
      "title": "Higher TM",
      "description": "Add Higher TM on any image",
      "publishDate": "16th July 2024",
      "url": "/highertm",
      "tags": ['higher']
  },
  {
      "title": "Higher Banner",
      "description": "Make your own higher banner",
      "publishDate": "17th July 2024",
      "url": "/higherbanner",
      "tags": ['higher']
  },
  {
      "title": "ELI5",
      "description": "Explain like I am 5",
      "publishDate": "17th July 2024",
      "url": "/eli5",
      "tags": []
  },
  {
      "title": "Which Font",
      "description": "Detect the font in the image",
      "publishDate": "18th July 2024",
      "url": "/whichfont",
      "tags": []
  },
  {
      "title": "Pick Color",
      "description": "Pick colors from any image",
      "publishDate": "19th July 2024",
      "url": "/pickcolor",
      "tags": []
  },
  {
      "title": "Ask a smart contract",
      "description": "Ask any questions to a smart contract",
      "publishDate": "20th July 2024",
      "url": "/asksc",
      "tags": []
  },
  {
      "title": "Youtube Quotes",
      "description": "Get quotes from youtube videos",
      "publishDate": "21st July 2024",
      "url": "/ytquotes",
      "tags": []
  },
  {
      "title": "Checks Banner",
      "description": "Make your own checks banner",
      "publishDate": "22nd July 2024",
      "url": "/checksbanner",
      "tags": []
  },
  {
      "title": "Check Facts",
      "description": "Check facts that are outdated or need to be updated since your high school graduation",
      "publishDate": "22nd July 2024",
      "url": "/checkfacts",
      "tags": []
  },
  {
      "title": "Short Status",
      "description": "Turn large text into short status",
      "publishDate": "23rd July 2024",
      "url": "/text2status",
      "tags": []
  },
  {
      "title": "SEO Keywords",
      "description": "Get SEO keywords for your idea",
      "publishDate": "24th July 2024",
      "url": "/seokeywords",
      "tags": []
  },
  {
      "title": "Suggest Slug or domain for idea",
      "description": "Suggest a slug or domain for your idea",
      "publishDate": "24th July 2024",
      "url": "/suggestslug",
      "tags": []
  },
  {
      "title": "Higher Gifs",
      "description": "Make your gifs higher",
      "publishDate": "25th July 2024",
      "url": "/highergifs",
      "tags": ['higher']
  },
  {
      "title": "Permissionless Ideas",
      "description": "Get permissionless ideas and ways to monetize them from Jack Butcher",
      "publishDate": "26th July 2024",
      "url": "/permissionlessideas",
      "tags": []
  },
  {
      "title": "Fear Greed",
      "description": "Visualize fear and greed",
      "publishDate": "27th July 2024",
      "url": "/feargreed",
      "tags": []
  },
  {
      "title": "Mirror Socials",
      "description": "Create image previews from @viamirror  posts for socials",
      "publishDate": "27th July 2024",
      "url": "/mirrorsocials",
      "tags": []
  },
  {
      "title": "Paragraph Preview",
      "description": "Create a preview of for paragraph.xyz post",
      "publishDate": "28th July 2024",
      "url": "/paragraphpreview",
      "tags": []
  },
  {
      "title": "Get prompt from image",
      "description": "Get prompt from an image",
      "publishDate": "29th July 2024",
      "url": "/getprompt",
      "tags": []
  },
  {
      "title": "Extract Text from Image",
      "description": "Extract text from an image",
      "publishDate": "29th July 2024",
      "url": "/extracttext",
      "tags": []
  },
  {
      "title": "Resale value",
      "description": "Check the resale value of a product",
      "publishDate": "30th July 2024",
      "url": "/resalevalue",
      "tags": []
  },
  {
      "title": "Text to Cost of Fun",
      "description": "Convert text to cost of fun",
      "publishDate": "31st July 2024",
      "url": "/text2costoffun",
      "tags": []
  },
  {
      "title": "Paris 2024",
      "description": "Add paris 2024 eye patch to your pfp",
      "publishDate": "1st Aug 2024",
      "url": "/paris2024",
      "tags": []
  },
  {
      "title": "Check your image",
      "description": "Add a check to your image",
      "publishDate": "2nd Aug 2024",
      "url": "/addcheck",
      "tags": []
  },
  {
      "title": "Story Engineering",
      "description": "Engineer your story",
      "publishDate": "3rd Aug 2024",
      "url": "/storyengineering",
      "tags": []
  },
  {
      "title": "No Punk Glasses",
      "description": "Add no punk glasses on any image",
      "publishDate": "4th Aug 2024",
      "url": "/nopunkglasses",
      "tags": []
  },
  {
      "title": "Blood Bath",
      "description": "Add red filter to your image",
      "publishDate": "5th Aug 2024",
      "url": "/bloodbath",
      "tags": []
  },
  {
      "title": "Opt Out",
      "description": "Add opt out filter to your image",
      "publishDate": "6th Aug 2024",
      "url": "/optout",
      "tags": []
  },
  {
      "title": "Pdf to Audio",
      "description": "Convert pdf to audio",
      "publishDate": "7th Aug 2024",
      "url": "/pdf2audio",
      "tags": []
  },
  {
      "title": "AI or not",
      "description": "Check if an image is generated by AI or not",
      "publishDate": "8th Aug 2024",
      "url": "/aiornot",
      "tags": []
  },
  {
      "title": "Dreamy",
      "description": "Dreamy your image",
      "publishDate": "9th Aug 2024",
      "url": "/dreamy",
      "tags": []
  },
  {
      "title": "Get Filters",
      "description": "Get filters applied to an image",
      "publishDate": "10th Aug 2024",
      "url": "/getfilters",
      "tags": []
  },
  {
      "title": "Floor plan from image",
      "description": "Get floor plan from an image",
      "publishDate": "11th Aug 2024",
      "url": "/floorplan",
      "tags": []
  },
  {
      "title": "V",
      "description": "V",
      "publishDate": "11th Aug 2024",
      "url": "/v",
      "tags": []
  },
  {
      "title": "Text to Emoji",
      "description": "Text to emoji",
      "publishDate": "12th Aug 2024",
      "url": "/text2emoji",
      "tags": []
  },
  {
      "title": "Add no punks",
      "description": "Add no punks on any image",
      "publishDate": "13th Aug 2024",
      "url": "/nopunks",
      "tags": []
  },
  {
      "title": "Image to story",
      "description": "Generate image from story",
      "publishDate": "14th Aug 2024",
      "url": "/img2story",
      "tags": []
  },
  {
      "title": "Higher Athletics",
      "description": "Create higher athletics poster",
      "publishDate": "15th Aug 2024",
      "url": "/higherathletics",
      "tags": ['higher']
  },
  {
      "title": "Coby",
      "description": "Add coby to your image",
      "publishDate": "16th Aug 2024",
      "url": "/coby",
      "tags": []
  },
  {
      "title": "fwog",
      "description": "Add fwog to your image",
      "publishSate": "17th Aug 2024",
      "url": "/fwog",
      "tags": []
  },
  {
      "title": "Regenerates",
      "description": "Add regenerate bg to your image",
      "publishDate": "18th Aug 2024",
      "url": "/regenerates",
      "tags": []
  },
  {
      "title": "Opepen Scapes",
      "description": "Create opepen scapes",
      "publishDate": "19th Aug 2024",
      "url": "/opepenscapes",
      "tags": []
  },
  {
      "title": "Get ipfs link",
      "description": "Get ipfs link for a file on browser",
      "publishDate": "20th Aug 2024",
      "url": "/getipfs",
      "tags": []
  },
  {
      "title": "Zorbs",
      "description": "Get gradient zorb",
      "publishDate": "21st Aug 2024",
      "url": "/text2zorb",
      "tags": []
  },
  {
      "title": "Possibilities",
      "description": "Get possibilities for your future",
      "publishDate": "23rd Aug 2024",
      "url": "/possibilities",
      "tags": []
  },
  {
      "title": "Download all images",
      "description": "Download all images from a website",
      "publishDate": "26th Aug 2024",
      "url": "/downloadimages",
      "tags": []
  },
  {
      "title": "Remove BG",
      "description": "Remove background from an image",
      "publishDate": "27th Aug 2024",
      "url": "/removebg",
      "tags": []
  },
  {
      "title": "Remove watermark",
      "description": "Remove watermark from an image",
      "publishDate": "28th Aug 2024",
      "url": "/removewatermark",
      "tags": []
  },
  {
      "title": "Brainlet",
      "description": "Turn any image into brainlet",
      "publishDate": "28th Aug 2024",
      "url": "/brainlet",
      "tags": []
  },
  {
      "title": "Spongebob Text",
      "description": "Convert text to spongebob text",
      "publishDate": "29th Aug 2024",
      "url": "/spongebobtext",
      "tags": []
  },
  {
      "title": "Grainy gif",
      "description": "Add grainy effect to your gif",
      "publishDate": "30th Aug 2024",
      "url": "/grainygifs",
      "tags": []
  },
  {
      "title": "Unexcuse",
      "description": "Unexcuse your excuse for e.g., \"I am too busy\" -> \"BS this is not a priority\"",
      "publishDate": "30th Aug 2024",
      "url": "/unexcuse",
      "tags": []
  },
  {
      "title": "Feedback loop",
      "description": "Get feedback loop from from any entity",
      "publishDate": "31st Aug 2024",
      "url": "/feedbackloop",
      "tags": []
  },
  {
      "title": "Glitch gif",
      "description": "Add glitch effect to your gif",
      "publishDate": "31st Aug 2024",
      "url": "/glitchgifs",
      "tags": []
  },
  {
      "title": "Progressive Blur",
      "description": "Add progressive blur to your image",
      "publishDate": "1st Sep 2024",
      "url": "/progressiveblur",
      "tags": []
  },
  {
      "title": "Liquify",
      "description": "Liquify your image",
      "publishDate": "2nd Sep 2024",
      "url": "/liquify",
      "tags": []
  },
  {
      "title": "Meal Breakdown from image",
      "description": "Get meal breakdown from an image",
      "publishDate": "3rd Sep 2024",
      "url": "/mealbreakdown",
      "tags": []
  },
  {
      "title": "Add text to image",
      "description": "Add text to image",
      "publishDate": "4th Sep 2024",
      "url": "/addtext",
      "tags": []
  },
  {
      "title": "Tinydino Punk Hat",
      "description": "Add tinydino punk hat on any image",
      "publishDate": "5th Sep 2024",
      "url": "/tinydinopunkhat",
      "tags": []
  },
  {
      "title": "HigherFM",
      "description": "Add higherfm on any image",
      "publishDate": "6th Sep 2024",
      "url": "/higherfm",
      "tags": ['higher']
  },
  {
      "title": "Colors",
      "description": "Get all colors from hex",
      "publishDate": "11th Sep 2024",
      "url": "/colors",
      "tags": []
  },
  {
      "title": "Complementary Colors",
      "description": "Get complementary color from hex",
      "publishDate": "12th Sep 2024",
      "url": "/complementarycolors",
      "tags": []
  },
  {
      "title": "Higher Confessions",
      "description": "Generate higher confessions",
      "publishDate": "13th Sep 2024",
      "url": "/higherconfessions",
      "tags": ['higher']
  },
  {
      "title": "Prompt Editor",
      "description": "Edit prompt",
      "publishDate": "16th Sep 2024",
      "url": "/prompteditor",
      "tags": []
  },
  {
      "title": "Imagine",
      "description": "Imagine",
      "publishDate": "17th Sep 2024",
      "url": "/imagine",
      "tags": []
  },
  {
      "title": "2nd/3rd order effects",
      "description": "2nd/3rd order effects",
      "publishDate": "18th Sep 2024",
      "url": "/effects",
      "tags": []
  },
  {
      "title": "Customer Discovery Questions",
      "description": "Generate customer discovery questions",
      "publishDate": "19th Sep 2024",
      "url": "/customerdiscovery.js",
      "tags": []
  },
  {
      "title": "Learn any language",
      "description": "Learn any language",
      "publishDate": "20th Sep 2024",
      "url": "/learnlanguage",
      "tags": []
  },
  {
      "title": "Generate text emoji",
      "description": "Generate text emoji like (╯°□°)╯︵ ┻━┻",
      "publishDate": "20th Sep 2024",
      "url": "/textemoji",
      "tags": []
  },
  {
      "title": "Muscle Stretches",
      "description": "Get muscle stretches for your body parts",
      "publishDate": "21st Sep 2024",
      "url": "/musclestretch",
      "tags": []
  },
  {
      "title": "Listen to Website",
      "description": "Listen to website",
      "publishDate": "22nd Sep 2024",
      "url": "/listenwebsite",
      "tags": []
  },
  {
      "title": "Transcribe Audio",
      "description": "Transcribe Audio",
      "publishDate": "23rd Sep 2024",
      "url": "/transcribe",
      "tags": []
  },
  {
      "title": "Grainy Gif",
      "description": "Turn your images into grainy gifs",
      "publishDate": "24th Sep 2024",
      "url": "/img2grainygif",
      "tags": []
  },
  {
      "title": "Ask Website",
      "description": "Ask website",
      "publishDate": "25th Sep 2024",
      "url": "/askwebsite",
      "tags": []
  },
  {
      "title": "Scape Mobile Wallpaper",
      "description": "Create mobile wallpaper from image",
      "publishDate": "26th Sep 2024",
      "url": "/scapewallpaper",
      "tags": []
  },
  {
      "title": "Find RSS feed",
      "description": "Find RSS feed for any website",
      "publishDate": "29th Sep 2024",
      "url": "/findrssfeed",
      "tags": []
  },
  {
      "title": "Sign Language",
      "description": "Convert text to sign language",
      "publishDate": "30th Sep 2024",
      "url": "/signlanguage",
      "tags": []
  },
  {
      "title": "Fibonacci",
      "description": "Generate fibonacci sequence",
      "publishDate": "1st Oct 2024",
      "url": "/fibonacci",
      "tags": []
  },
  {
      "title": "Painting Tool",
      "description": "Painting Tool",
      "publishDate": "2nd Oct 2024",
      "url": "/painting",
      "tags": []
  },
  {
      "title": "Lichess Gif",
      "description": "Get lichess game as gif",
      "publishDate": "3rd Oct 2024",
      "url": "/lichessgif",
      "tags": []
  },
  {
      "title": "Explain Like I want to",
      "description": "Explain like I want to",
      "publishDate": "4th Oct 2024",
      "url": "/explainlikeiwant",
      "tags": []
  },
  {
      "title": "Compressionist",
      "description": "Compress your image",
      "publishDate": "5th Oct 2024",
      "url": "/compressionist",
      "tags": []
  },
  {
      "title": "Twitter Banner",
      "description": "Image to twitter banner",
      "publishDate": "6th Oct 2024",
      "url": "/twitterbanner",
      "tags": []
  },
  {
      "title": "Gradient Wave",
      "description": "Generate gradient wave",
      "publishDate": "7th Oct 2024",
      "url": "/gradientwave",
      "tags": []
  },
  {
      "title": "Keyboard Mouse Lock",
      "description": "Lock your keyboard and mouse",
      "publishDate": "8th Oct 2024",
      "url": "/keyboardmouselock",
      "tags": []
  },
  {
      "title": "Text 2 Logo",
      "description": "Turn text into logo",
      "publishDate": "9th Oct 2024",
      "url": "/text2logo",
      "tags": []
  },
  {
      "title": "Save SVG as PNG",
      "description": "Save SVG as PNG",
      "publishDate": "17th Oct 2024",
      "url": "/svg2png",
      "tags": []
  },
  {
      "title": "Higher Filters",
      "description": "Apply higher filter to your image",
      "publishDate": "18th Oct 2024",
      "url": "/higherfilter",
      "tags": ['higher']
  },
  {
    title: 'Diamond Filter',
    description: 'Click the area you want to fill with diamond texture',
    publishDate: '20th Oct 2024',
    url: '/diamondfilter',
    tags: []
  },
  {
    title: 'Custom Texture',
    description: 'Click the area you want to fill with custom texture',
    publishDate: '21th Oct 2024',
    url: '/customtexture',
    tags: []
  },
  {
    title: 'Add Image',
    description: 'Add image to your image',
    publishDate: '22th Oct 2024',
    url: '/addimage',
    tags: []
  },
  {
    title: 'Higher Filter Gif',
    description: 'Apply higher filter to your gif',
    publishDate: '23th Oct 2024',
    url: '/higherfiltergif',
    tags: ['higher']
  },
  {
    title: 'Invert Colors',
    description: 'Invert colors of your image',
    publishDate: '24th Oct 2024',
    url: '/invert',
    tags: []
  },
  {
    title: 'Wow',
    description: 'Wow',
    publishDate: '25th Oct 2024',
    url: '/wow',
    tags: []
  },
  {
    title: 'Collage',
    description: 'Create collage',
    publishDate: '26th Oct 2024',
    url: '/collage',
    tags: []
  }
]

export default function Home() {
  const router = useRouter();
  const { tags } = router.query; // Get tags from query params
  const [search, setSearch] = useState('')
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    const tagArray = tags ? tags.split(',') : []; // Split tags into an array
    setFilteredTools(tools.filter(tool => 
      (tool.title.toLowerCase().includes(search.toLowerCase()) || 
      tool.description.toLowerCase().includes(search.toLowerCase())) &&
      (tagArray.length === 0 || tagArray.some(tag => tool.tags.includes(tag)))
    ).reverse());  // reverse to show latest first
  }, [search, tags]) // Add tags to dependency array

  return (
    <>
      <Head>
        <title>Tools by Nishu</title>
        <meta name="description" content="tools.nishu.dev" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
          }} placeholder="Search for tools... for e.g., 'nft'" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', marginBottom: 30 }}>
          {filteredTools.map((tool, index) => (
            <a key={index} href={tool.url}>
              <p style={{
                fontSize: '1rem',
                color: '#eee',
                marginBottom: '10px',
              }}>{filteredTools.length - (index + 1)}. {tool.title}</p>
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
