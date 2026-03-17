export default function Mochi({ activity, bubble, isTalking, isThinking }) {
  const posMap = {
    window: 'at-window',
    plant: 'at-plant',
    couch: 'at-couch',
    counter: 'at-counter',
    floor: 'at-floor',
  }
  const positionClass = (isTalking || isThinking) ? '' : (posMap[activity.position] || '')

  const eyeState = isTalking
    ? 'eyes-happy'
    : isThinking
    ? 'eyes-focused'
    : activity.id === 'studying' || activity.id === 'writing' || activity.id === 'reading' || activity.id === 'typing'
    ? 'eyes-focused'
    : activity.id === 'napping'
    ? 'eyes-closed'
    : activity.eyes === 'closed'
    ? 'eyes-closed'
    : activity.eyes === 'happy'
    ? 'eyes-happy'
    : activity.eyes === 'focused'
    ? 'eyes-focused'
    : ''

  const idle = !isTalking && !isThinking
  const isStretching = activity.id === 'stretching' && idle
  const isVibing = activity.id === 'vibing' && idle
  const isWaving = activity.id === 'waving' || isTalking
  const isWriting = activity.id === 'writing' && idle
  const isDrinking = activity.id === 'coffee' && idle
  const isWatering = activity.id === 'watering' && idle
  const isReading = activity.id === 'reading' && idle
  const isTyping = activity.id === 'typing' && idle
  const isBrewing = activity.id === 'brewing' && idle
  const isNapping = activity.id === 'napping' && idle
  const isSnacking = activity.id === 'snacking' && idle
  const isStudying = activity.id === 'studying' && idle

  const mochiClass = [
    'mochi',
    isStretching && 'stretching',
    isVibing && 'vibing',
    isThinking && 'thinking',
    isNapping && 'napping',
    isReading && 'reading',
    isTyping && 'typing',
    isBrewing && 'brewing',
    isSnacking && 'snacking',
    isStudying && 'studying-anim',
  ].filter(Boolean).join(' ')

  return (
    <div className={`mochi-wrapper ${positionClass}`}>
      {/* Warm glow under Mochi */}
      <div className="mochi-ground-glow" />

      {/* Status text */}
      <div className="mochi-status">
        {isThinking ? '🤔 Thinking...' : isTalking ? '💬 Chatting...' : activity.label}
      </div>

      {/* Nap zzz */}
      {isNapping && (
        <div className="mochi-zzz">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </div>
      )}

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
      <div className={mochiClass}>
        {/* Beanie */}
        <div className="mochi-beanie">
          <div className="mochi-beanie-pom" />
          <div className="mochi-beanie-fold" />
        </div>

        {/* Body */}
        <div className="mochi-body" />

        {/* Face */}
        <div className={`mochi-face ${eyeState}${isTalking ? ' mouth-open' : ''}${isSnacking ? ' mouth-munch' : ''}`}>
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

        {/* Book for reading/studying */}
        {(isReading || isStudying) && (
          <div className="mochi-book">
            <div className="mochi-book-spine" />
            <div className="mochi-book-pages" />
          </div>
        )}

        {/* Laptop for typing */}
        {isTyping && (
          <div className="mochi-laptop">
            <div className="mochi-laptop-screen" />
            <div className="mochi-laptop-base" />
          </div>
        )}

        {/* Coffee brewing - pour over */}
        {isBrewing && (
          <div className="mochi-pour-over">
            <div className="pour-over-top" />
            <div className="pour-over-base" />
            <div className="pour-over-steam">
              <div className="steam-line" />
              <div className="steam-line" />
            </div>
          </div>
        )}

        {/* Snacking - cookie */}
        {isSnacking && (
          <div className="mochi-cookie" />
        )}
      </div>
    </div>
  )
}
