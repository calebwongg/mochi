import { useState } from 'react'

export default function ChatArea({ onSend }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = input.trim()
    if (!message) return
    onSend(message)
    setInput('')
  }

  return (
    <div className="chat-area">
      <form className="chat-container" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          placeholder="Say something to Mochi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={200}
        />
        <button className="chat-send" type="submit" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  )
}
