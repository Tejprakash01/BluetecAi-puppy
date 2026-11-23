import Link from "next/link";
import { Skyline } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { showroom } from "@/lib/data/site";
import { Flight } from "./Flight";

/** "Two ways to meet your puppy" — a signpost pointing to the showroom and to imports. */
export function TwoWays() {
  return (
    <section
      className="tp-scene tp-paths"
      data-tone="light"
      style={{ "--sky-top": "#fbe3b4", "--sky-bottom": "#f7d18d" } as React.CSSProperties}
      aria-labelledby="paths-title"
    >
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
          Two ways to meet your puppy
        </h2>
        <div className="tp-fork">
          <div aria-hidden="true" className="tp-fork__post" />
          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
              Puppies in Dubai
            </h3>
            <div className="tp-way__scene">
              <Skyline className="tp-way__skyline" />
              <figure className="tp-window">
                <span className="tp-window__glass">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={showroom.photos[0].src} alt={showroom.photos[0].alt} loading="lazy" />
                </span>
                <figcaption className="font-scrawl">In our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
            <Link className="btn btn-primary" href="/puppies?origin=local">
              Meet local puppies
            </Link>
          </article>
          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
              Imported for you
            </h3>
            <div className="tp-way__scene">
              <Flight />
            </div>
            <p className="tp-way__text">
              Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable breeders and let us handle the import.
            </p>
            <Link className="btn btn-primary" href="/puppies?origin=imported">
              See imported puppies
            </Link>
          </article>
          <div className="tp-fork__teddy tp-hide-sm">
            <Teddy pose="sit" />
          </div>
        </div>
      </div>
    </section>
  );
}
