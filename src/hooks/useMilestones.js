import { arrayUnion } from 'firebase/firestore'

const MILESTONE_DEFS = [
  {
    id: 'first_visit',
    check: ({ visitCount }) => visitCount === 1,
    message: "Hey there! Welcome to the café~ I'm Mochi, your new study buddy! Make yourself comfy 🧡",
  },
  {
    id: 'regular_visitor',
    check: ({ visitCount }) => visitCount >= 3,
    message: "hey you're becoming a regular! I saved your usual spot 😊",
  },
  {
    id: 'late_night_study',
    check: () => {
      const hour = new Date().getHours()
      return hour >= 0 && hour < 5
    },
    message: "burning the midnight oil huh... I respect it but don't forget to sleep 🌙",
  },
  {
    id: '10_hours',
    check: ({ totalSessionTime }) => totalSessionTime >= 600,
    message: "you know, we've been hanging out a lot lately and honestly I really appreciate it 💛",
  },
  {
    id: '5_conversations',
    check: ({ conversationCount }) => conversationCount >= 5,
    message: null, // This one just unlocks using the user's name more
  },
  {
    id: 'returned_after_absence',
    check: ({ lastVisit }) => {
      if (!lastVisit) return false
      const lastDate = lastVisit.toDate ? lastVisit.toDate() : new Date(lastVisit)
      const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSince >= 3
    },
    message: "oh my gosh you're back!! I lowkey missed you 🥺",
  },
]

export function checkMilestones(userData, mochiState, conversationCount = 0) {
  const triggered = mochiState.milestones || []
  const results = []

  for (const milestone of MILESTONE_DEFS) {
    if (triggered.includes(milestone.id)) continue

    const shouldTrigger = milestone.check({
      ...userData,
      conversationCount,
    })

    if (shouldTrigger) {
      results.push(milestone)
    }
  }

  return results
}

export function getMilestoneUpdates(milestoneIds) {
  return {
    milestones: arrayUnion(...milestoneIds),
  }
}
