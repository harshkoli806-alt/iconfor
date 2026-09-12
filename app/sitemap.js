import { TOOLS, CATEGORIES, SITE } from "../lib/tools";

export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, priority: 1 },
    { url: `${SITE}/categories`, lastModified: now, priority: 0.8 },
    ...Object.keys(CATEGORIES).map((c) => ({
      url: `${SITE}/categories/${c}`, lastModified: now, priority: 0.7,
    })),
    ...TOOLS.map((t) => ({
      url: `${SITE}/icons/${t.slug}`, lastModified: now, priority: 0.6,
    })),
  ];
}
