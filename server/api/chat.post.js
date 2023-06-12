export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    let messages = [];
    const previousMessages = await readBody(event);

    // Add system message
    messages.push({
        role: "system",
        content: "You are a helpful assistant."
    });

    // Add previous user and assistant messages
    for (let message of previousMessages) {
        messages.push({
            role: message.role,
            content: message.message
        });
    }

    const req = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages
        })
    });

    const res = await req.json();
    const result = res.choices[0].message;

    return {
        message: result.content
    };
});
