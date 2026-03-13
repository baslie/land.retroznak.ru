import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ProductOptionsProvider } from "@/contexts/ProductOptionsContext";
import { CookieBanner } from "@/components/CookieBanner";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import ReferralTracker from "@/components/ReferralTracker";
import { siteMetadata } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/styles/tailwind.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@/styles/globals.css";
import "lenis/dist/lenis.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s — ${siteMetadata.brand}`,
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.brand,
  generator: "Next.js 15",
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.organization, url: siteMetadata.siteUrl }],
  creator: siteMetadata.organization,
  publisher: siteMetadata.organization,
  alternates: {
    canonical: siteMetadata.siteUrl,
    languages: {
      "ru-RU": siteMetadata.siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.brand,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: `${siteMetadata.siteUrl}${siteMetadata.socialImage}`,
        width: 1600,
        height: 1067,
        alt: siteMetadata.socialImageAlt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [`${siteMetadata.siteUrl}${siteMetadata.socialImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "business",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#000000" }],
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe2" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1014" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="bg-background text-foreground" suppressHydrationWarning>
      <head>
        {/* Jivo Chat Widget */}
        <Script src="//code.jivo.ru/widget/nZ7sd3tz9u" async strategy="afterInteractive" />
      </head>
      <body className={cn("min-h-screen bg-background text-foreground antialiased")} suppressHydrationWarning>
        <ThemeProvider>
          <ProductOptionsProvider>
            <SmoothScrollProvider>
              {children}
              <AnalyticsProvider />
              <ReferralTracker />
              <CookieBanner />
              <NoiseOverlay />
            </SmoothScrollProvider>
          </ProductOptionsProvider>
        </ThemeProvider>

        {/* JSON-LD Structured Data */}
        <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ООО «Три Кита»",
            legalName: "Общество с ограниченной ответственностью «Три Кита»",
            url: siteMetadata.siteUrl,
            logo: `${siteMetadata.siteUrl}/icons/apple-touch-icon.png`,
            description: siteMetadata.description,
            email: siteMetadata.contactEmail,
            telephone: [
              "+7 (983) 232-22-06",
              "+7 (968) 188-47-15",
              "+7 (913) 816-47-15"
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "ул. Енисейская, д. 32б",
              addressLocality: "Томск",
              postalCode: "634041",
              addressCountry: "RU"
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00"
              }
            ],
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+7 (983) 232-22-06",
                contactType: "customer service",
                areaServed: "RU",
                availableLanguage: "Russian"
              }
            ],
            sameAs: [
              siteMetadata.maxUrl,
              siteMetadata.telegramUrl
            ]
          })}
        </Script>

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=66944668', 'ym');

            ym(66944668, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/66944668"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Top.Mail.Ru counter (VK Pixel) */}
        <Script id="top-mail-ru" strategy="afterInteractive">
          {`
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3729731", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "tmr-code");
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://top-fwz1.mail.ru/counter?id=3729731;js=na"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
