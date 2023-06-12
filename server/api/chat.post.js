export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	let messages = [];
	const previousMessages = await readBody(event);
	messages = messages.concat(previousMessages);
	let prompt = messages.map((message) => {
		return {
			role: message.role === 'AI' ? 'assistant' : 'user',
			content: message.message
		};
	});
	const req = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: prompt
		})
	});

	const res = await req.json();
	const result = res.choices[0].message.content;
	return {
		message: result
	};
});
