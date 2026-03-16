import { useState, useEffect } from 'react'

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
  focusMode,
  onFocusToggle,
  pomodoroActive,
  pomodoroTime,
  pomodoroPhase,
  onPomodoroToggle,
  onPomodoroReset,
}) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = now.getTime() - sessionStart

  return (
    <div className="overlay-ui">
      <div className="overlay-left">
        <div className="time-display">{formatTime(now)}</div>
        <div className="session-timer">Session: {formatSession(elapsed)}</div>
        <div className="controls-bar">
          <button
            className={`control-btn${focusMode ? ' active' : ''}`}
            onClick={onFocusToggle}
          >
            {focusMode ? '\u2728 Focus' : '\u{1F440} Focus'}
          </button>
          <button
            className={`control-btn${pomodoroActive ? ' active' : ''}`}
            onClick={onPomodoroToggle}
          >
            {pomodoroActive ? '\u23F9 Pomo' : '\u{1F345} Pomo'}
          </button>
        </div>
        {pomodoroActive && (
          <div className="pomodoro-display">
            <div className="pomodoro-phase">
              {pomodoroPhase === 'work' ? '\u{1F4DA} Focus Time' : '\u2615 Break Time'}
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
        <div className="mood-indicator">
          {activity.label}
        </div>
      </div>
    </div>
  )
}
