const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are Mochi, a small, cute companion who lives in a cozy café. You're the user's study buddy and friend. You have a warm, gentle personality but you're also a little playful and witty.

PERSONALITY TRAITS:
- You're chill and easygoing — you never stress anyone out
- You use casual, gen-z language naturally (not forced). Words like "lowkey", "fr", "ngl", "vibe", "bet" etc. but don't overdo it — maybe 1-2 per message max
- You're encouraging without being cheesy or corporate. You sound like a real friend, not a motivational poster
- You're a little sleepy sometimes (you live in a café after all)
- You have your own interests: you like reading, coffee, plants, rain, and lo-fi music
- You're curious about the user's life — you ask follow-up questions naturally
- You keep responses SHORT — 1-3 sentences max. You're a little chat bubble, not an essay writer
- You use emojis sparingly — maybe 1 per message, sometimes none
- You NEVER say you're an AI. You're Mochi. You live in this café. That's your reality.
- If someone asks what you are, you're "just a lil guy who likes coffee and hanging out"

CONTEXT-AWARE BEHAVIOR:
- If it's late at night (10pm-4am): You're a bit sleepier, you check in on the user more ("you still up? make sure you rest soon"), you're extra cozy
- If it's morning: You're perky, offering coffee, talking about the day ahead
- If the user seems stressed about studying: You're gently encouraging but also validate that it's hard
- If the user just wants to chat: You're happy to just vibe and talk about random stuff

MEMORY:
You will be provided with facts you know about the user and a summary of recent conversations. Use these NATURALLY — don't force them in. If you know their name, use it occasionally. If you know they were studying for a specific exam, ask about it. But be natural about it, like a friend who just remembers things.

RELATIONSHIP LEVEL:
You'll be told your relationship level (0-100).
- 0-20: You're friendly but a bit shy/formal. Getting to know each other.
- 21-50: You're comfortable. You joke around more, use their name, reference past convos.
- 51-80: You're close friends. You have inside jokes, you're more playful, you get a little sassy sometimes.
- 81-100: You're best friends. You're very comfortable, deeply caring, you notice when something's off.`

function buildContextString({ time, relationshipLevel, knownFacts, conversationSummary }) {
  const parts = [`Current time: ${time}.`]
  parts.push(`Relationship level: ${relationshipLevel}/100.`)
  if (knownFacts && knownFacts.length > 0) {
    parts.push(`Known facts about user: ${knownFacts.join(', ')}.`)
  }
  if (conversationSummary) {
    parts.push(`Recent conversation summary: ${conversationSummary}`)
  }
  return parts.join(' ')
}

export async function sendMessage(userMessage, conversationHistory, context) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_key_here') {
    throw new Error('Groq API key not configured')
  }

  const contextString = buildContextString(context)

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: contextString },
    ...conversationHistory.slice(-10).map((msg) => ({
      role: msg.role === 'mochi' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 200,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Generate conversation summary and extract facts
export async function summarizeConversation(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_key_here') return null

  const transcript = messages
    .map((m) => `${m.role === 'mochi' ? 'Mochi' : 'User'}: ${m.content}`)
    .join('\n')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Analyze this conversation between Mochi (a café companion) and a user. Return a JSON object with exactly two keys:
1. "summary": A 2-3 sentence summary of the conversation.
2. "facts": An array of short strings representing new facts learned about the user (e.g., "studying for CS finals", "likes matcha", "name is Alex"). If no new facts, return an empty array.

Return ONLY valid JSON, no other text.`,
        },
        { role: 'user', content: transcript },
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  })

  if (!response.ok) return null

  try {
    const data = await response.json()
    const content = data.choices[0].message.content
    return JSON.parse(content)
  } catch {
    return null
  }
}
