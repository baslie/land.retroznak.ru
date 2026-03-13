import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// Brand colored icons
const MaxIcon = () => (
  <Image src="/contacts/max.svg" alt="MAX" width={20} height={20} className="h-5 w-5 rounded" />
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 transition-colors group-hover:fill-[#0088cc]" fill="#0088cc">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

import { footerContent } from "@/content/footer";
import { navigationContent } from "@/content/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTypograf } from "@/hooks/useTypograf";

import { CTAButton } from "./components/CTAButton";
import { Logo } from "./components/Logo";
import { MobileNavDrawer } from "./components/MobileNavDrawer";
import { Navigation } from "./components/Navigation";
import { FooterNav } from "./components/FooterNav";
import { QuestionModal } from "./components/Forms/QuestionModal";
import { CallbackModal } from "./components/Forms/CallbackModal";
import { ConsultationModal } from "./components/Forms/ConsultationModal";

export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { menuItems, cta, messengers } = navigationContent;
  const { menu, legal } = footerContent;

  const typografLegal = useTypograf(legal);
  const typografFooterDesc = useTypograf(
    "Объёмные ретрознаки с подсветкой. Восстанавливаем исторические формы и создаём современные решения для домов, бизнеса и музеев."
  );
  const typografPrivacy = useTypograf("Политика конфиденциальности");
  const typografConsent = useTypograf("Согласие на обработку ПД");
  const typografCopyright = useTypograf(
    `© 2017–${new Date().getFullYear()} ООО «Три Кита». Все права защищены.`
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <header className="absolute top-0 z-40 w-full">
          <div className="container flex w-full items-center justify-between gap-6 py-5">
            <Link
              href="#hero"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Retroznak"
            >
              <Logo className="h-8 w-auto" variant="light" />
            </Link>
            <Navigation menuItems={menuItems} />
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 lg:flex">
                <a
                  href="https://max.ru/u/f9LHodD0cOIEbD_OdC-W2plmBZXw9TBsnOkjLHduOoV7V04iu37eGsdGMmQ"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
                  aria-label="MAX"
                >
                  <MaxIcon />
                </a>
                <a
                  href="https://t.me/retroznakrf"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
                <ThemeToggle />
              </div>
              <CTAButton cta={cta} size="sm" className="hidden lg:inline-flex" />
              <div className="flex items-center gap-3 lg:hidden">
                <ThemeToggle />
                <MobileNavDrawer menuItems={menuItems} cta={cta} messengers={messengers} />
              </div>
            </div>
          </div>
        </header>

        {/* <FloatingMenu menuItems={menuItems} cta={cta} messengers={messengers} /> */}

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-secondary/50 py-12">
          <div className="container space-y-10">
            <div className="space-y-6">
              <div>
                <Logo className="h-8 w-auto" />
                <p className="mt-3 max-w-md text-sm text-muted-foreground">{typografFooterDesc}</p>
              </div>
              <FooterNav menu={menu} />
            </div>
            <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>{typografLegal}</p>
              <div className="flex flex-col items-start gap-1 sm:items-center">
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 decoration-muted-foreground whitespace-nowrap"
                >
                  {typografPrivacy}
                </Link>
                <Link
                  href="/consent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 decoration-muted-foreground whitespace-nowrap"
                >
                  {typografConsent}
                </Link>
              </div>
              <p className="sm:text-right">{typografCopyright}</p>
            </div>
          </div>
        </footer>

        {/* Модальные окна форм */}
        <QuestionModal />
        <CallbackModal />
        <ConsultationModal />
    </div>
  );
}
