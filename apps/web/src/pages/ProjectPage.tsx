import { Link, useParams } from 'react-router'
import { useProject } from '../lib/queries'
import './ProjectPage.css'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, isError } = useProject(slug)

  if (isLoading) {
    return (
      <main className="project-page">
        <p className="project-page__status">Loading…</p>
      </main>
    )
  }

  if (isError || !project) {
    return (
      <main className="project-page">
        <p className="project-page__status">Project not found.</p>
        <Link to="/" className="project-page__back">← Back</Link>
      </main>
    )
  }

  return (
    <main className="project-page">
      <Link to="/" className="project-page__back">← Back</Link>
      <h1 className="project-page__title">{project.title}</h1>
      <p className="project-page__meta">
        {project.year}{project.year && project.role ? ' — ' : ''}{project.role}
      </p>

      {project.image && (
        <img className="project-page__image" src={project.image} alt={project.title} />
      )}

      {project.description && (
        <p className="project-page__desc">{project.description}</p>
      )}

      {project.tech && project.tech.length > 0 && (
        <ul className="project-page__tags">
          {project.tech.map((t) => (
            <li key={t} className="project-page__tag">{t}</li>
          ))}
        </ul>
      )}

      {project.url && (
        <a
          className="project-page__link"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit project ↗
        </a>
      )}
    </main>
  )
}
