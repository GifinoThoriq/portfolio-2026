import { Link } from 'react-router'
import './Blog.css'
import Shuffle from './Shuffle'
import { useBlogPosts } from '../lib/queries'

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Blog() {
  const { data: posts, isLoading, isError } = useBlogPosts()

  return (
    <section className="blog" id="blog">
      <div className="blog__label">
        <Shuffle
          text="BLOG"
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

      <div className="blog__content">
        {isLoading && <p className="blog__status">Loading posts…</p>}
        {isError && <p className="blog__status">Couldn't load posts.</p>}
        {posts && posts.length === 0 && (
          <p className="blog__status">No posts yet — check back soon.</p>
        )}

        {posts?.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug}`} className="blog__item">
            {p.coverImage && (
              <div className="blog__item-image">
                <img src={p.coverImage} alt="" />
              </div>
            )}
            <div className="blog__item-body">
              <span className="blog__item-date">{formatDate(p.publishedAt)}</span>
              <h3 className="blog__item-title">{p.title}</h3>
              {p.excerpt && <p className="blog__item-excerpt">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
