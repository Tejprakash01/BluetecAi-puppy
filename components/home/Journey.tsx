"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { PAW_PATH } from "@/components/icons";
import { site, showroom } from "@/lib/data/site";
import { opt, responsive } from "@/lib/img";

const STEPS = [
  { title: "Choose your breed", text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle." },
  { title: "Get photos & details", text: "Our team will share real photos, health details, and all necessary information directly on WhatsApp." },
  { title: "Secure & safe delivery", text: "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free." },
];

const CHIPS = [
  ["maltipoo", "Maltipoo"],
  ["pomeranian", "Pomeranian"],
  ["poodle", "Poodle"],
  ["cavapoo", "Cavapoo"],
  ["shih-tzu", "Shih Tzu"],
];

const BUBBLES = ["which one?", "ooh, photos!", "coming home!"];

/**
 * "Your puppy journey": three steps on the left, a sticky phone on the right.
 * As each step scrolls into focus, TeddyPups "types" and the matching WhatsApp
 * messages appear in the chat.
 */
export function Journey() {
  const [active, setActive] = useState(-1);
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // reveal messages with a short "typing…" beat
  useEffect(() => {
    if (active <= shown) return;
    setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      setShown(active);
    }, 650);
    return () => clearTimeout(t);
  }, [active, shown]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      className="tp-scene tp-chat"
      data-tone="light"
      style={{ "--sky-top": "#f7d18d", "--sky-bottom": "#f0b866" } as React.CSSProperties}
      aria-labelledby="journey-title"
    >
      <div className="tp-chat__grid gutter">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">
            Your puppy journey
          </h2>
          <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
          </p>
          <ol className="tp-chat__steps">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                className="tp-chat__step"
                data-active={active === i ? "true" : undefined}
                data-done={active > i ? "true" : undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link className="btn btn-ghost tp-chat__cta" href="/how-it-works">
            How it works
          </Link>
        </div>

        <div className="tp-chat__side">
          <div className="tp-phone" aria-label={`A WhatsApp conversation with ${site.name}`} role="group">
            <div className="tp-phone__bar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" width={40} height={40} className="tp-phone__avatar" src={site.logo} />
              <span>
                <span className="tp-phone__name">{site.name}</span>
                <span className="tp-phone__status">{typing ? "typing…" : "online"}</span>
              </span>
            </div>
            <div className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">Hi TeddyPups! I&apos;d love to know more about your puppies.</p>
              <div className="tp-msg-group" data-show={shown >= 0}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[0].text}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {CHIPS.map(([slug, label]) => (
                      <li key={slug}>
                        <Link href={`/puppies?breed=${slug}`}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="tp-msg-group" data-show={shown >= 1}>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-snaps">
                    {showroom.photos.map((ph) => (
                      <span key={ph.src} className="tp-snaps__one">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img {...responsive(ph.src, "6rem", 256)} alt={ph.alt} loading="lazy" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-clip">
                    <video
                      ref={videoRef}
                      src={showroom.video}
                      poster={opt(showroom.photos[0].src, 384)}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"
                    />
                    <button type="button" className="tp-clip__play" aria-pressed={playing} aria-label={playing ? "Pause video" : "Play video"} onClick={toggleVideo}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="tp-msg tp-msg--them">{STEPS[1].text}</p>
              </div>
              <div className="tp-msg-group" data-show={shown >= 2}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[2].text}</p>
                  <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                    <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                    <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                    <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                    <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                    <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                    <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                  </svg>
                </div>
              </div>
              <p className="tp-typing" data-show={typing} aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </div>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </a>
          </div>
          <div className="tp-chat__teddy tp-hide-sm">
            <Teddy pose="sit" bubble={shown >= 0 && !typing ? BUBBLES[Math.min(shown, 2)] : null} />
          </div>
        </div>
      </div>
    </section>
  );
}
