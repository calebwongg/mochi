import { useMemo, useState, useEffect } from 'react'

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

export default function Window() {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay)

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000)
    return () => clearInterval(interval)
  }, [])

  const isNight = timeOfDay === 'night' || timeOfDay === 'evening'

  // More raindrops, varied sizesdsadsadsadsadsa
  const raindrops = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${6 + Math.random() * 18}px`,
      duration: `${0.3 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 2.5}s`,
      thick: i % 5 === 0,
    }))
  }, [])

  // Sliding drops on glassfadasdasdasdasdadsadadsaddasdadsdasdsadsad
  const slidingDrops = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      height: `${3 + Math.random() * 6}px`,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }))
  }, [])

  const stars = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${3 + Math.random() * 94}%`,
      top: `${3 + Math.random() * 45}%`,
      delay: `${Math.random() * 3}s`,
      size: `${1 + Math.random() * 1.5}px`,
    }))
  }, [])

  return (
    <div className="window">
      {/* Night sky */}
      {isNight && (
        <div className="night-sky">
          <div className="horizon-glow" />
          {stars.map(s => (
            <div
              key={s.id}
              className="star"
              style={{
                left: s.left,
                top: s.top,
                animationDelay: s.delay,
                width: s.size,
                height: s.size,
              }}
            />
          ))}
          <div className="moon" />
        </div>
      )}

      {/* Day sky */}
      {!isNight && (
        <div className="day-sky">
          <div className="sun" />
          <div className="cloud cloud-1" />
        </div>
      )}

      {/* Rain */}
      {isNight && (
        <div className="rain-container">
          {raindrops.map(drop => (
            <div
              key={drop.id}
              className={`raindrop${drop.thick ? ' raindrop-thick' : ''}`}
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
          {slidingDrops.map(drop => (
            <div
              key={`slide-${drop.id}`}
              className="raindrop-sliding"
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning flash */}
      {isNight && <div className="lightning-flash" />}

      {/* Condensation */}
      <div className="window-condensation" />

      {/* Frame */}
      <div className="window-frame-h" />
      <div className="window-frame-v" />

      {/* Sill with candle and puddle */}
      <div className="window-sill">
        <div className="sill-puddle" />
      </div>
      <div className="sill-candle">
        <div className="candle-glow" />
        <div className="candle-flame" />
        <div className="candle-body" />
      </div>
    </div>
  )
}
