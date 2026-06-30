"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const KINESCOPE_HERO_VIDEO_ID = "gHf8iGQfTBZZPEsVijHRDW";

const KINESCOPE_ALLOW =
  "autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;";

export const KINESCOPE_EMBED_URL = `https://kinescope.io/embed/${KINESCOPE_HERO_VIDEO_ID}`;

export const KINESCOPE_HERO_EMBED_SRC = `${KINESCOPE_EMBED_URL}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`;

const VIDEO_LOAD_TIMEOUT_MS = 12_000;

type HeroBackgroundMediaProps = {
  posterSrc: string;
  posterAlt?: string;
};

export function HeroBackgroundMedia({
  posterSrc,
  posterAlt = "",
}: HeroBackgroundMediaProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    setVideoSrc(KINESCOPE_HERO_EMBED_SRC);
  }, []);

  useEffect(() => {
    if (!videoSrc || videoVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVideoSrc(null);
    }, VIDEO_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [videoSrc, videoVisible]);

  function handleVideoLoad() {
    setVideoVisible(true);
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        className={`object-cover object-center transition-opacity duration-700 ${
          videoVisible ? "opacity-0" : "opacity-100"
        }`}
        sizes="100vw"
      />

      {videoSrc && (
        <iframe
          src={videoSrc}
          allow={KINESCOPE_ALLOW}
          title="KGM Torres"
          onLoad={handleVideoLoad}
          className={`pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${
            videoVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/** Responsive 16:9 embed for cards and constrained containers. */
export function KinescopeResponsive({
  title = "KGM Torres",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full pt-[56.25%] ${className}`.trim()}>
      <iframe
        src={`${KINESCOPE_EMBED_URL}?autoplay=1&muted=1&loop=1&playsinline=1`}
        allow={KINESCOPE_ALLOW}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
