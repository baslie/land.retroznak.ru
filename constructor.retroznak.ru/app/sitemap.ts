import type { MetadataRoute } from "next";

import { siteMetadata } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const docs = ["/docs/installation", "/docs/care"] as const;
  const docEntries = docs.map<MetadataRoute.Sitemap[number]>((path) => ({
    url: new URL(path, siteMetadata.siteUrl).toString(),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    {
      url: siteMetadata.siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...docEntries,
  ];
}
