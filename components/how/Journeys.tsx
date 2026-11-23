"use client";

import { useRef, useState } from "react";
import { Skyline } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";

const SW = { fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="21" cy="21" r="12" {...SW} />
      <path d="m30 30 10 10" {...SW} />
      <path d="M21 27c-3-2-4.4-3.6-4.4-5.2a2.2 2.2 0 0 1 4.4-.4 2.2 2.2 0 0 1 4.4.4c0 1.6-1.4 3.2-4.4 5.2z" fill="currentColor" />
    </>
  ),
  heart: (
    <>
      <path d="M24 40C11 31 6 24.5 6 17.8 6 12.4 10.2 8 15.4 8c3.7 0 6.8 2.1 8.6 5.3C25.8 10.1 28.9 8 32.6 8 37.8 8 42 12.4 42 17.8 42 24.5 37 31 24 40z" {...SW} />
      <path d="m17 22 5 5 9-10" {...SW} />
    </>
  ),
  pup: (
    <>
      <path d="M14 18c-3-6-1-10 3-10s5 4 4 8M34 18c3-6 1-10-3-10s-5 4-4 8" {...SW} />
      <ellipse cx="24" cy="27" rx="13" ry="12" {...SW} />
      <circle cx="19.5" cy="25" r="1.6" fill="currentColor" />
      <circle cx="28.5" cy="25" r="1.6" fill="currentColor" />
      <path d="M22 31h4l-2 2z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  van: (
    <>
      <path d="M5 30V18h22v12M27 22h8l6 6v2H27" {...SW} />
      <path d="M5 30h36" {...SW} />
      <circle cx="13" cy="33" r="3.4" {...SW} />
      <circle cx="34" cy="33" r="3.4" {...SW} />
      <path d="M16 26c-2.3-1.6-3.4-2.8-3.4-4a1.7 1.7 0 0 1 3.4-.4 1.7 1.7 0 0 1 3.4.4c0 1.2-1.1 2.4-3.4 4z" fill="currentColor" />
    </>
  ),
  calendar: (
    <>
      <rect x="7" y="10" width="34" height="30" rx="5" {...SW} />
      <path d="M7 19h34M16 6v8M32 6v8" {...SW} />
      <path d="m17 29 5 5 9-9" {...SW} />
    </>
  ),
  chat: (
    <>
      <path d="M6 12a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-9l-6 5v-5h-1a5 5 0 0 1-5-5z" {...SW} />
      <path d="M36 17h1a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-1v5l-6-5h-6a5 5 0 0 1-4-2" {...SW} />
    </>
  ),
  plane: <path transform="matrix(-1 0 0 1 48 0)" d="M4 27l13-1.5 8-10h4l-4 9.5 9-.8 4-4.7h3l-2 6.6 2 6.6h-3l-4-4.7-9-.8 4 9.5h-4l-8-10L4 29z" {...SW} />,
  home: (
    <>
      <path d="M6 23 24 8l18 15M11 19v21h26V19" {...SW} />
      <path d="M24 35c-4.6-3.2-6.8-5.7-6.8-8.2a3.4 3.4 0 0 1 6.8-.8 3.4 3.4 0 0 1 6.8.8c0 2.5-2.2 5-6.8 8.2z" fill="currentColor" />
    </>
  ),
};

const TINTS = ["#fbe3b4", "#fde6de", "#e3f0fb", "#e6f2df"];

const JOURNEYS = [
  {
    id: "local",
    label: "In Dubai",
    hint: "meet in person",
    title: "Meet your puppy in person",
    lede: "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    steps: [
      ["search", "Explore our puppies", "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information."],
      ["heart", "Choose your puppy", "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions."],
      ["pup", "Meet before you choose", "Spend time bonding before making your decision."],
      ["van", "Pick-up or delivery", "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably."],
    ],
  },
  {
    id: "imported",
    label: "Imported",
    hint: "order upon request",
    title: "Order upon request",
    lede: "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    note: "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    steps: [
      ["calendar", "Reserve your puppy", "Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences."],
      ["chat", "Personalized consultation", "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey."],
      ["plane", "Import and arrival", "We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family."],
      ["home", "Welcome home", "Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home."],
    ],
  },
] as const;

/** "Two ways home" — an accessible tablist switch between the local and imported journeys. */
export function Journeys() {
  const [at, setAt] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (at + (e.key === "ArrowRight" ? 1 : -1) + JOURNEYS.length) % JOURNEYS.length;
    setAt(n);
    tabs.current[n]?.focus();
  };

  return (
    <section className="tp-journeys" aria-labelledby="two-ways-title">
      <div className="tp-journeys__top">
        <div>
          <p className="font-scrawl tp-journeys__kicker">choose your way</p>
          <h2 id="two-ways-title" className="font-plush text-big">
            Two ways home
          </h2>
        </div>
        <div className="tp-journeys__pick">
          <div role="tablist" aria-label="Ways to bring your puppy home" className="tp-switch" style={{ "--at": at, "--n": JOURNEYS.length } as React.CSSProperties} onKeyDown={onKey}>
            <span aria-hidden="true" className="tp-switch__thumb" />
            {JOURNEYS.map((j, i) => (
              <button
                key={j.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${j.id}`}
                aria-selected={at === i}
                aria-controls={`panel-${j.id}`}
                tabIndex={at === i ? 0 : -1}
                className="tp-switch__tab"
                onClick={() => setAt(i)}
              >
                <span className="font-plush tp-switch__label">{j.label}</span>
                <span className="tp-switch__hint">{j.hint}</span>
              </button>
            ))}
          </div>
          <div className="tp-journeys__teddy">
            <Teddy pose="sit" facing={at === 0 ? "right" : "left"} />
          </div>
        </div>
      </div>
      {JOURNEYS.map((j, i) => (
        <div key={j.id} role="tabpanel" id={`panel-${j.id}`} aria-labelledby={`tab-${j.id}`} className="tp-journey" hidden={at !== i}>
          <div className="tp-journey__head">
            <div>
              <h3 className="font-plush tp-journey__title">{j.title}</h3>
              <p className="text-lede mt-4 text-[var(--ink-soft)]">{j.lede}</p>
              {"note" in j && <p className="font-scrawl mt-4 text-toffee-ink">{j.note}</p>}
            </div>
            {j.id === "local" ? (
              <div aria-hidden="true" className="tp-postcard">
                <span className="tp-postcard__sun" />
                <Skyline className="tp-postcard__city" />
                <span className="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span>
              </div>
            ) : (
              <div aria-hidden="true" className="tp-postcard tp-postcard--sky">
                <svg viewBox="0 0 320 150" className="tp-postcard__route" preserveAspectRatio="none">
                  <path d="M28 128C90 20 230 20 292 118" />
                </svg>
                <svg viewBox="0 0 64 40" className="tp-postcard__plane" aria-hidden="true">
                  <path d="M4 22l20-2 12-14h6l-6 14 14-1 6-7h4l-3 10 3 10h-4l-6-7-14-1 6 14h-6L24 24 4 22z" fill="#fffdf8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-scrawl tp-postcard__from">Europe · Korea</span>
                <span className="font-scrawl tp-postcard__to">Dubai</span>
              </div>
            )}
          </div>
          <ol className="tp-steps" key={`${j.id}-${at}`}>
            {j.steps.map(([icon, title, text], k) => (
              <li key={title} className="tp-step" style={{ "--i": k, "--tint": TINTS[k] } as React.CSSProperties}>
                <span aria-hidden="true" className="tp-step__icon">
                  <svg viewBox="0 0 48 48">{ICONS[icon]}</svg>
                </span>
                <span className="tp-step__num font-plush">Step {k + 1}</span>
                <h4 className="font-plush-text tp-step__title">{title}</h4>
                <p className="tp-step__text">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
