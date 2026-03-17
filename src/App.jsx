import { useState, useEffect, useCallback, useRef } from 'react'
import CafeScene from './components/CafeScene'
import Mochi from './components/Mochi'
import ChatArea from './components/ChatArea'
import ChatHistory from './components/ChatHistory'
import OverlayUI from './components/OverlayUI'
import LoginScreen from './components/LoginScreen'
import { useAuth } from './hooks/useAuth'
import { useFirestore } from './hooks/useFirestore'
import { checkMilestones, getMilestoneUpdates } from './hooks/useMilestones'
import { sendMessage, summarizeConversation } from './services/groq'
import './App.css'

const ACTIVITIES = [
  { id: 'studying', label: '📖 Studying...', position: 'table', eyes: 'normal', duration: [30, 60] },
  { id: 'coffee', label: '☕ Coffee break!', position: 'table', eyes: 'happy', duration: [20, 40] },
  { id: 'writing', label: '✏️ Writing notes...', position: 'table', eyes: 'normal', duration: [25, 50] },
  { id: 'stretching', label: '🙋 Stretching!', position: 'table', eyes: 'closed', duration: [10, 20] },
  { id: 'window', label: '🌙 Gazing outside...', position: 'window', eyes: 'normal', duration: [20, 40] },
  { id: 'watering', label: '🌱 Watering plants...', position: 'plant', eyes: 'happy', duration: [15, 30] },
  { id: 'vibing', label: '🎵 Vibing...', position: 'table', eyes: 'closed', duration: [25, 45] },
  { id: 'waving', label: '👋 Hey there!', position: 'table', eyes: 'happy', duration: [8, 15] },
]

function getRandomActivity(current) {
  const filtered = ACTIVITIES.filter(a => a.id !== current)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

function getRandomDuration(range) {
  return (range[0] + Math.random() * (range[1] - range[0])) * 1000
}

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth()
  const [isGuest, setIsGuest] = useState(false)
  const firestore = useFirestore(isGuest ? null : user)

  // User & Mochi persistent state
  const [userData, setUserData] = useState(null)
  const [mochiState, setMochiState] = useState(null)
  const [conversationSummary, setConversationSummary] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  // Chat state
  const [messages, setMessages] = useState([])
  const [mochiBubble, setMochiBubble] = useState('')
  const [userBubble, setUserBubble] = useState('')
  const [isTalking, setIsTalking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false)

  // Activity state
  const [activity, setActivity] = useState(ACTIVITIES[0])
  const activityTimer = useRef(null)
  const bubbleTimer = useRef(null)
  const messageCountRef = useRef(0)

  // UI state
  const [focusMode, setFocusMode] = useState(false)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroPhase, setPomodoroPhase] = useState('work')
  const [sessionStart] = useState(() => Date.now())
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  // Load user data from Firestore on auth (or set defaults for guest)
  useEffect(() => {
    if (isGuest) {
      setUserData({ mochiRelationship: 0, visitCount: 1, totalSessionTime: 0 })
      setMochiState({ currentMood: 'happy', knownFacts: [], milestones: [], currentActivity: 'studying' })
      setDataLoaded(true)
      setMochiBubble("Hey there! Welcome to the cafe~ I'm Mochi! Make yourself comfy 🧡")
      setTimeout(() => setMochiBubble(''), 6000)
      return
    }

    if (!user) {
      setDataLoaded(false)
      setUserData(null)
      setMochiState(null)
      return
    }

    async function loadData() {
      try {
        const uData = await firestore.initUserDoc(user.uid, user.displayName, user.photoURL)
        const mState = await firestore.loadMochiState(user.uid)
        const lastConvo = await firestore.loadLatestConversation(user.uid)

        setUserData(uData)
        setMochiState(mState)
        setConversationSummary(lastConvo.summary || '')
        setDataLoaded(true)

        // Check milestones on load
        const milestones = checkMilestones(uData, mState)
        if (milestones.length > 0) {
          const firstWithMessage = milestones.find(m => m.message)
          if (firstWithMessage) {
            setMochiBubble(firstWithMessage.message)
            setTimeout(() => setMochiBubble(''), 6000)
          }
          await firestore.updateMochiState(
            user.uid,
            getMilestoneUpdates(milestones.map(m => m.id))
          )
        }
      } catch (err) {
        console.error('Failed to load user data:', err)
        setDataLoaded(true)
      }
    }

    loadData()
  }, [user, isGuest]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scene scaling for large monitors (designed for ~1366px)
  const [sceneScale, setSceneScale] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1366
    return Math.max(1, Math.min(1.3, 1 + (w - 1366) * 0.00022))
  })

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth
      setSceneScale(Math.max(1, Math.min(1.3, 1 + (w - 1366) * 0.00022)))
    }
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const x = ((e.clientX - cx) / cx) * 6
      const y = ((e.clientY - cy) / cy) * 4
      setMouseOffset({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Cycle activities
  const cycleActivity = useCallback(() => {
    if (isTalking || isThinking) return
    const next = getRandomActivity(activity.id)
    setActivity(next)
    activityTimer.current = setTimeout(cycleActivity, getRandomDuration(next.duration))
  }, [activity.id, isTalking, isThinking])

  useEffect(() => {
    activityTimer.current = setTimeout(cycleActivity, getRandomDuration(activity.duration))
    return () => clearTimeout(activityTimer.current)
  }, [cycleActivity])

  // Pomodoro timer
  useEffect(() => {
    if (!pomodoroActive) return
    const interval = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          const nextPhase = pomodoroPhase === 'work' ? 'break' : 'work'
          const nextTime = nextPhase === 'work' ? 25 * 60 : 5 * 60
          setPomodoroPhase(nextPhase)
          if (nextPhase === 'break') {
            setMochiBubble('Break time! You earned it! 🎉')
            setTimeout(() => setMochiBubble(''), 5000)
          } else {
            setMochiBubble("Back to work, let's go! 💪")
            setTimeout(() => setMochiBubble(''), 5000)
          }
          return nextTime
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [pomodoroActive, pomodoroPhase])

  // Handle chat with Groq AI
  const handleChat = async (message) => {
    if (cooldown || isThinking) return

    // Show user bubble
    setUserBubble(message)
    setIsTalking(true)
    setIsThinking(true)
    clearTimeout(activityTimer.current)
    clearTimeout(bubbleTimer.current)

    // Start cooldown
    setCooldown(true)
    setTimeout(() => setCooldown(false), 2000)

    // Add user message to history
    const userMsg = { role: 'user', content: message, timestamp: Date.now() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    messageCountRef.current += 1

    // Build context for Groq
    const now = new Date()
    const context = {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      relationshipLevel: userData?.mochiRelationship || 0,
      knownFacts: mochiState?.knownFacts || [],
      conversationSummary,
    }

    try {
      const response = await sendMessage(message, updatedMessages, context)

      setIsThinking(false)
      setMochiBubble(response)

      // Add Mochi's response to history
      const mochiMsg = { role: 'mochi', content: response, timestamp: Date.now() }
      const allMessages = [...updatedMessages, mochiMsg]
      setMessages(allMessages)
      messageCountRef.current += 1

      // Increment relationship for conversation (+2)
      if (user && userData) {
        const newRelLevel = Math.min(100, (userData.mochiRelationship || 0) + 2)
        firestore.updateUserStats(user.uid, { mochiRelationship: newRelLevel }).catch(() => {})
        setUserData(prev => prev ? { ...prev, mochiRelationship: newRelLevel } : prev)
      }

      // Save conversation to Firestore periodically
      if (user && messageCountRef.current % 10 === 0) {
        // Background summarization
        summarizeConversation(allMessages).then(async (result) => {
          if (result) {
            setConversationSummary(result.summary)
            await firestore.saveConversation(user.uid, allMessages, result.summary)
            // Update known facts
            if (result.facts && result.facts.length > 0) {
              const existingFacts = mochiState?.knownFacts || []
              const newFacts = [...new Set([...existingFacts, ...result.facts])]
              await firestore.updateMochiState(user.uid, { knownFacts: newFacts })
              setMochiState(prev => prev ? { ...prev, knownFacts: newFacts } : prev)
            }
          }
        }).catch(() => {})
      }

      // Clear bubbles after delay
      bubbleTimer.current = setTimeout(() => {
        setUserBubble('')
        setMochiBubble('')
        setIsTalking(false)
        const next = getRandomActivity(activity.id)
        setActivity(next)
        activityTimer.current = setTimeout(cycleActivity, getRandomDuration(next.duration))
      }, 6000)

    } catch (err) {
      console.error('Chat error:', err)
      setIsThinking(false)
      setMochiBubble("hmm my brain's a little foggy rn... try again? 😅")
      bubbleTimer.current = setTimeout(() => {
        setUserBubble('')
        setMochiBubble('')
        setIsTalking(false)
      }, 4000)
    }
  }

  // Save conversation on unmount
  useEffect(() => {
    return () => {
      if (user && messages.length > 0) {
        firestore.saveConversation(user.uid, messages, conversationSummary).catch(() => {})
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePomodoroToggle = () => {
    if (pomodoroActive) {
      setPomodoroActive(false)
      setPomodoroTime(25 * 60)
      setPomodoroPhase('work')
    } else {
      setPomodoroActive(true)
      setPomodoroTime(25 * 60)
      setPomodoroPhase('work')
      setMochiBubble("Pomodoro started! Let's lock in 🔥")
      setTimeout(() => setMochiBubble(''), 3000)
    }
  }

  const handlePomodoroReset = () => {
    setPomodoroTime(pomodoroPhase === 'work' ? 25 * 60 : 5 * 60)
  }

  // Parallax transform values
  const bgTransform = `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`
  const midTransform = `translate(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px)`
  const fgTransform = `translate(${mouseOffset.x * 1}px, ${mouseOffset.y * 1}px)`

  // Auth loading state
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Brewing coffee...</div>
      </div>
    )
  }

  // Not signed in and not guest — show login
  if (!user && !isGuest) {
    return (
      <LoginScreen
        onSignIn={signInWithGoogle}
        onGuest={() => setIsGuest(true)}
        loading={false}
      />
    )
  }

  return (
    <div className={`app${focusMode ? ' focus-mode' : ''}`}>
      <div className="cafe-scene">
        <div className="scene-scale-wrapper" style={{ transform: `scale(${sceneScale})` }}>
          <CafeScene
            bgTransform={bgTransform}
            midTransform={midTransform}
            fgTransform={fgTransform}
          />
          <Mochi
            activity={activity}
            bubble={mochiBubble}
            isTalking={isTalking}
            isThinking={isThinking}
          />
          {/* Your seat & bubble */}
          <div className="your-seat" style={{ transform: midTransform }}>
            <div className="chair-back" />
            <div className="chair-seat" />
            <div className="chair-legs">
              <div className="chair-leg-el" />
              <div className="chair-leg-el" />
            </div>
            {userBubble && <div className="your-bubble">{userBubble}</div>}
          </div>
        </div>
      </div>

      <OverlayUI
        sessionStart={sessionStart}
        activity={activity}
        focusMode={focusMode}
        onFocusToggle={() => setFocusMode(!focusMode)}
        pomodoroActive={pomodoroActive}
        pomodoroTime={pomodoroTime}
        pomodoroPhase={pomodoroPhase}
        onPomodoroToggle={handlePomodoroToggle}
        onPomodoroReset={handlePomodoroReset}
        userName={isGuest ? 'Guest' : user?.displayName}
        onLogout={isGuest ? () => setIsGuest(false) : logout}
      />

      <ChatArea
        onSend={handleChat}
        disabled={cooldown || isThinking}
        onHistoryToggle={() => setChatHistoryOpen(!chatHistoryOpen)}
      />

      <ChatHistory
        messages={messages}
        isOpen={chatHistoryOpen}
        onClose={() => setChatHistoryOpen(false)}
      />

      <div className="vignette" />
      <div className="grain" />
      <div className="warm-overlay" />
    </div>
  )
}
