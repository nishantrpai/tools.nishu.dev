// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let API_KEY = process.env.OPENAI_API_KEY;

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

export default async function handler(req, res) {
  // if request is a GET request
  if (req.method !== 'GET') {
    // check body for prompt
    let { prompt, model = 'gpt-3.5-turbo' } = JSON.parse(req.body);
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model
    });
    res.status(200).json({ response: chatCompletion.choices[0].message.content });
  }
  else {
    let { prompt, model = 'gpt-3.5-turbo' } = req.query;
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model
    });
    res.status(200).json({ response: chatCompletion.choices[0].message.content });
  }
}
