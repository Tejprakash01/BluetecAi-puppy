import { Star } from "@/components/icons";
import { seeded, hash } from "@/lib/random";

/** A scatter of twinkling stars, positioned deterministically from a seed. */
export function Stars({ seed, count = 11, className = "" }: { seed: string; count?: number; className?: string }) {
  const rnd = seeded(hash(seed));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const size = 0.55 + rnd() * 0.75;
        return (
          <Star
            key={i}
            className="tp-twinkle absolute text-honey"
            style={{
              left: `${(rnd() * 96).toFixed(1)}%`,
              top: `${(rnd() * 88).toFixed(1)}%`,
              width: `${size.toFixed(2)}rem`,
              animationDelay: `${(rnd() * 3).toFixed(2)}s`,
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
