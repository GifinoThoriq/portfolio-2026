import { useEffect, useRef, useState } from 'react'
import './Loader.css'

const SEGS = 24

// Real assets to preload — project images + fonts
const IMAGE_URLS = [
  '/projects/feedbackami.png',
  '/projects/legacyvault.jpeg',
  '/projects/solace.png',
  '/projects/gsocial.png',
  '/projects/gigee.png',
]

interface Props {
  onDone: () => void
}

export default function Loader({ onDone }: Props) {
  const [pct, setPct]         = useState(0)
  const [exiting, setExiting] = useState(false)
  const targetRef             = useRef(0)
  const currentRef            = useRef(0)
  const rafRef                = useRef(0)
  const doneRef               = useRef(false)

  useEffect(() => {
    const total = IMAGE_URLS.length + 1 // +1 for fonts
    let loaded = 0

    function advance() {
      loaded++
      targetRef.current = Math.round((loaded / total) * 100)
    }

    function finish() {
      if (doneRef.current) return
      doneRef.current = true
      targetRef.current = 100
    }

    // Smooth animation loop: current chases target
    function animate() {
      const gap = targetRef.current - currentRef.current
      if (gap > 0) {
        currentRef.current = Math.min(
          currentRef.current + Math.max(gap * 0.06, 0.4),
          targetRef.current
        )
        setPct(Math.round(currentRef.current))
      }

      if (currentRef.current >= 100) {
        setPct(100)
        setTimeout(() => {
          setExiting(true)
          setTimeout(onDone, 450)
        }, 500)
        return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Preload images
    IMAGE_URLS.forEach(url => {
      const img = new Image()
      img.onload  = () => { advance(); }
      img.onerror = () => { advance(); } // count errors too so bar always completes
      img.src = url
    })

    // Fonts
    document.fonts.ready.then(() => {
      advance()
      finish() // once fonts are done, allow bar to go to 100
    })

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [onDone])

  const activeCount = Math.round((pct / 100) * SEGS)

  return (
    <div className={`loader${exiting ? ' loader--exit' : ''}`}>
      <span className="loader__label">Loading...</span>

      <div className="loader__bar-shell">
        {Array.from({ length: SEGS }, (_, i) => (
          <div
            key={i}
            className={`loader__seg${i < activeCount ? ' loader__seg--active' : ''}`}
          />
        ))}
      </div>

      <span className="loader__pct">{pct}%</span>
    </div>
  )
}
