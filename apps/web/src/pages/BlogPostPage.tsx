import { Link, useParams } from 'react-router'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useBlogPost } from '../lib/queries'
import { urlFor } from '../lib/imageUrl'
import './BlogPostPage.css'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img className="blog-post__body-image" src={urlFor(value).width(1000).url()} alt="" />
    ),
  },
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useBlogPost(slug)

  if (isLoading) {
    return (
      <main className="blog-post">
        <p className="blog-post__status">Loading…</p>
      </main>
    )
  }

  if (isError || !post) {
    return (
      <main className="blog-post">
        <p className="blog-post__status">Post not found.</p>
        <Link to="/#blog" className="blog-post__back">← Back to blog</Link>
      </main>
    )
  }

  return (
    <main className="blog-post">
      <Link to="/#blog" className="blog-post__back">← Back to blog</Link>

      {post.publishedAt && (
        <span className="blog-post__date">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      )}

      <h1 className="blog-post__title">{post.title}</h1>

      {post.coverImage && (
        <img className="blog-post__cover" src={post.coverImage} alt={post.title} />
      )}

      {post.body && (
        <div className="blog-post__body">
          <PortableText value={post.body as never} components={components} />
        </div>
      )}
    </main>
  )
}
