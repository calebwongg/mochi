const greetings = [
  'Hey! Glad you\'re here \u{1F60A}',
  'Welcome back!',
  'Let\'s get it today!',
  'Ayyy what\'s good!',
  'Yo!! Pull up a chair \u{1F4BA}',
  'There they are! My study partner!',
]

const studyResponses = [
  'You got this! \u{1F4AA}',
  'We\'re in this together!',
  'One more chapter, let\'s go!',
  'I believe in you fr fr',
  'We\'re locked in \u{1F525}',
  'You\'re doing amazing, keep going!',
  'Finals won\'t know what hit em',
  'Brain gains \u{1F4AA}\u{1F9E0}',
  'This grind is gonna pay off so hard',
  'You and me vs this textbook, let\'s go',
]

const tiredResponses = [
  'Take a break if you need to, I\'ll be here',
  'Rest is productive too!',
  'Want me to grab you a coffee? \u2615',
  'It\'s okay to pause, you\'ve been going hard',
  'Close your eyes for a sec, I\'ll keep watch',
  'Nap arc? Nap arc is valid',
  'You\'ve earned a rest honestly',
]

const generalResponses = [
  'Haha nice',
  'That\'s real',
  'I feel that',
  'Lowkey same',
  'No cap \u{1F602}',
  'Truuue',
  'Valid \u{1F64F}',
  'Say less',
  'Fr fr',
  'You\'re vibes honestly',
  'Love that energy',
  'W take',
]

const foodResponses = [
  'Ooh wanna split a pastry? \u{1F950}',
  'I just made a fresh pot of coffee \u2615',
  'Snack break is essential fr',
  'The matcha here hits different ngl',
]

const funnyResponses = [
  'Lmaooo stop \u{1F602}',
  'Okay that was actually hilarious',
  'You\'re unhinged and I\'m here for it',
  'I\'m screaming \u{1F602}\u{1F602}',
]

const lateNightResponses = [
  'The all-nighter crew is ASSEMBLED',
  'It\'s giving dedication honestly',
  'We do not sleep, we grind \u{1F4AA}',
  'Night owl energy \u{1F989}',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function matchesAny(msg, keywords) {
  return keywords.some(k => msg.includes(k))
}

export function getResponse(message, userName) {
  const msg = message.toLowerCase()
  const name = userName ? ` ${userName}` : ''
  const hour = new Date().getHours()
  const isLateNight = hour >= 23 || hour < 5

  // Greetings
  if (matchesAny(msg, ['hi', 'hey', 'hello', 'sup', 'yo', 'what\'s up', 'wassup', 'howdy', 'hola'])) {
    if (userName) {
      const base = pick(greetings)
      return Math.random() > 0.5 ? `${base.replace('!', `,${name}!`)}` : base
    }
    return pick(greetings)
  }

  // Tired / sleepy
  if (matchesAny(msg, ['tired', 'sleepy', 'exhausted', 'sleep', 'nap', 'can\'t focus', 'burnt out', 'burnout', 'drained'])) {
    return pick(tiredResponses)
  }

  // Study / work related
  if (matchesAny(msg, ['study', 'exam', 'test', 'homework', 'assignment', 'finals', 'midterm', 'work', 'essay', 'paper', 'project', 'deadline', 'grind', 'focus', 'productive'])) {
    return pick(studyResponses)
  }

  // Food / drink
  if (matchesAny(msg, ['hungry', 'food', 'eat', 'snack', 'coffee', 'tea', 'drink', 'latte', 'matcha'])) {
    return pick(foodResponses)
  }

  // Funny / lol
  if (matchesAny(msg, ['lol', 'lmao', 'haha', 'funny', 'joke', 'bruh', 'dead', 'crying'])) {
    return pick(funnyResponses)
  }

  // Late night special
  if (isLateNight && Math.random() > 0.6) {
    return pick(lateNightResponses)
  }

  // Affection
  if (matchesAny(msg, ['love', 'best', 'friend', 'cute', 'thanks', 'thank', 'appreciate'])) {
    const affection = [
      `You're the best${name} \u{1F49C}`,
      'No u \u{1F62D}\u{1F49C}',
      'Stoppp I\'m blushing',
      'We\'re literally the best duo',
      `I'm glad you're here${name}!`,
    ]
    return pick(affection)
  }

  // Sad / lonely
  if (matchesAny(msg, ['sad', 'lonely', 'alone', 'miss', 'depressed', 'bad day', 'rough'])) {
    const comforting = [
      'Hey, I\'m right here with you \u{1F49B}',
      `You're not alone${name}, I gotchu`,
      'Bad days don\'t last forever, I promise',
      'Want to just chill together for a bit?',
      'I\'m not going anywhere \u{1F60A}',
    ]
    return pick(comforting)
  }

  return pick(generalResponses)
}
