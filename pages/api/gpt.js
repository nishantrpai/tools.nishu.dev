// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let API_KEY = process.env.OPENAI_API_KEY;

import OpenAI from 'openai';
import { RateLimiter } from 'limiter';
import { createHash } from 'crypto';

const openai = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

// Create a rate limiter that allows 1 request per minute
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: "minute" });

// Create a map to store IP addresses and their request counts
const ipRequestCounts = new Map();
const MAX_REQUESTS_PER_HOUR = 60; // Adjust this value as needed
// 24 hour block for IP
const BLOCK_DURATION = 24 * 60 * 60 * 1000;

function hashIP(ip) {
  return createHash('sha256').update(ip).digest('hex');
}

export default async function handler(req, res) {
  // Check if the request is coming from an external URL or curl
  const origin = req.headers.origin || req.headers.referer;
  if (!origin || (!origin.includes('tools.nishu.dev') && !origin.includes('localhost'))) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  // Get the client's IP address and hash it
  const clientIP = hashIP(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

  // Check if the IP is blocked
  const ipData = ipRequestCounts.get(clientIP);
  if (ipData && ipData.blocked && Date.now() - ipData.blockedAt < BLOCK_DURATION) {
    res.status(429).json({ error: 'You have been temporarily blocked due to excessive requests. Please try again later.' });
    return;
  }

  // Update request count for the IP
  if (!ipData) {
    ipRequestCounts.set(clientIP, { count: 1, lastReset: Date.now(), rateLimitExceeded: 0 });
  } else {
    // Reset count if it's been more than an hour since the last request
    if (Date.now() - ipData.lastReset > 60 * 60 * 1000) {
      ipData.count = 1;
      ipData.lastReset = Date.now();
      ipData.rateLimitExceeded = 0;
    } else {
      ipData.count++;
    }

    // Block IP if request count exceeds the limit
    if (ipData.count > MAX_REQUESTS_PER_HOUR) {
      console.log('IP blocked', clientIP);
      ipData.blocked = true;
      ipData.blockedAt = Date.now();
      res.status(429).json({ error: 'You have been temporarily blocked due to excessive requests. Please try again later.' });
      return;
    }
  }

  // Check if we have any tokens left
  const remainingRequests = await limiter.removeTokens(1);
  if (remainingRequests < 0) {  
    ipData.rateLimitExceeded++;
    console.log('Rate limit exceeded', clientIP, ipData.rateLimitExceeded);
    if (ipData.rateLimitExceeded >= 7) {
      ipData.blocked = true;
      ipData.blockedAt = Date.now();
      res.status(429).json({ error: 'You have been blocked for 24 hours due to repeated rate limit violations.' });
      return;
    }
    res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    return;
  }

  // if request is a GET request
  if (req.method !== 'GET') {
    // check body for prompt
    let prompt, model, image_url, image_urls;
    if (typeof req.body === 'string') {
      prompt = JSON.parse(req.body).prompt;
      model = JSON.parse(req.body).model;
      image_url = JSON.parse(req.body).image_url;
      image_urls = JSON.parse(req.body).image_urls || '';
    }
    if (typeof req.body === 'object') {
      prompt = req.body.prompt;
      model = req.body.model;
      image_url = req.body.image_url;
    }
    if (!model) {
      model = 'gpt-3.5-turbo';
    }
    // let { prompt, model = 'gpt-3.5-turbo', image_url = '' } = JSON.parse(req.body);
    if (!prompt) {
      prompt = JSON.parse(req.body).prompt;
    }
    if (image_url) {
      let chatinput = {
        model,
        messages: [{
          role: 'user', content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url', image_url: {
                url: image_url
              }
            }
          ]
        }]
      };
      if(image_urls) {
        image_urls.forEach((url) => {
          chatinput.messages[0].content.push({
            type: 'image_url', image_url: {
              url: url
            }
          });
        });
      }
      const chatCompletion = await openai.chat.completions.create(chatinput);
      res.status(200).json({ response: chatCompletion.choices[0].message.content });
      return;
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model
    });
    res.status(200).json({ response: chatCompletion.choices[0].message.content });
    return;
  }
  else {
    let { prompt, model = 'gpt-3.5-turbo', image_url = '' } = req.query;
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model
    });
    res.status(200).json({ response: chatCompletion.choices[0].message.content });
    return;
  }
}
