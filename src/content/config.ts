import { defineCollection, z } from 'astro:content';

// Insights/Blog Collection
const insightsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Prost Health Team'),
    category: z.enum([
      'Understanding the Diagnosis',
      'Navigating the Pathway',
      'Living with Uncertainty',
      'Health & Lifestyle',
    ]),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// Experts Collection
const expertsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    slug: z.string(),
    specialty: z.string().default('Uroradiology'),
    image: z.string(),
    imageAlt: z.string(),
    order: z.number().default(0), // For display ordering
    appointments: z.array(
      z.object({
        institution: z.string(),
        role: z.string(),
      })
    ),
    qualifications: z.array(z.string()),
    researchInterests: z.array(z.string()).optional(),
    publications: z
      .array(
        z.object({
          title: z.string(),
          journal: z.string().optional(),
          year: z.number(),
          url: z.string().url().optional(),
        })
      )
      .optional(),
    personalStatement: z.string().optional(),
  }),
});

export const collections = {
  insights: insightsCollection,
  experts: expertsCollection,
};
