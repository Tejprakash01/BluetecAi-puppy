import Link from "next/link";
import { Star } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { Stars } from "@/components/ui/Stars";
import { faqs } from "@/lib/data/faq";

/** "Questions, answered" under the night sky — the first three FAQs. */
export function Questions() {
  return (
    <section
      className="tp-scene tp-night"
      data-tone="dark"
      style={{ "--sky-top": "#4d2b19", "--sky-bottom": "#2f1a10" } as React.CSSProperties}
      aria-labelledby="questions-title"
    >
      <Stars seed="night" count={11} />
      <div className="tp-night__grid gutter">
        <div>
          <h2 id="questions-title" className="font-plush text-huge">
            Questions, answered
          </h2>
          <Link className="btn btn-ghost tp-night__cta" href="/faq">
            Read all questions
          </Link>
          <div className="tp-night__pup tp-hide-sm">
            <span aria-hidden="true" className="tp-night__wonder font-plush">
              ?
            </span>
            <Teddy pose="sit" />
          </div>
        </div>
        <dl className="tp-night__list">
          {faqs.slice(0, 3).map((f) => (
            <div key={f.q} className="tp-qa" data-reveal>
              <dt className="font-plush tp-qa__q">
                <Star className="tp-qa__star" />
                {f.q}
              </dt>
              <dd className="tp-qa__a">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
