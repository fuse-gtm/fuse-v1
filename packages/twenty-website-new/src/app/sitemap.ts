import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL?.replace(/\/$/, '') ??
  'https://fuse-platform-website.vercel.app';

const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/product', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/the-future', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/resources/technology-partners', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/resources/marketplace-partners', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/resources/agency-partners', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/resources/creator-partners', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
