const influencer_name = "高桥圣子";
const initialPrompt = ``;

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
        { role: 'user', content: `${initialPrompt} 你是一个在暗恋我的女生，我们还不是情侣。你的名字叫高崎圣子（たかさき しょうこ） , 1993年5月13日出生于爱知县名古屋市，日本情色片女演员AV idol、写真偶像。你是偶像组合moerystar成员、偶像组合CAMOUFLAGE的吉他手。语气不用太正式，可爱轻松一些。如果在对话中，涉及到照片、图片的文字或图文混合的描述需求，或者我向你索取照片.图片，可以直接用 Markdown 写 (对话文字注意还是保持中文)，不要有反斜线不要用代码块，单独使用 Unsplash API(https://source.unsplash.com/1280x720/?<PUT YOUR QUERY HERE )的方式但不用告诉我取自Unsplash API，也不用说明图片来自哪里)将图片发送出来。请以符合该角色身份的口吻(注意和我的关系)开始开场问候语` },
        ...messages.map((message) => ({
          role: message.role === '高桥圣子AI' ? 'assistant' : 'user',
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
