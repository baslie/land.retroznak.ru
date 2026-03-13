"use client";


import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/base-path";
import { useTypograf } from "@/hooks/useTypograf";

export default function NotFoundContent() {
  const title = "Страница затерялась в истории";
  const description =
    "Похоже, эта страница исчезла, как многие ретрознаки советской эпохи. Но мы можем вернуть вас на главную — там точно всё на месте!";

  const typografTitle = useTypograf(title);
  const typografDescription = useTypograf(description);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset("/hero/video-preview.jpg")}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={asset("/hero/video.webm")} type="video/webm" />
        <source src={asset("/hero/video.mp4")} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video dimming overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20 dark:bg-black/20" aria-hidden />

      <div className="container relative z-20 flex items-center justify-center">
        <div className="relative max-w-3xl text-center">
          <div className="relative z-10 space-y-8">
            {/* Logo */}
            <div className="mx-auto mb-6 flex items-center justify-center">
              <img
                src={asset("/brand/logo.svg")}
                alt="Ретрознак"
                width={175}
                height={44}
                className="h-auto w-32"
              />
            </div>

            {/* 404 large number */}
            <div className="space-y-4">
              <h1 className="text-9xl md:text-[12rem] font-bold leading-none text-white/90 tracking-tight">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-white text-balance">
                {typografTitle}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mx-auto text-balance">
              {typografDescription}
            </p>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                <a href="/#hero" className="inline-flex items-center gap-2" style={{ direction: 'ltr' }}>
                  <ArrowLeft className="h-5 w-5" style={{ transform: 'scaleX(1)' }} />
                  <span>На главную</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
