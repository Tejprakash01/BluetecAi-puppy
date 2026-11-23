import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { gonePups } from "@/lib/data/gone";
import { responsive } from "@/lib/img";

export const metadata: Metadata = {
  title: "Gone home",
  description: "Puppies that have already joined loving families through TeddyPups U.A.E.",
};

const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8];

export default function GoneHomePage() {
  return (
    <div data-page="gone">
      <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <Heart className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we&apos;ll help you find your match.
            </p>
            <Link className="btn btn-primary mt-8" href="/puppies">
              See available puppies
            </Link>
          </div>
          <div aria-hidden="true" className="tp-booth">
            <div className="tp-booth__teddy">
              <Teddy pose="peek" />
            </div>
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>
        <ul className="tp-tickets" aria-label="Puppies who have gone home">
          {gonePups.map((g, i) => (
            <li key={g.slug} className="tp-ticket" data-reveal="custom" style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, "--i": i % 6 } as React.CSSProperties}>
              <Link href={`/puppies/${g.slug}`} className="tp-ticket__link">
                <span className="tp-ticket__main">
                  <span className="tp-ticket__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...responsive(g.image, "7rem", 384)} alt={g.alt} loading="lazy" style={{ objectPosition: g.focal, backgroundColor: "#f8e8e8" }} />
                  </span>
                  <span className="tp-ticket__body">
                    <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
                    <span className="font-plush tp-ticket__name">{g.name}</span>
                    <span className="tp-ticket__meta">{g.meta}</span>
                    <span className="tp-ticket__route">
                      <span>TeddyPups</span>
                      <svg viewBox="0 0 60 12" aria-hidden="true">
                        <path d="M2 6h46" />
                        <path d="M44 2l6 4-6 4" />
                      </svg>
                      <span>home ♥</span>
                    </span>
                  </span>
                </span>
                <span aria-hidden="true" className="tp-ticket__stub">
                  <span className="font-plush">admit one</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
