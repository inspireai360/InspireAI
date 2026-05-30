export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  content?: string
  date: string
  readTime: number
  category: string
  keywords: string[]
  relatedService?: string
  relatedServiceUrl?: string
}
