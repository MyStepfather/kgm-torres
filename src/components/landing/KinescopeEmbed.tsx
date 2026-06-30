"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const KINESCOPE_HERO_VIDEO_ID = "gHf8iGQfTBZZPEsVijHRDW";

const KINESCOPE_ALLOW =
  "autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;";

export const KINESCOPE_EMBED_URL = `https://kinescope.io/embed/${KINESCOPE_HERO_VIDEO_ID}`;

export const KINESCOPE_HERO_EMBED_SRC = `${KINESCOPE_EMBED_URL}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`;

const KINESCOPE_API_SRC = "https://player.kinescope.io/latest/iframe.player.js";
const VIDEO_LOAD_TIMEOUT_MS = 12_000;

type KinescopePlayer = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  isPaused: () => Promise<boolean>;
  setVolume: (volume: number) => Promise<void>;
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  isMuted: () => Promise<boolean>;
};

type KinescopePlayerFactory = {
  create: (
    elementId: string,
    options: Record<string, unknown>,
  ) => Promise<KinescopePlayer>;
};

type HeroVideoContextValue = {
  registerPlayer: (player: KinescopePlayer | null) => void;
  setVideoVisible: (visible: boolean) => void;
  setMuted: (muted: boolean) => void;
  videoVisible: boolean;
  muted: boolean;
  toggleMute: () => void;
};

const HeroVideoContext = createContext<HeroVideoContextValue | null>(null);

let kinescopeApiPromise: Promise<KinescopePlayerFactory> | null = null;

function loadKinescopePlayerApi() {
  if (kinescopeApiPromise) {
    return kinescopeApiPromise;
  }

  kinescopeApiPromise = new Promise((resolve, reject) => {
    const win = window as Window & {
      onKinescopeIframeAPIReady?: (factory: KinescopePlayerFactory) => void;
    };

    win.onKinescopeIframeAPIReady = (factory) => {
      resolve(factory);
    };

    if (document.querySelector(`script[src="${KINESCOPE_API_SRC}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = KINESCOPE_API_SRC;
    script.async = true;
    script.onerror = () => {
      kinescopeApiPromise = null;
      reject(new Error("Failed to load Kinescope player API"));
    };
    document.head.appendChild(script);
  });

  return kinescopeApiPromise;
}

type HeroVideoProviderProps = {
  children: ReactNode;
};

export function HeroVideoProvider({ children }: HeroVideoProviderProps) {
  const [videoVisible, setVideoVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef<KinescopePlayer | null>(null);

  const registerPlayer = useCallback((player: KinescopePlayer | null) => {
    playerRef.current = player;
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    if (muted) {
      setMuted(false);

      // Safari: start play() while still muted, then unmute in the same gesture chain.
      void player
        .play()
        .catch(() => undefined)
        .then(() => player.unmute())
        .then(() => player.setVolume(1))
        .catch((error) => {
          console.error("Hero video unmute error:", error);
          setMuted(true);
          void player.mute().catch(() => undefined);
        });
    } else {
      setMuted(true);
      void player
        .mute()
        .then(() => player.setVolume(0))
        .catch((error) => {
          console.error("Hero video mute error:", error);
          setMuted(false);
        });
    }
  }, [muted]);

  return (
    <HeroVideoContext.Provider
      value={{
        registerPlayer,
        setVideoVisible,
        setMuted,
        videoVisible,
        muted,
        toggleMute,
      }}
    >
      {children}
    </HeroVideoContext.Provider>
  );
}

type HeroBackgroundMediaProps = {
  posterSrc: string;
  posterAlt?: string;
};

export function HeroBackgroundMedia({
  posterSrc,
  posterAlt = "",
}: HeroBackgroundMediaProps) {
  const videoState = useContext(HeroVideoContext);
  const playerContainerId = useId().replace(/:/g, "");
  const [useVideo, setUseVideo] = useState(true);
  const videoVisible = videoState?.videoVisible ?? false;
  const registerPlayer = videoState?.registerPlayer;
  const setVideoVisible = videoState?.setVideoVisible;
  const setMuted = videoState?.setMuted;

  useEffect(() => {
    if (!useVideo || !registerPlayer || !setVideoVisible || !setMuted) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        setUseVideo(false);
        setVideoVisible(false);
        registerPlayer(null);
      }
    }, VIDEO_LOAD_TIMEOUT_MS);

    loadKinescopePlayerApi()
      .then((factory) => {
        if (cancelled) {
          return null;
        }

        return factory.create(playerContainerId, {
          url: KINESCOPE_EMBED_URL,
          size: { width: "100%", height: "100%" },
          behavior: {
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            preload: "auto",
          },
          ui: {
            controls: false,
            mainPlayButton: false,
          },
        });
      })
      .then(async (player) => {
        if (cancelled || !player) {
          return;
        }

        window.clearTimeout(timeoutId);
        registerPlayer(player);
        setVideoVisible(true);
        try {
          setMuted(await player.isMuted());
        } catch {
          setMuted(true);
        }
      })
      .catch((error) => {
        console.error("Hero video init error:", error);
        if (!cancelled) {
          window.clearTimeout(timeoutId);
          setUseVideo(false);
          setVideoVisible(false);
          registerPlayer(null);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      registerPlayer(null);
    };
  }, [
    useVideo,
    registerPlayer,
    setVideoVisible,
    setMuted,
    playerContainerId,
  ]);

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

      {useVideo && (
        <div
          id={playerContainerId}
          className={`hero-kinescope-player absolute inset-0 transition-opacity duration-700 ${
            videoVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export function HeroVolumeToggle() {
  const videoState = useContext(HeroVideoContext);

  if (!videoState?.videoVisible) {
    return null;
  }

  const { muted, toggleMute } = videoState;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleMute();
      }}
      aria-label={muted ? "Включить звук" : "Выключить звук"}
      aria-pressed={!muted}
      className="absolute bottom-6 left-[15px] z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 sm:bottom-8 sm:left-10 md:left-[60px] lg:left-20"
    >
      {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </button>
  );
}

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
      <path
        d="M23 9l-6 6M17 9l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
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
