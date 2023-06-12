export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	let messages = [];
	const previousMessages = await readBody(event);
	messages = messages.concat(previousMessages);
	// Convert the messages to the new format
	const convertedMessages = messages.map((message) => {
		return {role: message.role.toLowerCase(), content: message.message};
	});
	// Add a system message at the start if it doesn't exist
	if (convertedMessages.length === 0 || convertedMessages[0].role !== 'system') {
		convertedMessages.unshift({
			role: 'system',
			content: 'You are a helpful assistant.'
		});
	}
	const req = await fetch('https://api.openai.com/v1/engines/davinci-codex/answers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: convertedMessages
		})
	});

	const res = await req.json();
	return {
		message: res.choices[0].message.content
	};
});
