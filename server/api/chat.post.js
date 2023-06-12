export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  let messages = [];
  const previosMessages = await readBody(event);
  messages = messages.concat(previosMessages);
  let prompt =
    messages.map((message) => `${message.role}: ${message.message}`).join('\n') + `\nAI:`;
  const req = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map((message) => ({
          role: message.role === 'AI' ? 'assistant' : 'user',
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
