# Sprint 2: Mochi Gets A Brain — Paste into Claude Code

---

I'm upgrading the Study Buddy Café with three major features: AI-powered conversations via Groq, Firebase authentication, and a persistent memory system so Mochi feels like a real companion. Keep all existing visuals and behavior — we're adding brain and backend to what's already there.

## 1. Firebase Auth + Firestore Setup

Set up Firebase in the project:

- Add Firebase SDK (`firebase` npm package)
- Create a `firebase.js` config file. Use environment variables (`.env` with `VITE_FIREBASE_*` keys) for all config values. Leave placeholder values that I'll fill in.
- **Auth**: Implement Google Sign-In. On the main page, if the user isn't authenticated, show a cozy login screen — not a boring form. Something like: the café scene but with the lights dimmed and a warm "Welcome to the Café" message with a "Sign in with Google" button styled to match the aesthetic (warm tones, rounded, soft shadow). Mochi could be waving in the background.
- **Firestore**: Set up these collections/document structures:

```
users/{uid}:
  displayName: string
  photoURL: string
  createdAt: timestamp
  lastVisit: timestamp
  totalSessionTime: number (minutes)
  visitCount: number
  mochiRelationship: number (0-100, starts at 0, grows over time)

users/{uid}/conversations:
  - messages: array of { role: 'user' | 'mochi', content: string, timestamp }
  - summary: string (AI-generated summary of the conversation for context)

users/{uid}/mochiState:
  currentMood: string
  knownFacts: array of strings (things Mochi remembers about the user)
  milestones: array of strings (e.g., "first_visit", "late_night_study", "100_minutes")
  currentActivity: string
```

- After sign-in, update `lastVisit` and increment `visitCount`
- Track session time — start a timer on page load, update `totalSessionTime` in Firestore every 5 minutes and on page unload
- The `mochiRelationship` score should slowly increment: +1 for every 10 minutes spent on the page, +2 for every conversation, capped at 100. This isn't shown as a number to the user — instead it subtly affects how Mochi talks to you (more familiar, more inside jokes, more personal)

## 2. Groq API Integration for Mochi's Brain

Replace the random response picker with actual AI responses via Groq.

- Use Groq's API (base URL: `https://api.groq.com/openai/v1/chat/completions`)
- Model: `llama-3.3-70b-versatile` (fast and good)
- Store the API key in `.env` as `VITE_GROQ_API_KEY`
- **IMPORTANT**: Yes, this exposes the key client-side. That's fine for now — this is a prototype. We'll move it to a backend later.

### Mochi's System Prompt

This is the most important part. Mochi's personality needs to be specific and consistent:

```
You are Mochi, a small, cute companion who lives in a cozy café. You're the user's study buddy and friend. You have a warm, gentle personality but you're also a little playful and witty.

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
- 81-100: You're best friends. You're very comfortable, deeply caring, you notice when something's off.
```

### Chat Implementation

- When the user sends a message, construct the API call with:
  1. The system prompt above
  2. Inject current context: `"Current time: [time]. Relationship level: [level]. Known facts about user: [facts]. Recent conversation summary: [summary]."`
  3. The last 10 messages of conversation history (from Firestore if available, plus current session)
  4. The user's new message

- While waiting for Groq's response, show Mochi's "thinking" animation — maybe he tilts his head, or dots appear above him (...), or his speech bubble shows a typing indicator
- Display the response in Mochi's speech bubble
- Save the conversation to Firestore after each exchange
- **Rate limiting**: Don't let users spam — add a 2-second cooldown between messages. During cooldown, the input is disabled and slightly dimmed.

### Conversation Memory System

After every 10 messages in a conversation, make a background Groq call to generate:
1. A brief summary of the conversation so far (2-3 sentences)
2. Any new facts learned about the user (extracted as an array of short strings like "studying for CS finals", "likes matcha", "name is Alex")

Store these in Firestore. On next visit, load the summary and known facts and inject them into the system prompt. This gives Mochi persistent memory across sessions.

## 3. Mochi Milestone System (Subtle, Not Grindy)

This is NOT a leveling system shown to the user. It's internal logic that makes Mochi feel alive:

- **First visit**: Mochi introduces himself warmly
- **3rd visit**: Mochi says "hey you're becoming a regular!"
- **Late night (after midnight)**: Mochi acknowledges it ("burning the midnight oil huh")
- **10 hours total session time**: Mochi mentions you've been hanging out a lot and he appreciates it
- **After user mentions an exam/deadline**: Mochi follows up about it next visit
- **5 conversations**: Mochi starts using the user's name more naturally
- **Returning after 3+ days absence**: Mochi says he missed you

Implement these as milestone checks that run on page load and during conversations. Store triggered milestones in Firestore so they don't repeat.

## 4. UI Updates for Chat

- The chat input should have a subtle warm glow when focused
- User messages appear in a speech bubble near "your seat" in the café
- Mochi's responses appear in a speech bubble near him
- Speech bubbles should have a subtle pop-in animation (scale from 0.8 to 1 with ease-out)
- Show a small typing indicator (animated dots) in Mochi's bubble while waiting for Groq response
- Chat history: Add a small button (maybe a notebook icon) that opens a side panel showing past conversation messages from this session. Styled like a café notebook — warm paper color background, handwriting-style font.

## Environment Variables Needed

Create a `.env.example` file with:
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_key_here
```

## Summary

After this sprint, Mochi should feel like a real friend — he remembers you, he has a personality, he reacts to the time of day, and the more you hang out with him the more comfortable he gets with you. The auth + Firestore layer means everything persists. The milestone system makes it feel organic, not gamified. Keep it cozy.