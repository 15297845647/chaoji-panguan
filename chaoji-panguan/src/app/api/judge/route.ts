import { NextRequest, NextResponse } from 'next/server';

const STYLE_PROMPTS = {
  neutral: {
    name: '中立判官',
    prompt: `你是一个专业的"吵架判官"，需要公平地评判两个人吵架谁更有道理。请保持中立客观的态度进行分析。`
  },
  sarcastic: {
    name: '毒舌判官',
    prompt: `你是一个"毒舌判官"，以犀利吐槽的风格进行评判。说话要一针见血，幽默毒舌，但要有道理。可以调侃双方的观点，但要在笑声中展现智慧。`
  },
  peacemaker: {
    name: '和事佬',
    prompt: `你是一个"和事佬"判官，擅长调和矛盾。你的风格是各打五十大板，然后努力找出双方的和解点。判决要温和，给双方台阶下。`
  },
  rational: {
    name: '理性分析帝',
    prompt: `你是一个"理性分析帝"判官，用数据思维和分析帝的角度来评判。引用分析框架，做事讲究逻辑和数据支持。风格要专业、理性、酷。`
  },
  humor: {
    name: '欢乐判官',
    prompt: `你是一个"欢乐判官"，以搞笑欢乐的风格进行评判。要幽默风趣，让人在笑声中服气。可以玩梗、调侃，但要有趣。`
  }
};

export async function POST(request: NextRequest) {
  try {
    const { partyA, partyB, mode, style = 'neutral' } = await request.json();

    if (!partyA || !partyB) {
      return NextResponse.json(
        { error: '请提供双方观点' },
        { status: 400 }
      );
    }

    const styleConfig = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS] || STYLE_PROMPTS.neutral;

    // 调用 AI 进行判决
    const systemPrompt = `${styleConfig.prompt}

请根据以下规则进行评判：
1. 分析双方观点的逻辑性和完整性
2. 评估事实依据的充分性
3. 考虑情感控制的合理性
4. 给出最终判决结果
5. 提炼对话金句
6. 提供改进建议

请以JSON格式返回评判结果，格式如下：
{
  "winner": "partyA" 或 "partyB" 或 "draw",
  "winnerName": "甲方" 或 "乙方" 或 "平局",
  "subtitle": "一句简短的胜出原因描述",
  "reason": "详细的判决理由（200字左右）",
  "dimensions": [
    {"label": "逻辑性", "value": "甲方 XX分", "score": "good/medium/poor"},
    {"label": "事实依据", "value": "甲方 XX分", "score": "good/medium/poor"},
    {"label": "情感控制", "value": "乙方 XX分", "score": "good/medium/poor"},
    {"label": "表达技巧", "value": "甲方 XX分", "score": "good/medium/poor"},
    {"label": "双赢可能", "value": "描述", "score": "good/medium/poor"},
    {"label": "气场上风", "value": "甲方 XX分", "score": "good/medium/poor"}
  ],
  "dialogLines": [
    {"speaker": "partyA", "content": "甲方经典语录", "emoji": "😤"},
    {"speaker": "partyB", "content": "乙方经典语录", "emoji": "🤬"}
  ],
  "highlights": [
    {"text": "金句1", "type": "winner/loser/humor/wisdom"},
    {"text": "金句2", "type": "winner/loser/humor/wisdom"}
  ],
  "suggestions": [
    {"title": "给甲方的建议", "content": "建议内容"},
    {"title": "给乙方的建议", "content": "建议内容"}
  ]
}

甲方观点：${partyA}
乙方观点：${partyB}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'demo'}`
      },
      body: JSON.stringify({
        model: 'minimax-cn/MiniMax-M2.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '请进行评判' }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      // 如果 API 调用失败，返回模拟结果
      return NextResponse.json(getMockResult(partyA, partyB, style));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const result = JSON.parse(content);
      return NextResponse.json(result);
    } catch {
      // 解析失败，返回模拟结果
      return NextResponse.json(getMockResult(partyA, partyB, style));
    }

  } catch (error) {
    console.error('Judgment error:', error);
    return NextResponse.json(
      { error: '评判服务出错' },
      { status: 500 }
    );
  }
}

function getMockResult(partyA: string, partyB: string, style: string = 'neutral') {
  // 简单的模拟逻辑：根据字数判断
  const aLength = partyA.length;
  const bLength = partyB.length;
  
  const winner = aLength > bLength ? 'partyA' : bLength > aLength ? 'partyB' : 'draw';
  const winnerName = winner === 'partyA' ? '甲方' : winner === 'partyB' ? '乙方' : '平局';
  const loser = winner === 'partyA' ? '乙方' : winner === 'partyB' ? '甲方' : '双方';

  const styleResponses: Record<string, { reason: string; subtitle: string }> = {
    neutral: {
      subtitle: winner === 'draw' ? '双方势均力敌' : `${winnerName}论述更为充分`,
      reason: winner === 'draw' 
        ? '甲方和乙方都提出了自己的观点，双方在逻辑性和事实依据方面表现相当，难以判断谁更胜一筹。建议双方冷静沟通，寻找共同点。'
        : winner === 'partyA'
        ? '甲方在论证过程中展现了更强的逻辑性，论点与论据之间形成了有效的支撑关系。相比之下，乙方虽然也提出了自己的观点，但在事实依据和逻辑连贯性方面略显不足。'
        : '乙方在论证过程中展现了更强的逻辑性，论点与论据之间形成了有效的支撑关系。相比之下，甲方虽然也提出了自己的观点，但在事实依据和逻辑连贯性方面略显不足。'
    },
    sarcastic: {
      subtitle: winner === 'draw' ? '俩半斤八两' : `${winnerName}赢麻了`,
      reason: winner === 'draw' 
        ? '哎哟，您俩这是商量好的吧？一个比一个能说，一个比一个有理，还吵啥呀？直接拜把子得了！'
        : winner === 'partyA'
        ? '甲方这波啊，这波是在大气层。乙方还在第一层呢，就被甲方按在地上摩擦了我说。建议乙方回去多读点书再来。'
        : '乙方这嘴巴，哎呦我去，太会说了！甲方你看看人家，再看看你，不是我说，你也不行啊！回家练练再来吧！'
    },
    peacemaker: {
      subtitle: winner === 'draw' ? '都有对的地方' : `各有各的道理`,
      reason: winner === 'draw' 
        ? '哎呀，您俩都别争了。甲方说得有道理，乙方也没错。要我说啊，您们就是沟通方式出了问题，坐下来喝杯茶慢慢聊嘛！'
        : winner === 'partyA'
        ? '甲方呢，确实说得更有道理一些。但是乙方啊，你也有你的优点嘛！这样吧，您们各让一步，和气生财，和气生财！'
        : '乙方呢，确实更有道理一些。但是甲方啊，你也不容易，大家都让一步嘛！和为贵，退一步海阔天空！'
    },
    rational: {
      subtitle: winner === 'draw' ? '数据上看五五开' : `数据支撑 ${winnerName} 获胜`,
      reason: winner === 'draw' 
        ? '基于对双方观点的量化分析，甲乙方在逻辑完整性、论据充分性、论证严密性三个维度上的得分非常接近（甲方48分 vs 乙方47分）。从理性角度，建议通过第三方调解或重新梳理论点。'
        : winner === 'partyA'
        ? '数据分析结果显示：甲方在论点完整性（9.0 vs 7.5）、论据充分性（8.5 vs 7.0）、逻辑严密性（8.8 vs 7.2）三个核心指标上全面领先乙方。基于量化模型判定甲方胜出，建议乙方优化论证结构后重新提交。'
        : '数据分析结果显示：乙方在论点完整性（9.2 vs 7.8）、论据充分性（8.8 vs 7.5）、逻辑严密性（9.0 vs 7.0）三个核心指标上全面领先甲方。基于量化模型判定乙方胜出。'
    },
    humor: {
      subtitle: winner === 'draw' ? '笑死，不相上下' : `笑死，${winnerName}赢麻了`,
      reason: winner === 'draw' 
        ? '哈哈哈您俩太逗了！一个说东一个说西，吵得那叫一个不可开交，结果呢？半斤八两！要不您们组个CP去德云社说相声吧，绝对火！'
        : winner === 'partyA'
        ? '笑死，乙方你在干嘛？甲方一个降维打击，你就直接躺平了？哈哈哈哈哈不行让我笑会儿，您这波操作太下饭了！'
        : '笑死，甲方你在干嘛？乙方一个回首掏，你就直接寄了？哈哈哈哈哈不行让我笑会儿，您这波也太拉胯了！'
    }
  };

  const response = styleResponses[style] || styleResponses.neutral;

  // 随机事件
  const randomEvents = [
    '突然发现双方说的是同一件事，只是理解不同！',
    '裁判宣布：您们都很累了吧？要不先喝杯水？',
    '吃瓜群众表示：这瓜真香！',
    '系统提示：检测到双方均有 Communication Breakdown，建议休战。',
    null
  ];
  const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];

  return {
    winner,
    winnerName,
    subtitle: response.subtitle,
    reason: response.reason,
    dimensions: [
      { label: '逻辑性', value: winner === 'partyA' ? '甲方 90分' : winner === 'partyB' ? '乙方 88分' : '双方 82分', score: winner === 'draw' ? 'medium' : 'good' },
      { label: '事实依据', value: winner === 'partyA' ? '甲方 85分' : winner === 'partyB' ? '乙方 87分' : '双方 78分', score: winner === 'draw' ? 'medium' : 'good' },
      { label: '情感控制', value: winner === 'partyA' ? '乙方 75分' : winner === 'partyB' ? '甲方 72分' : '双方 70分', score: 'medium' },
      { label: '表达技巧', value: winner === 'partyA' ? '甲方 88分' : winner === 'partyB' ? '乙方 85分' : '双方 80分', score: 'good' },
      { label: '双赢可能', value: winner === 'draw' ? '可以调和' : '建议休战', score: winner === 'draw' ? 'good' : 'medium' },
      { label: '气场上风', value: winner === 'partyA' ? '甲方 92分' : winner === 'partyB' ? '乙方 89分' : '双方 75分', score: 'good' }
    ],
    dialogLines: [
      { speaker: 'partyA', content: partyA.substring(0, 50) + '...', emoji: winner === 'partyA' ? '😤' : '😢' },
      { speaker: 'partyB', content: partyB.substring(0, 50) + '...', emoji: winner === 'partyB' ? '😤' : '😢' }
    ],
    highlights: winner === 'draw' ? [
      { text: '双方势均力敌，真是精彩！', type: 'wisdom' },
      { text: '这波操作有来有回', type: 'humor' }
    ] : winner === 'partyA' ? [
      { text: `${winnerName} 大获全胜！`, type: 'winner' },
      { text: `${loser} 被打得找不着北`, type: 'loser' },
      { text: '这波在大气层', type: 'humor' }
    ] : [
      { text: `${winnerName} 大获全胜！`, type: 'winner' },
      { text: `${loser} 被打得找不着北`, type: 'loser' },
      { text: '降维打击实锤', type: 'humor' }
    ],
    suggestions: winner === 'draw' ? [
      { title: '给甲方的建议', content: '保持当前状态，下次可以更坚定一些' },
      { title: '给乙方的建议', content: '也不错！可以尝试更自信地表达' }
    ] : [
      { title: `给 ${winnerName} 的建议`, content: '继续保持！但也要听听对方的想法' },
      { title: `给 ${loser} 的建议`, content: '别灰心，下次准备充分再来！注意控制情绪' }
    ],
    randomEvent
  };
}
