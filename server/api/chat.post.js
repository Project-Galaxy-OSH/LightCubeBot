import { initialPrompt, influencer_name } from './prompts.js';


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let messages = [];
  const previousMessages = await readBody(event);
  messages = messages.concat(previousMessages);
  let userPrompt =
    messages.map((message) => `${message.role}: ${message.message}`).join('\n') + `\n丶时光啊AI:`;
  const req = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        { role: 'user', content: `${initialPrompt} Act as ${influencer_name} were to start a conversation with a fan, how might they reply? Please reply in the first-person view and make it impressive. Output your words in Chinese.` },
        ...messages.map((message) => ({
          role: message.role === '丶时光啊AI' ? 'assistant' : 'user',
          content: message.message
        }))
      ]
    })
  });

  const res = await req.json();
  const result = res.choices[0].message;
  return {
    message: result.content
  };
});
