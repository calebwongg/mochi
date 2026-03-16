import { useMemo } from 'react'
import Window from './Window'

const BOOK_COLORS = [
  '#6b2a2a', '#2a4a30', '#2a3050', '#5c3a21', '#c8b89a',
  '#8b3a50', '#4a5a30', '#8b4a2a', '#3a2a4a', '#6a4a2a',
  '#4a3040', '#2a3a2a', '#5a4a3a', '#3a2a1a',
]

function BookShelf({ books, style }) {
  return (
    <div className="books" style={style}>
      {books.map((b, i) => (
        <div
          key={i}
          className={`book${b.tilted ? ' book-tilted' : ''}`}
          style={{
            height: `${b.h}px`,
            background: b.color,
            width: `${b.w}%`,
          }}
        />
      ))}
    </div>
  )
}

function Plant({ className }) {
  return (
    <div className={`plant ${className}`}>
      <div className="plant-leaves">
        <div className="leaf" />
        <div className="leaf" />
        <div className="leaf" />
        <div className="leaf" />
        <div className="leaf" />
      </div>
      <div className="plant-pot">
        <div className="plant-pot-rim" />
      </div>
    </div>
  )
}

function TablePlant({ style }) {
  return (
    <div className="table-plant" style={style}>
      <div className="plant-leaves">
        <div className="leaf" />
        <div className="leaf" />
        <div className="leaf" />
      </div>
      <div className="plant-pot">
        <div className="plant-pot-rim" />
      </div>
    </div>
  )
}

function HangingLamp({ className }) {
  return (
    <div className={`hanging-lamp ${className}`}>
      <div className="lamp-wire" />
      <div className="lamp-shade">
        <div className="lamp-shade-inner" />
        <div className="lamp-bulb" />
      </div>
      <div className="lamp-light-cone" />
    </div>
  )
}

function WallSconce({ className }) {
  return (
    <div className={`wall-sconce ${className}`}>
      <div className="sconce-wall-glow" />
      <div className="sconce-bracket" />
      <div className="sconce-light" />
    </div>
  )
}

function SleepingCat() {
  return (
    <div className="sleeping-cat">
      <div className="cat-body">
        <div className="cat-head">
          <div className="cat-ear-l">
            <div className="cat-ear-inner" />
          </div>
          <div className="cat-ear-r">
            <div className="cat-ear-inner" />
          </div>
        </div>
        <div className="cat-tail" />
      </div>
      <div className="cat-zzz">z</div>
    </div>
  )
}

function Candle({ style }) {
  return (
    <div className="table-candle" style={style}>
      <div className="candle-glow" />
      <div className="candle-flame" />
      <div className="candle-body" />
    </div>
  )
}

function CounterBar() {
  return (
    <div className="counter-bar">
      <div className="counter-top" />
      <div className="counter-front" />
      <div className="counter-underglow" />

      {/* Coffee machine */}
      <div className="coffee-machine">
        <div className="coffee-machine-top" />
        <div className="coffee-machine-body">
          <div className="coffee-machine-gauge" />
        </div>
      </div>

      {/* Coffee grinder */}
      <div className="coffee-grinder">
        <div className="grinder-hopper" />
        <div className="grinder-body" />
      </div>

      {/* Jars */}
      <div className="counter-jar" style={{ left: '42%' }}>
        <div className="jar-lid" />
        <div className="jar-body">
          <div className="jar-contents" style={{ height: '60%', background: '#4a3020' }} />
        </div>
      </div>
      <div className="counter-jar" style={{ left: '52%' }}>
        <div className="jar-lid" />
        <div className="jar-body">
          <div className="jar-contents" style={{ height: '70%', background: '#d4a060' }} />
        </div>
      </div>

      {/* Cash register */}
      <div className="cash-register">
        <div className="register-screen" />
        <div className="register-body" />
      </div>

      {/* Tip jar */}
      <div className="tip-jar">
        <div className="tip-jar-body">
          <div className="tip-jar-label">TIPS</div>
        </div>
      </div>

      {/* Cups with steam */}
      <div className="counter-cup" style={{ left: '62%' }}>
        <div className="counter-cup-body" />
        <div className="counter-cup-steam">
          <div className="steam-line" />
          <div className="steam-line" />
          <div className="steam-line" />
        </div>
      </div>
      <div className="counter-cup" style={{ left: '72%' }}>
        <div className="counter-cup-body" />
        <div className="counter-cup-steam">
          <div className="steam-line" />
          <div className="steam-line" />
          <div className="steam-line" />
        </div>
      </div>
    </div>
  )
}

function WallClock() {
  const now = new Date()
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const hourDeg = hours * 30 + minutes * 0.5
  const minDeg = minutes * 6
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30)

  return (
    <div className="wall-clock">
      {ticks.map(deg => (
        <div
          key={deg}
          className="clock-tick"
          style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
        />
      ))}
      <div className="clock-hand clock-hour" style={{ '--hour-deg': `${hourDeg}deg` }} />
      <div className="clock-hand clock-minute" style={{ '--min-deg': `${minDeg}deg` }} />
      <div className="clock-center" />
    </div>
  )
}

function FairyLights() {
  const bulbs = useMemo(() => {
    const colors = ['#f5d89a', '#ffe4a1', '#ffd080', '#ffb860', '#f5d89a']
    return Array.from({ length: 8 }, (_, i) => ({
      left: `${5 + i * 13}%`,
      color: colors[i % colors.length],
      delay: `${i * 0.3}s`,
    }))
  }, [])

  return (
    <div className="fairy-lights">
      <div className="fairy-wire" />
      {bulbs.map((b, i) => (
        <div
          key={i}
          className="fairy-bulb"
          style={{
            left: b.left,
            background: b.color,
            boxShadow: `0 0 4px ${b.color}, 0 0 8px ${b.color}40`,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function CafeScene({ bgTransform, midTransform, fgTransform }) {
  const shelfBooks = useMemo(() => {
    return [1, 2, 3].map(() =>
      Array.from({ length: 8 + Math.floor(Math.random() * 5) }, (_, idx) => ({
        h: 12 + Math.floor(Math.random() * 14),
        w: 6 + Math.floor(Math.random() * 5),
        color: BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)],
        tilted: idx === 3 || idx === 7,
      }))
    )
  }, [])

  return (
    <>
      {/* === BACKGROUND LAYER === */}
      <div className="parallax-bg" style={{ transform: bgTransform }}>
        {/* Walls & Floor */}
        <div className="cafe-back-wall" />
        <div className="cafe-wainscoting">
          <div className="wainscoting-panels" />
        </div>
        <div className="cafe-floor">
          <div className="floor-boards" />
          <div className="floor-light floor-light-1" />
          <div className="floor-light floor-light-2" />
          <div className="floor-light floor-light-3" />
        </div>

        {/* Ceiling beams */}
        <div className="ceiling-beam beam-1" />
        <div className="ceiling-beam beam-2" />
        <div className="ceiling-beam beam-3" />

        {/* Wall frames */}
        <div className="wall-frame wall-frame-1">
          <div className="wall-frame-inner" />
        </div>
        <div className="wall-frame wall-frame-2">
          <div className="wall-frame-inner" />
        </div>

        {/* Window + curtains */}
        <Window />
        <div className="window-ambient" />
        <div className="curtain-left" />
        <div className="curtain-right" />
        <div className="curtain-rod" />

        {/* Bookshelf */}
        <div className="bookshelf">
          <div className="shelf shelf-1" />
          <BookShelf books={shelfBooks[0]} style={{ bottom: 'calc(24% + 6px)', left: '3px', right: '3px', position: 'absolute', display: 'flex', alignItems: 'flex-end', gap: '1px' }} />
          <div className="shelf shelf-2" />
          <BookShelf books={shelfBooks[1]} style={{ bottom: 'calc(49% + 6px)', left: '3px', right: '3px', position: 'absolute', display: 'flex', alignItems: 'flex-end', gap: '1px' }} />
          <div className="shelf shelf-3" />
          <BookShelf books={shelfBooks[2]} style={{ bottom: 'calc(74% + 6px)', left: '3px', right: '3px', position: 'absolute', display: 'flex', alignItems: 'flex-end', gap: '1px' }} />
        </div>

        {/* Chalkboard */}
        <div className="chalkboard">
          <div className="chalkboard-title">TODAY'S BREW</div>
          <div className="chalkboard-item">House Blend ... 4.50</div>
          <div className="chalkboard-item">Mocha ............ 5.00</div>
          <div className="chalkboard-item">Matcha Latte .. 5.50</div>
          <div className="chalkboard-item">Pastry ............ 3.00</div>
        </div>

        {/* Wall Clock */}
        <WallClock />

        {/* Wall sconces */}
        <WallSconce className="sconce-1" />
        <WallSconce className="sconce-2" />

        {/* Back shelf bottles */}
        <div className="counter-back-shelf" />
        <div className="bottle bottle-1" />
        <div className="bottle bottle-2" />
        <div className="bottle bottle-3" />
      </div>

      {/* === MID LAYER === */}
      <div className="parallax-mid" style={{ transform: midTransform }}>
        {/* Lamps */}
        <HangingLamp className="lamp-1" />
        <HangingLamp className="lamp-2" />
        <HangingLamp className="lamp-3" />

        {/* Fairy lights */}
        <FairyLights />

        {/* Hanging plant */}
        <div className="hanging-plant">
          <div className="hanging-plant-rope" />
          <div className="hanging-plant-pot">
            <div className="trailing-vine trailing-vine-1">
              <div className="vine-leaf" style={{ top: '8px', left: '-3px' }} />
              <div className="vine-leaf" style={{ top: '16px', left: '1px' }} />
            </div>
            <div className="trailing-vine trailing-vine-2">
              <div className="vine-leaf" style={{ top: '6px', right: '-3px' }} />
            </div>
          </div>
        </div>

        {/* Counter */}
        <CounterBar />

        {/* Couch */}
        <div className="couch">
          <div className="couch-back" />
          <div className="couch-arm-left" />
          <div className="couch-arm-right" />
          <div className="couch-seat" />
          <div className="couch-cushion" />
          <div className="couch-cushion-2" />
          <div className="couch-legs">
            <div className="couch-leg" />
            <div className="couch-leg" />
            <div className="couch-leg" />
          </div>
        </div>

        {/* Rug */}
        <div className="rug">
          <div className="rug-pattern">
            <div className="rug-pattern-inner" />
          </div>
        </div>

        {/* Tables with candles and plants */}
        <div className="cafe-table table-1">
          <Candle style={{ left: '25px' }} />
          <div className="table-top" />
          <div className="table-leg" />
        </div>
        <div className="cafe-table table-2">
          <Candle style={{ left: '30px' }} />
          <TablePlant style={{ position: 'absolute', top: '-28px', left: '5px' }} />
          <div className="table-top" />
          <div className="table-leg" />
        </div>

        {/* Mochi's table */}
        <div className="mochi-table">
          <div className="table-items">
            <div className="table-book" />
            <div className="table-coffee" />
            <div className="table-notebook" />
          </div>
          <div className="table-coffee-steam">
            <div className="steam-line" />
            <div className="steam-line" />
          </div>
          <div className="table-top" />
          <div className="table-leg" />
        </div>

        {/* User's laptop and papers */}
        <div className="user-laptop">
          <div className="laptop-glow" />
          <div className="laptop-screen" />
          <div className="laptop-base" />
        </div>
        <div className="user-papers">
          <div className="paper paper-1" />
          <div className="paper paper-2" />
        </div>

        {/* Plants */}
        <Plant className="plant-1" />
        <Plant className="plant-2" />
        <Plant className="plant-3" />
        <Plant className="plant-4" />

        {/* Sleeping Cat */}
        <SleepingCat />
      </div>

      {/* === FOREGROUND DEPTH === */}
      <div className="parallax-fg" style={{ transform: fgTransform }}>
        <div className="fg-shadow-left" />
        <div className="fg-shadow-right" />
      </div>
    </>
  )
}
