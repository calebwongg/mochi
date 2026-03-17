export default function Mochi({ activity, bubble, isTalking, isThinking }) {
  const positionClass = isTalking || isThinking
    ? ''
    : activity.position === 'window'
    ? 'at-window'
    : activity.position === 'plant'
    ? 'at-plant'
    : ''

  const eyeState = isTalking
    ? 'eyes-happy'
    : isThinking
    ? 'eyes-focused'
    : activity.id === 'studying' || activity.id === 'writing'
    ? 'eyes-focused'
    : activity.eyes === 'closed'
    ? 'eyes-closed'
    : activity.eyes === 'happy'
    ? 'eyes-happy'
    : ''

  const isStretching = activity.id === 'stretching' && !isTalking && !isThinking
  const isVibing = activity.id === 'vibing' && !isTalking && !isThinking
  const isWaving = activity.id === 'waving' || isTalking
  const isWriting = activity.id === 'writing' && !isTalking && !isThinking
  const isDrinking = activity.id === 'coffee' && !isTalking && !isThinking
  const isWatering = activity.id === 'watering' && !isTalking && !isThinking

  return (
    <div className={`mochi-wrapper ${positionClass}`}>
      {/* Warm glow under Mochi */}
      <div className="mochi-ground-glow" />

      {/* Status text */}
      <div className="mochi-status">
        {isThinking ? '🤔 Thinking...' : isTalking ? '💬 Chatting...' : activity.label}
      </div>

      {/* Speech bubble or typing indicator */}
      {isThinking && (
        <div className="mochi-bubble mochi-typing-bubble">
          <div className="typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {bubble && !isThinking && <div className="mochi-bubble">{bubble}</div>}

      {/* Mochi character */}
      <div
        className={`mochi${isStretching ? ' stretching' : ''}${isVibing ? ' vibing' : ''}${isThinking ? ' thinking' : ''}`}
      >
        {/* Beanie */}
        <div className="mochi-beanie">
          <div className="mochi-beanie-pom" />
          <div className="mochi-beanie-fold" />
        </div>

        {/* Body */}
        <div className="mochi-body" />

        {/* Face */}
        <div className={`mochi-face ${eyeState}${isTalking ? ' mouth-open' : ''}`}>
          <div className="mochi-eye mochi-eye-left" />
          <div className="mochi-eye mochi-eye-right" />
          <div className="mochi-blush-l" />
          <div className="mochi-blush-r" />
          <div className="mochi-mouth" />
        </div>

        {/* Arms */}
        <div className="mochi-arm mochi-arm-left" />
        <div className={`mochi-arm mochi-arm-right${isWaving ? ' waving' : ''}`} />

        {/* Activity props */}
        {isWriting && <div className="mochi-pencil" />}
        {isDrinking && (
          <div className="mochi-cup">
            <span />
          </div>
        )}
        {isWatering && (
          <div className="mochi-watering-can">
            <div className="watering-spout" />
            <div className="water-drops">
              <div className="water-drop" />
              <div className="water-drop" />
              <div className="water-drop" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
