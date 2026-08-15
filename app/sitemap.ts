import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.legalUpdatedISO);

  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/offer`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
