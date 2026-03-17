export default function ChatHistory({ messages, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="chat-history-overlay" onClick={onClose}>
      <div className="chat-history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-history-header">
          <span className="chat-history-icon">📓</span>
          <h3>Conversation Notes</h3>
          <button className="chat-history-close" onClick={onClose}>×</button>
        </div>
        <div className="chat-history-messages">
          {messages.length === 0 ? (
            <p className="chat-history-empty">No messages yet... say hi to Mochi!</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`chat-history-msg ${msg.role}`}>
                <span className="chat-history-role">
                  {msg.role === 'mochi' ? '🍡 Mochi' : '🧑 You'}
                </span>
                <p>{msg.content}</p>
                {msg.timestamp && (
                  <span className="chat-history-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
