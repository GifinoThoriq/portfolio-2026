import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Work from './components/Work'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Loader from './components/Loader'
import './App.css'

const SECTIONS = [
  { id: 'hero',    label: '01' },
  { id: 'work',    label: '02' },
  { id: 'blog',    label: '03' },
  { id: 'contact', label: '04' },
]

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <nav className="sidenav" aria-label="Section navigation">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`sidenav__dot${active === s.id ? ' sidenav__dot--active' : ''}`}
            onClick={() => scrollTo(s.id)}
            aria-label={`Go to section ${s.label}`}
            title={s.label}
          />
        ))}
      </nav>

      <Hero ready={loaded} />
      <Work />
      <Blog />
      <Contact />
    </>
  )
}
