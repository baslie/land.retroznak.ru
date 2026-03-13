import type { APIRoute } from "astro";
import { siteMetadata } from "@/config/site";

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${siteMetadata.siteUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
