"use client";

import type { ComponentType } from "react";

import Image from "next/image";
import { LinkIcon, Send, Youtube, Rocket, Newspaper, Share2 } from "lucide-react";

import { finalCtaContent } from "@/content/finalCta";
import { commonTexts } from "@/content/common";
import { useTypograf } from "@/hooks/useTypograf";
import { useJivoChat } from "@/hooks/useJivoChat";
import { typograf } from "@/lib/typograf";

import { CTAButton } from "./CTAButton";
import { ContactIcons } from "./ContactIcons";

const VKIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 101 100" className={className} fill="currentColor">
    <g clipPath="url(#clip0_vk_social)">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.52944 7.02944C0.5 14.0589 0.5 25.3726 0.5 48V52C0.5 74.6274 0.5 85.9411 7.52944 92.9706C14.5589 100 25.8726 100 48.5 100H52.5C75.1274 100 86.4411 100 93.4706 92.9706C100.5 85.9411 100.5 74.6274 100.5 52V48C100.5 25.3726 100.5 14.0589 93.4706 7.02944C86.4411 0 75.1274 0 52.5 0H48.5C25.8726 0 14.5589 0 7.52944 7.02944ZM17.3752 30.4169C17.9168 56.4169 30.9167 72.0418 53.7084 72.0418H55.0003V57.1668C63.3753 58.0001 69.7082 64.1252 72.2498 72.0418H84.0835C80.8335 60.2085 72.2914 53.6668 66.9581 51.1668C72.2914 48.0835 79.7915 40.5835 81.5831 30.4169H70.8328C68.4995 38.6669 61.5836 46.1668 55.0003 46.8751V30.4169H44.2499V59.2501C37.5833 57.5835 29.1668 49.5002 28.7918 30.4169H17.3752Z" />
    </g>
    <defs>
      <clipPath id="clip0_vk_social">
        <rect width="100" height="100" fill="white" transform="translate(0.5)"/>
      </clipPath>
    </defs>
  </svg>
);

const socialIconMap: Record<string, ComponentType<{ className?: string }>> = {
  telegram: Send,
  vk: VKIcon,
  youtube: Youtube,
};

export function FinalCTASection() {
  const {
    title,
    subtitle,
    triggers,
    primaryCta,
    secondaryCta,
    messengers,
    resources,
    socials,
    contacts,
  } = finalCtaContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);
  const { openChat } = useJivoChat();

  const handleConsultationClick = () => {
    const result = openChat({ start: "chat" });

    if (result.result === "fail") {
      // Fallback: scroll to messengers section if Jivo fails
      const messengersElement = document.getElementById("messengers");
      if (messengersElement) {
        messengersElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="final-cta" className="bg-secondary py-20">
      <div className="container space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
            <Rocket className="h-4 w-4" aria-hidden />
            {commonTexts.readyToStart}
          </span>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg text-muted-foreground">{typografSubtitle}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="grid gap-4 rounded-3xl border border-border bg-secondary/50 p-6 sm:grid-cols-2">
              {triggers.map((trigger) => {
                const typografTriggerTitle = typograf(trigger.title);
                const typografTriggerDescription = typograf(trigger.description);

                return (
                  <div key={trigger.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-lg font-semibold text-card-foreground">{typografTriggerTitle}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{typografTriggerDescription}</p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground">{commonTexts.usefulMaterials}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {resources.map((resource) => {
                  const Icon = resource.type === "news" ? Newspaper : LinkIcon;
                  return (
                    <li key={resource.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" aria-hidden />
                      <a
                        href={resource.href}
                        className="underline decoration-primary/60 underline-offset-4 transition hover:text-card-foreground"
                        target={resource.href.startsWith("http") ? "_blank" : undefined}
                        rel={resource.href.startsWith("http") ? "nofollow noopener noreferrer" : undefined}
                      >
                        {resource.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-border bg-card p-8">
            <div className="space-y-4">
              <CTAButton cta={primaryCta} className="w-full justify-center" size="lg" />
              <CTAButton cta={secondaryCta} className="w-full justify-center" onClick={handleConsultationClick} />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{commonTexts.connectViaMessengers}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{commonTexts.workingHours}</p>
              </div>
              <div className="grid gap-4 grid-cols-2 max-[480px]:grid-cols-1">
                {messengers.map((messenger) => (
                  <div
                    key={messenger.platform}
                    className="rounded-2xl border border-border bg-secondary p-4 flex flex-col max-[480px]:items-center"
                  >
                    <ContactIcons items={[messenger]} orientation="vertical" />
                    {messenger.qrCodeImage ? (
                      <div className="mt-4 flex items-center justify-center rounded-2xl border border-border bg-secondary/50 p-3">
                        <Image
                          src={messenger.qrCodeImage}
                          alt={`QR-код ${messenger.label}`}
                          width={120}
                          height={120}
                          className="h-24 w-24 object-contain"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div id="messengers" className="sr-only" aria-hidden />
            </div>
            {contacts && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-card-foreground">{commonTexts.contacts}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {contacts.map((contact) => (
                    <li key={contact.label}>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="transition hover:text-foreground"
                          target={contact.href.startsWith("http") ? "_blank" : undefined}
                          rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                        >
                          {contact.label}: {contact.value}
                        </a>
                      ) : (
                        <span>
                          {contact.label}: {contact.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-card-foreground">{commonTexts.weAreInSocials}</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = socialIconMap[social.platform] ?? Share2;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
