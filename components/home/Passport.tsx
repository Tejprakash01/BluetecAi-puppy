import { StampIcon } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { SunsetHorizon } from "./SunsetHorizon";

export const TRUST = [
  { kind: "health", shape: "round", ink: "#a24a1a", tilt: -8, title: "Vet-checked & healthy", text: "Every puppy comes vaccinated, dewormed, and with a verified health certificate." },
  { kind: "plane", shape: "ticket", ink: "#1f6b45", tilt: 5, title: "Korea to Dubai, safely", text: "Trusted breeders, safe travel, and premium care from start to finish." },
  { kind: "chat", shape: "oval", ink: "#5a3a28", tilt: -4, title: "Support 24/7", text: "Always here to help, from choosing your puppy to post-delivery support." },
  { kind: "globe", shape: "scallop", ink: "#c2622b", tilt: 7, title: "Trusted by families worldwide", text: "Puppies delivered to loving homes all around the world." },
] as const;

export type StampEntry = { kind: "health" | "plane" | "chat" | "globe"; shape: string; ink: string; tilt: number; title: string; text: string };

export function StampList({ items, className }: { items: readonly StampEntry[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((e, i) => (
        <li key={e.title} className="tp-entry" data-reveal="custom" style={{ "--ink-stamp": e.ink, "--tilt": `${e.tilt}deg`, "--i": i } as React.CSSProperties}>
          <span className={`tp-stamp tp-stamp--${e.shape}`}>
            <StampIcon kind={e.kind} className="tp-stamp__icon" />
            <span className="tp-stamp__title font-plush">{e.title}</span>
          </span>
          <p className="tp-entry__text">{e.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** "Why families trust TeddyPups" — a puppy passport with inked stamps, then the sun sets. */
export function Passport() {
  return (
    <section
      className="tp-scene tp-passport"
      data-tone="light"
      style={{ "--sky-top": "#f0b866", "--sky-bottom": "#a65a30" } as React.CSSProperties}
      aria-labelledby="trust-title"
    >
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden="true" className="tp-book__kicker font-scrawl">
              puppy passport
            </p>
            <h2 id="trust-title" className="font-plush tp-book__title">
              Why families trust TeddyPups
            </h2>
            <div className="tp-book__teddy tp-hide-sm">
              <Teddy pose="sit" />
            </div>
          </div>
          <StampList items={TRUST} className="tp-book__page tp-book__page--right" />
        </div>
      </div>
      <SunsetHorizon />
    </section>
  );
}
