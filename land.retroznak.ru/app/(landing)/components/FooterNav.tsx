"use client";

import Link from "next/link";
import type { FooterLinkGroup } from "@/types/content";
import { NavLink } from "./NavLink";

interface FooterNavProps {
  menu: FooterLinkGroup[];
}

export function FooterNav({ menu }: FooterNavProps) {
  return (
    <div className="text-sm text-muted-foreground">
      {menu.map((group) => (
        <ul key={group.title} className="flex flex-wrap gap-x-6 gap-y-2">
          {group.links.map((link) => {
            // Check if it's an anchor link (starts with #)
            if (link.href.startsWith("#")) {
              const targetId = link.href.substring(1); // Remove the #
              return (
                <li key={link.href}>
                  <NavLink
                    targetId={targetId}
                    className="cursor-pointer transition hover:text-foreground"
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            }

            // External link
            if (link.external) {
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 transition hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {link.label}
                    {link.icon === "newspaper" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                        <path d="M18 14h-8"/>
                        <path d="M15 18h-5"/>
                        <path d="M10 6h8v4h-8V6Z"/>
                      </svg>
                    )}
                  </a>
                </li>
              );
            }

            // Internal link with Next.js Link or regular anchor
            if (link.href.startsWith("http") || link.href.startsWith("/")) {
              return (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              );
            }

            // Regular anchor
            return (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-foreground">
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
