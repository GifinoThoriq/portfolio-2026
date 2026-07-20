import { useQuery } from '@tanstack/react-query'
import { sanityClient } from './sanityClient'

export interface Project {
  _id: string
  title: string
  slug: string
  order?: number
  year?: string
  role?: string
  tech?: string[]
  description?: string
  url?: string
  image?: string
}

const PROJECT_FIELDS = `
  _id, title, "slug": slug.current, order, year, role, tech, description, url,
  "image": image.asset->url
`

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => sanityClient.fetch<Project[]>(PROJECTS_QUERY),
  })
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => sanityClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug }),
    enabled: !!slug,
  })
}
