import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.legalUpdatedISO);

  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/offer`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
