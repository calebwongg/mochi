import { useState, useEffect, useCallback, useRef } from 'react'
import CafeScene from './components/CafeScene'
import Mochi from './components/Mochi'
import ChatArea from './components/ChatArea'
import OverlayUI from './components/OverlayUI'
import NamePrompt from './components/NamePrompt'
import { getResponse } from './utils/responses'
import './App.css'

const ACTIVITIES = [
  { id: 'studying', label: '\u{1F4D6} Studying...', position: 'table', eyes: 'normal', duration: [30, 60] },
  { id: 'coffee', label: '\u2615 Coffee break!', position: 'table', eyes: 'happy', duration: [20, 40] },
  { id: 'writing', label: '\u270F\uFE0F Writing notes...', position: 'table', eyes: 'normal', duration: [25, 50] },
  { id: 'stretching', label: '\u{1F64B} Stretching!', position: 'table', eyes: 'closed', duration: [10, 20] },
  { id: 'window', label: '\u{1F319} Gazing outside...', position: 'window', eyes: 'normal', duration: [20, 40] },
  { id: 'watering', label: '\u{1F331} Watering plants...', position: 'plant', eyes: 'happy', duration: [15, 30] },
  { id: 'vibing', label: '\u{1F3B5} Vibing...', position: 'table', eyes: 'closed', duration: [25, 45] },
  { id: 'waving', label: '\u{1F44B} Hey there!', position: 'table', eyes: 'happy', duration: [8, 15] },
]

function getRandomActivity(current) {
  const filtered = ACTIVITIES.filter(a => a.id !== current)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

function getRandomDuration(range) {
  return (range[0] + Math.random() * (range[1] - range[0])) * 1000
}

export default function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('mochi-user-name') || '')
  const [showNamePrompt, setShowNamePrompt] = useState(() => !localStorage.getItem('mochi-user-name'))
  const [activity, setActivity] = useState(ACTIVITIES[0])
  const [mochiBubble, setMochiBubble] = useState('')
  const [userBubble, setUserBubble] = useState('')
  const [isTalking, setIsTalking] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroPhase, setPomodoroPhase] = useState('work')
  const [sessionStart] = useState(() => Date.now())
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const activityTimer = useRef(null)
  const talkTimer = useRef(null)

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
    if (isTalking) return
    const next = getRandomActivity(activity.id)
    setActivity(next)
    activityTimer.current = setTimeout(cycleActivity, getRandomDuration(next.duration))
  }, [activity.id, isTalking])

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
            setMochiBubble('Break time! You earned it! \u{1F389}')
            setTimeout(() => setMochiBubble(''), 5000)
          } else {
            setMochiBubble("Back to work, let's go! \u{1F4AA}")
            setTimeout(() => setMochiBubble(''), 5000)
          }
          return nextTime
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [pomodoroActive, pomodoroPhase])

  const handleNameSubmit = (name) => {
    setUserName(name)
    localStorage.setItem('mochi-user-name', name)
    setShowNamePrompt(false)
    setMochiBubble(`Hey ${name}! Welcome to the caf\u00e9! \u{1F60A}`)
    setTimeout(() => setMochiBubble(''), 4000)
  }

  const handleChat = (message) => {
    setUserBubble(message)
    setIsTalking(true)
    clearTimeout(activityTimer.current)

    setTimeout(() => {
      const response = getResponse(message, userName)
      setMochiBubble(response)
    }, 800)

    clearTimeout(talkTimer.current)
    talkTimer.current = setTimeout(() => {
      setUserBubble('')
      setMochiBubble('')
      setIsTalking(false)
      const next = getRandomActivity(activity.id)
      setActivity(next)
      activityTimer.current = setTimeout(cycleActivity, getRandomDuration(next.duration))
    }, 5000)
  }

  const handlePomodoroToggle = () => {
    if (pomodoroActive) {
      setPomodoroActive(false)
      setPomodoroTime(25 * 60)
      setPomodoroPhase('work')
    } else {
      setPomodoroActive(true)
      setPomodoroTime(25 * 60)
      setPomodoroPhase('work')
      setMochiBubble("Pomodoro started! Let's lock in \u{1F525}")
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

  return (
    <div className={`app${focusMode ? ' focus-mode' : ''}`}>
      {showNamePrompt && <NamePrompt onSubmit={handleNameSubmit} />}

      <div className="cafe-scene">
        <CafeScene
          bgTransform={bgTransform}
          midTransform={midTransform}
          fgTransform={fgTransform}
        />
        <Mochi
          activity={activity}
          bubble={mochiBubble}
          isTalking={isTalking}
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
      />

      <ChatArea onSend={handleChat} />

      <div className="vignette" />
      <div className="grain" />
      <div className="warm-overlay" />
    </div>
  )
}
