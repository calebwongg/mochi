import { useState, useEffect, useRef } from 'react'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatSession(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatPomodoro(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function OverlayUI({
  sessionStart,
  activity,
  activities,
  onActivityChange,
  focusMode,
  onFocusToggle,
  pomodoroActive,
  pomodoroTime,
  pomodoroPhase,
  onPomodoroToggle,
  onPomodoroReset,
  userName,
  onLogout,
}) {
  const [now, setNow] = useState(new Date())
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [pickerOpen])

  const elapsed = now.getTime() - sessionStart

  const handlePick = (act) => {
    onActivityChange(act)
    setPickerOpen(false)
  }

  return (
    <div className="overlay-ui">
      <div className="overlay-left">
        <div className="time-display">{formatTime(now)}</div>
        <div className="session-timer">Session: {formatSession(elapsed)}</div>
        {userName && <div className="user-greeting">Hey, {userName.split(' ')[0]}</div>}
        <div className="controls-bar">
          <button
            className={`control-btn${focusMode ? ' active' : ''}`}
            onClick={onFocusToggle}
          >
            {focusMode ? '✨ Focus' : '👀 Focus'}
          </button>
          <button
            className={`control-btn${pomodoroActive ? ' active' : ''}`}
            onClick={onPomodoroToggle}
          >
            {pomodoroActive ? '⏹ Pomo' : '🍅 Pomo'}
          </button>
          {onLogout && (
            <button className="control-btn logout-btn" onClick={onLogout}>
              👋 Leave
            </button>
          )}
        </div>
        {pomodoroActive && (
          <div className="pomodoro-display">
            <div className="pomodoro-phase">
              {pomodoroPhase === 'work' ? '📚 Focus Time' : '☕ Break Time'}
            </div>
            <div className="pomodoro-time">{formatPomodoro(pomodoroTime)}</div>
            <div className="pomodoro-controls">
              <button className="pomo-btn" onClick={onPomodoroReset}>Reset</button>
            </div>
          </div>
        )}
      </div>

      <div className="overlay-right">
        <div className="now-playing">
          <span className="music-note">{'\u266A'}</span>
          lo-fi beats to study to
        </div>
        <div className="activity-picker-wrapper" ref={pickerRef}>
          <button
            className={`mood-indicator activity-btn${pickerOpen ? ' active' : ''}`}
            onClick={() => setPickerOpen(!pickerOpen)}
          >
            {activity.label}
            <span className="activity-arrow">{pickerOpen ? '▲' : '▼'}</span>
          </button>
          {pickerOpen && (
            <div className="activity-picker">
              {activities.map((act) => (
                <button
                  key={act.id}
                  className={`activity-option${act.id === activity.id ? ' current' : ''}`}
                  onClick={() => handlePick(act)}
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
