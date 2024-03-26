// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let API_KEY = process.env.OPENAI_API_KEY;

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: API_KEY, // This is the default and can be omitted
});

export default async function handler(req, res) {
  let { prompt } = req.query;
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  console.log(chatCompletion.choices[0].message.content);

  res.status(200).json({ response: chatCompletion.choices[0].message.content });
}
