import { useState } from 'react'

export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="name-prompt-overlay">
      <div className="name-prompt-card">
        <h2>Welcome to the Caf&eacute;!</h2>
        <p>Mochi would love to know your name</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <br />
          <button type="submit">Let's hang out</button>
        </form>
      </div>
    </div>
  )
}
