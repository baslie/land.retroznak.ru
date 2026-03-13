import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";

export const metadata: Metadata = {
  title: typograf("Спасибо за заявку"),
  description: typograf("Мы получили вашу заявку и свяжемся с вами в ближайшее время."),
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  const title = useTypograf("Спасибо за заявку!");
  const description = useTypograf(
    "Мы получили вашу заявку и свяжемся с вами в течение 24 часов в рабочее время. Если вопрос срочный, позвоните нам напрямую."
  );
  const officeTitle = useTypograf("Офис Томск");
  const emailTitle = useTypograf("Email");
  const scheduleTitle = useTypograf("Режим работы");
  const schedule = useTypograf("ПН-ПТ: 09:00-18:00, СБ-ВС: выходной");
  const homeButton = useTypograf("На главную");

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/video-preview.jpg"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero/video.webm" type="video/webm" />
        <source src="/hero/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video dimming overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20 dark:bg-black/20" aria-hidden />

      <div className="container relative z-20 flex items-center justify-center py-16">
        <div className="relative max-w-3xl text-center">
          <div className="relative z-10 space-y-8">
            {/* Logo */}
            <div className="space-y-4">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <Image
                  src="/brand/logo.svg"
                  alt="Ретрознак"
                  width={175}
                  height={44}
                  className="h-auto w-32"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
                {title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mx-auto text-balance max-w-2xl">
              {description}
            </p>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 space-y-2">
                <div className="flex justify-center">
                  <Phone className="h-8 w-8 text-orange-400" aria-hidden />
                </div>
                <h3 className="text-white font-semibold">{officeTitle}</h3>
                <a
                  href="tel:+79832322206"
                  className="text-white/90 hover:text-white transition-colors text-sm block"
                >
                  +7 (983) 232-22-06
                </a>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 space-y-2">
                <div className="flex justify-center">
                  <Mail className="h-8 w-8 text-orange-400" aria-hidden />
                </div>
                <h3 className="text-white font-semibold">{emailTitle}</h3>
                <a
                  href="mailto:***REMOVED***"
                  className="text-white/90 hover:text-white transition-colors text-sm block"
                >
                  ***REMOVED***
                </a>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 space-y-2">
                <div className="flex justify-center">
                  <Clock className="h-8 w-8 text-orange-400" aria-hidden />
                </div>
                <h3 className="text-white font-semibold">{scheduleTitle}</h3>
                <span className="text-white/90 text-sm block">{schedule}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                <Link href="/#hero" className="inline-flex items-center gap-2" style={{ direction: 'ltr' }}>
                  <ArrowLeft className="h-5 w-5" style={{ transform: 'scaleX(1)' }} />
                  <span>{homeButton}</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
