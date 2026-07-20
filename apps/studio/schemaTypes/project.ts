import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (maps to "num" in the UI)',
    }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'role', type: 'string' }),
    defineField({
      name: 'tech',
      title: 'Tech stack',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'url', type: 'url' }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'year', media: 'image' },
  },
})
