import { useEffect, useRef, useState } from 'react'
import './About.css'

const P1 =
  "I'm an all-rounder developer based in Indonesia, building interfaces that feel precise and alive. My work sits at the intersection of engineering and design — I care equally about how things work and how they look."

const P2 =
  "From pixel-perfect UIs to scalable backend APIs, I move across the full stack without losing sight of the user experience at every layer."

const STACK = [
  'React', 'TypeScript', 'Next.js', 'Node.js',
  'Vite', 'CSS / Sass', 'Tailwind', 'Figma',
  'Git', 'REST API', 'PostgreSQL', 'Docker',
]

const SPEED = 10 // ms per character

function useTypewriter(
  text: string,
  active: boolean,
  startDelay: number,
): [string, boolean] {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    let cancelled = false

    const delay = setTimeout(() => {
      if (cancelled) return
      let i = 0
      setDisplayed('')
      setDone(false)

      const tick = setInterval(() => {
        if (cancelled) { clearInterval(tick); return }
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(tick)
          setDone(true)
        }
      }, SPEED)
    }, startDelay)

    return () => {
      cancelled = true
      clearTimeout(delay)
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return [displayed, done]
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Timing chain
  const lineDelay   = 0
  const p1Delay     = 350                          // after line starts drawing
  const p2Delay     = p1Delay + P1.length * SPEED + 120
  const tagsDelay   = p1Delay + P1.length * SPEED  // start as P1 finishes
  const statusDelay = p2Delay + P2.length * SPEED + 150

  const [text1, p1Done] = useTypewriter(P1, inView, p1Delay)
  const [text2]         = useTypewriter(P2, inView, p2Delay)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="about" id="about" ref={sectionRef}>

      {/* 1. Line draws in */}
      <div
        className={`about__line${inView ? ' about__line--draw' : ''}`}
        style={{ '--line-delay': `${lineDelay}ms` } as React.CSSProperties}
      />

      <div className="about__label">02 — ABOUT</div>

      <div className="about__content">

        {/* 2. Bio typewriter */}
        <div className="about__bio">
          <p className="about__text">
            {text1}
            {text1.length > 0 && !p1Done && <span className="about__cursor" />}
          </p>
          <p className="about__text">
            {text2}
            {text2.length > 0 && text2.length < P2.length && (
              <span className="about__cursor" />
            )}
          </p>

          <div
            className={`about__status${inView ? ' about__status--visible' : ''}`}
            style={{ '--status-delay': `${statusDelay}ms` } as React.CSSProperties}
          >
            <span className="about__dot about__dot--open" />
            Available for remote work
          </div>
        </div>

        {/* 3. Stack tags stagger in */}
        <div className="about__stack">
          <div className="about__stack-label">Stack</div>
          <div className="about__tags">
            {STACK.map((t, i) => (
              <span
                key={t}
                className={`about__tag${inView ? ' about__tag--visible' : ''}`}
                style={{
                  '--tag-delay': `${tagsDelay + i * 55}ms`,
                } as React.CSSProperties}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
