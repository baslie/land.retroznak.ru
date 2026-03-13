import type { APIRoute } from "astro";
import { siteMetadata } from "@/config/site";

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();

  const urls = [
    { loc: siteMetadata.siteUrl, changefreq: "monthly", priority: "1.0" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
