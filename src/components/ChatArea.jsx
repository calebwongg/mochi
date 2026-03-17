import { useState } from 'react'

export default function ChatArea({ onSend, disabled, onHistoryToggle }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = input.trim()
    if (!message || disabled) return
    onSend(message)
    setInput('')
  }

  return (
    <div className="chat-area">
      <form className="chat-container" onSubmit={handleSubmit}>
        <button
          type="button"
          className="chat-history-btn"
          onClick={onHistoryToggle}
          aria-label="View chat history"
          title="Chat history"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </button>
        <input
          className={`chat-input${disabled ? ' cooldown' : ''}`}
          type="text"
          placeholder={disabled ? 'Stuart is thinking...' : 'Say something to Stuart...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={200}
          disabled={disabled}
        />
        <button
          className="chat-send"
          type="submit"
          aria-label="Send message"
          disabled={disabled}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  )
}
