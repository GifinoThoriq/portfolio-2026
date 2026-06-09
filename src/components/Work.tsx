import { useState, useRef } from 'react'
import './Work.css'
import Shuffle from './Shuffle'

interface Project {
  num: string
  title: string
  year: string
  role: string
  tech: string[]
  desc: string
  url: string
  image: string
}

const PROJECTS: Project[] = [
  {
    num: '01',
    title: 'Feedbackami',
    year: '2026',
    role: 'Fullstack',
    tech: ['Next', 'Supabase', 'AI', 'Webhooks'],
    desc: 'Feedback management platform with simple idea: give product teams a single place to collect, organize, and act on user feedback.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7438504954258112512/',
    image: '/projects/feedbackami.png',
  },
  {
    num: '02',
    title: 'Legacy Vault',
    year: '2026',
    role: 'Fullstack',
    tech: ['React', 'Laravel', 'AWS'],
    desc: "Build E-commerce system for toys acccesories include local and international market",
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7446757173839327232/',
    image: '/projects/legacyvault.jpeg',
  },
  {
    num: '03',
    title: 'Wellness by Solace',
    year: '2026',
    role: 'Frontend',
    tech: ['Wordpress', 'Elementor', 'Webhooks'],
    desc: 'Building company profile',
    url: 'https://wellnessbysolace.com',
    image: '/projects/solace.png',
  },
  {
    num: '04',
    title: 'GSocial',
    year: '2026',
    role: 'Fullstack',
    tech: ['Next', 'Node', 'Express', 'PostgreSQL', 'PM2', 'AI'],
    desc: 'Manage, schedule, and publish content across social media platform.',
    url: '/',
    image: '/projects/gsocial.png',
  },
  {
    num: '05',
    title: 'Gigee App',
    year: '2025',
    role: 'Frontend',
    tech: ['React', 'Tailwind', 'AI'],
    desc: 'Scan oral health with AI powered to get healths and insights. Assist with dentist appointment on near locations',
    url: 'https://app.gigee.my/',
    image: '/projects/gigee.png',
  },
]

export default function Work() {
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const [isPanelVisible, setPanelVisible] = useState(true)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = (i: number) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveIdx(i)
    setPanelVisible(true)
  }
  
  return (
    <section className="work" id="work">

      {/* Label stays padded */}
      <div className="work__label">
        <Shuffle
          text="WORK"
          tag="span"
          textAlign="left"
          shuffleDirection="right"
          animationMode="evenodd"
          shuffleTimes={1}
          duration={0.35}
          stagger={0.03}
          ease="power3.out"
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={false}
          loop={false}
          respectReducedMotion={true}
        />
      </div>

      {/* Grid bleeds edge to edge */}
      <div className={`work__content${isPanelVisible ? ' work__content--active' : ''}`}>

        {/* ── Left: project list ── */}
        <div className="work__list">
          {PROJECTS.map((p, i) => {
            const isActive = activeIdx === i && isPanelVisible
            return (
              <div
                key={p.num}
                className={`work__item${isActive ? ' work__item--active' : ''}`}
                onMouseEnter={() => handleEnter(i)}
              >
                {/* Always visible: num + title + meta */}
                <div className="work__item-top">
                  <div className="work__item-main">
                    <span className="work__num">{p.num}</span>
                    <div className="work__info">
                      <span className="work__title">{p.title}</span>
                      <div className="work__meta">
                        <span>{p.year}</span>
                        <span className="work__meta-sep">/</span>
                        <span>{p.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags + arrow — slide in from right on hover */}
                  <div className="work__item-aside">
                    <div className="work__tags">
                      {p.tech.map(t => (
                        <span key={t} className="work__tag">{t}</span>
                      ))}
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work__arrow"
                      aria-label={`Open ${p.title}`}
                      onClick={e => e.stopPropagation()}
                    >
                      ↗
                    </a>
                  </div>
                </div>

                {/* Description — accordion expand on hover */}
                <div className="work__expand">
                  <div className="work__expand-inner">
                    <p className="work__desc">{p.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Right: image panel ── */}
        <div className="work__panel" aria-hidden="true">
          {PROJECTS.map((p, i) => (
            <div
              key={p.num}
              className={`work__panel-img${activeIdx === i && isPanelVisible ? ' work__panel-img--visible' : ''}`}
            >
              <img src={p.image} alt="" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
