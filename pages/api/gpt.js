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
    let prompt, model, image_url;
    if (typeof req.body === 'string') {
      prompt = JSON.parse(req.body).prompt;
      model = JSON.parse(req.body).model;
      image_url = JSON.parse(req.body).image_url;
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
      const chatCompletion = await openai.chat.completions.create({
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
        }],
      });
      console.log('image here')
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
