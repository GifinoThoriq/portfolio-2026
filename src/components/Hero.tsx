import { useState, useEffect } from 'react'
import AsciiVideo from './AsciiVideo'
import DecryptedText from './DecryptedText'
import './Hero.css'

const BIO =
  "I build interfaces that feel precise and alive — from pixel-perfect UIs to scalable backend APIs, without losing sight of the user at every layer."

const STACK = [
  'React', 'Angualar', 'Vuew' ,'Next.js', 'Node',
  'Express', 'Laravel', 'Figma', 'PostgreSQL', 'AI'
]

// ── DecryptedText settings ─────────────────────────────────
// Each char takes: DECRYPT_SPEED * DECRYPT_ITER ms to resolve
// e.g. 8ms * 2 = 16ms/char → 146 chars ≈ 2.3s total
const DECRYPT_SPEED = 8
const DECRYPT_ITER  = 2
const BIO_DURATION  = BIO.length * DECRYPT_SPEED * DECRYPT_ITER  // ~2336ms

// ── Timeline (ms) ──────────────────────────────────────────
// Phase 1 — labels appear together
const LABEL_DELAY  = 300   // "/ ALL ROUNDER DEVELOPER" + "/ STACK" fade in simultaneously

// Phase 2 — content fills in (overlapping, offset)
const BIO_DELAY    = 900   // DecryptedText starts
const TAGS_DELAY   = 1100  // tags stagger starts 200ms after bio begins
const TAG_STAGGER  = 55    // ms between each tag

// Phase 3 — availability dot (after bio finishes)
const AVAIL_DELAY  = BIO_DELAY + BIO_DURATION + 300
// ───────────────────────────────────────────────────────────

interface Props {
  ready?: boolean
}

export default function Hero({ ready = false }: Props) {
  const [time, setTime]           = useState(new Date())
  const [labelsVisible, setLabels] = useState(false)
  const [bioTrigger, setBio]      = useState(false)
  const [tagsVisible, setTags]    = useState(false)
  const [availVisible, setAvail]  = useState(false)

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Animation chain — starts only after loader signals ready
  useEffect(() => {
    if (!ready) return
    const timers = [
      setTimeout(() => setLabels(true), LABEL_DELAY),
      setTimeout(() => setBio(true),    BIO_DELAY),
      setTimeout(() => setTags(true),   TAGS_DELAY),
      setTimeout(() => setAvail(true),  AVAIL_DELAY),
    ]
    return () => timers.forEach(clearTimeout)
  }, [ready])

  const h    = ((time.getHours() % 12) || 12).toString().padStart(2, '0')
  const m    = time.getMinutes().toString().padStart(2, '0')
  const isAm = time.getHours() < 12
  const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()!.replace(/_/g, ' ')

  return (
    <section className="hero" id="hero">

      {/* ── Top: full-width name ── */}
      <div className="hero__logo">GIFINO THORIQ</div>

      {/* ── Middle: video + aside ── */}
      <div className="hero__main">

        <div className="hero__video">
          <AsciiVideo />
        </div>

        <aside className="hero__aside">

          {/* Phase 1a — role label */}
          <div className={`hero__role${labelsVisible ? ' hero__role--visible' : ''}`}>
            / ALL ROUNDER DEVELOPER
          </div>

          {/* Phase 2a — bio decrypt */}
          <p className="hero__bio">
            <DecryptedText
              text={BIO}
              animateOn="manual"
              trigger={bioTrigger}
              speed={DECRYPT_SPEED}
              maxIterations={DECRYPT_ITER}
              sequential={true}
              parentClassName="hero__bio-inner"
              className="hero__bio-char"
              encryptedClassName="hero__bio-char hero__bio-char--encrypted"
            />
          </p>

          {/* Phase 3 — availability */}
          <div
            className={`hero__avail${availVisible ? ' hero__avail--visible' : ''}`}
            style={{ '--avail-delay': '0ms' } as React.CSSProperties}
          >
            <span className="hero__dot" />
            AVAILABLE — REMOTE
          </div>

          {/* Phase 1b — stack (label same time as role label) */}
          <div className="hero__stack">
            <div className={`hero__stack-label${labelsVisible ? ' hero__stack-label--visible' : ''}`}>
              / STACK
            </div>

            {/* Phase 2b — tags stagger in (offset from bio) */}
            <div className="hero__tags">
              {STACK.map((t, i) => (
                <span
                  key={t}
                  className={`hero__tag${tagsVisible ? ' hero__tag--visible' : ''}`}
                  style={{ '--tag-delay': `${i * TAG_STAGGER}ms` } as React.CSSProperties}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* ── Bottom bar ── */}
      <div className="hero__bottom">
        <div className="hero__info">
          <span className="hero__tz">LOCAL TIME — {tz}</span>
          <div className="hero__time-row">
            <span className="hero__time">{h}<span className="hero__colon">:</span>{m}</span>
            <div className="hero__ampm">
              <span className={`hero__ampm-item${isAm ? ' hero__ampm-item--on' : ''}`}>
                <span className={`dot${isAm ? ' dot--on' : ''}`} />AM
              </span>
              <span className={`hero__ampm-item${!isAm ? ' hero__ampm-item--on' : ''}`}>
                <span className={`dot${!isAm ? ' dot--on' : ''}`} />PM
              </span>
            </div>
          </div>
          <div className="hero__meta">
            <span>INDONESIA &rarr; REMOTE</span>
            <span>ALL ROUNDER DEVELOPER</span>
          </div>
        </div>

        <nav className="hero__nav" aria-label="Social links">
          <a href="https://github.com/GifinoThoriq" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://www.linkedin.com/in/gifino-thoriq/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:gifino92@gmail.com">Email</a>
        </nav>
      </div>
    </section>
  )
}
