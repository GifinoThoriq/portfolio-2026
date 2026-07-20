import { useState, useRef } from 'react'
import { Link } from 'react-router'
import './Work.css'
import Shuffle from './Shuffle'
import { useProjects } from '../lib/queries'

export default function Work() {
  const { data: projects, isLoading, isError } = useProjects()
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
          {isLoading && <p className="work__status">Loading projects…</p>}
          {isError && <p className="work__status">Couldn't load projects.</p>}
          {projects?.map((p, i) => {
            const isActive = activeIdx === i && isPanelVisible
            const num = String(i + 1).padStart(2, '0')
            return (
              <div
                key={p._id}
                className={`work__item${isActive ? ' work__item--active' : ''}`}
                onMouseEnter={() => handleEnter(i)}
              >
                {/* Always visible: num + title + meta */}
                <div className="work__item-top">
                  <div className="work__item-main">
                    <span className="work__num">{num}</span>
                    <div className="work__info">
                      <Link to={`/work/${p.slug}`} className="work__title">{p.title}</Link>
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
                      {p.tech?.map(t => (
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
                    <p className="work__desc">{p.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Right: image panel ── */}
        <div className="work__panel" aria-hidden="true">
          {projects?.map((p, i) => (
            <div
              key={p._id}
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
