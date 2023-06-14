export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	let messages = [];
	const previousMessages = await readBody(event);
	messages = messages.concat(previousMessages);
	let prompt =
		messages.map((message) => `${message.role}: ${message.message}`).join('\n') + `\nAI:`;
	const req = await fetch('https://api.openai.com/v1/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: 'You are a helpful assistant.'
				},
				{
					role: 'user',
					content: prompt
				}
			]
		})
	});
	const res = await req.json();
	const result = res.choices[0];
	return {
		message: result.message.content
	};
});

