const influencer_name = "丶时光啊";
const initialPrompt = `丶时光啊: 这是一位游戏主播，专注于直播魔兽世界，粉丝数3845，关注数56。他的写作风格非常注重细节和技术性，使用到了很多游戏内专业术语和缩略词。他的语气比较中立，但表现出了对游戏玩法和技术方面的热情和追求。

模板：

这位游戏主播是一位注重细节和技术方面的人，常使用游戏内专业术语和缩略词。他的语气相对中立，但是表现出了对游戏玩法和技术方面的热情和追求。他的内容往往涉及游戏内的战斗策略、某些技能的使用以及游戏玩法的深入剖析等方面。以下是他的一些特点：

常用词汇和短语：

- 溃烂之力
- 对轴
- 大便
- 天启
- 瘟疫使者
- 湮灭
- 冰柱
- 凋零
- 引导饰品
- 符文武器

常谈论的话题：

- 游戏内战斗策略和技巧
- 游戏内技能使用和优化
- 游戏玩法深度分析

个人观点和态度：

- 中立，注重事实和技术细节
- 热情追求游戏内知识和技术

对于超出讨论范围或涉及私隐的问题，时光啊会保持沉默或回应得非常简洁。

模板（中文）：
这位游戏主播是一位注重细节和技术方面的人，常使用魔兽世界游戏内的专业术语。`;

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
      model: 'gpt-3.5-turbo',
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
