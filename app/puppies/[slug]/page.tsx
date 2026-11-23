import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Paw } from "@/components/icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Gallery } from "@/components/puppies/Gallery";
import { Ribbon } from "@/components/puppies/Ribbon";
import { Teddy } from "@/components/teddy/Teddy";
import { gonePups } from "@/lib/data/gone";
import { allSlugs, cover, findAnyPuppy, focal, puppies, whereLabel, type Puppy } from "@/lib/data/puppies";
import { site } from "@/lib/data/site";

export const dynamicParams = false;
export const generateStaticParams = () => allSlugs().map((slug) => ({ slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findAnyPuppy((await params).slug);
  if (!p) return {};
  const title = p.name ? `${p.name}, ${p.breed} puppy` : `${p.breed} puppy`;
  return { title, description: `${title} — ${p.genderLabel.toLowerCase()}${p.age ? `, ${p.age}` : ""}. Real photos at TeddyPups U.A.E.`, openGraph: { images: [cover(p).u] } };
}

const STEPS = {
  imported: {
    title: "Coming home from abroad",
    steps: [
      ["Reserve your puppy", "Tell us which puppy has captured your heart."],
      ["Personalized consultation", "We finalize details with you and share updates on your puppy's journey."],
      ["Import and arrival", "We manage health checks, travel arrangements, and documentation."],
      ["Welcome home", "We help your new puppy settle in and ensure a smooth transition into your home."],
    ],
  },
  local: {
    title: "Coming home from our showroom",
    steps: [
      ["Say hello", "Ask us about this puppy on WhatsApp or send an enquiry."],
      ["Meet before you choose", "Visit our Downtown Dubai showroom and spend time bonding."],
      ["Health check & papers", "Every puppy is vaccinated, dewormed and comes with a health certificate."],
      ["Pick-up or delivery", "Take your puppy home the same day, or we deliver within Dubai."],
    ],
  },
} as const;

const INCLUDED = ["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"];

function Neighbours({ prev, next }: { prev: { slug: string; name: string; img: string; focal: string; alt: string }; next: { slug: string; name: string; img: string; focal: string; alt: string } }) {
  return (
    <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
      {[
        { ...prev, kicker: "Previous pup" },
        { ...next, kicker: "Next pup" },
      ].map((n) => (
        <Link
          key={n.kicker}
          href={`/puppies/${n.slug}`}
          className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
        >
          <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={n.img} alt={n.alt} loading="lazy" className="absolute inset-0 size-full object-cover" style={{ objectPosition: n.focal }} />
          </span>
          <span>
            <span className="font-scrawl block text-sm text-cocoa-soft">{n.kicker}</span>
            <span className="font-plush text-[1.6rem]">{n.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

export default async function PuppyPage({ params }: Props) {
  const { slug } = await params;
  const p = findAnyPuppy(slug);
  if (!p) notFound();
  const gone = p.status === "gone";
  const title = p.displayName;
  const c = cover(p);
  const label = p.name ? `${p.name} (${p.breed})` : p.breed;

  // previous / next within the same shelf (available or gone home), wrapping around
  const shelf: Puppy[] = gone ? gonePups.map((g) => findAnyPuppy(g.slug)!) : puppies;
  const at = shelf.findIndex((x) => x.slug === slug);
  const nb = (x: Puppy) => ({ slug: x.slug, name: x.displayName, img: cover(x).u, focal: focal(cover(x)), alt: cover(x).alt });
  const prev = nb(shelf[(at - 1 + shelf.length) % shelf.length]);
  const next = nb(shelf[(at + 1) % shelf.length]);
  const steps = STEPS[p.origin];

  return (
    <div data-page="pup">
      <article className="tp-storybook" style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${c.c} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` }}>
        <Ribbon />
        <div className="gutter mx-auto max-w-[110rem] pt-8 pb-20 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={gone ? "/gone-home" : "/puppies"}>
              {gone ? "Gone home" : "Available puppies"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{title}</span>
          </nav>
          <p className="tp-chapter mt-2">
            <span aria-hidden="true" className="tp-chapter__n font-plush">
              1
            </span>
            <span className="font-scrawl">hello, it&apos;s me</span>
          </p>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <Gallery media={p.media} name={title} />
              {p.description && <p className="font-scrawl mt-4 text-lg text-cocoa-soft">{p.description}</p>}
            </div>
            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="custom">
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <div className="absolute -top-[4.8rem] right-6 w-[9.5rem]">
                    <Teddy pose="peek" label={`Teddy, peeking over ${title}'s tag`} />
                  </div>
                  <span className="chip">
                    <Paw className="size-4 text-toffee" />
                    {gone ? "Gone home" : "Available"}
                  </span>
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{title}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{p.breed}</p>
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      ["Breed", p.breed],
                      ["Boy or girl", p.genderLabel],
                      ...(p.age ? [["Age", p.age]] : []),
                      ["Where", gone ? "Home with their family" : whereLabel(p)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      {gone ? `Find a puppy like ${title}` : `Ask about ${title} on WhatsApp`}
                    </a>
                    {gone ? (
                      <Link href="/puppies" className="btn btn-ghost">
                        See available puppies
                      </Link>
                    ) : (
                      <a href={`#enquire-${slug}`} className="btn btn-ghost">
                        Send an enquiry
                      </a>
                    )}
                  </div>
                </div>
                <div className="tp-paper mt-8 -rotate-1">
                  <p className="tp-chapter">
                    <span aria-hidden="true" className="tp-chapter__n font-plush">
                      2
                    </span>
                    <span className="font-scrawl">what comes with {title}</span>
                  </p>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {INCLUDED.map((x) => (
                      <li key={x} className="flex items-start gap-3 font-semibold">
                        <Check className="mt-0.5 size-6 shrink-0 text-toffee-deep" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <section aria-labelledby={`home-steps-${slug}`} className="mt-20">
            <p className="tp-chapter">
              <span aria-hidden="true" className="tp-chapter__n font-plush">
                3
              </span>
              <span className="font-scrawl">the way home</span>
            </p>
            <h2 id={`home-steps-${slug}`} className="font-plush text-big mt-3">
              {steps.title}
            </h2>
            <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
              {steps.steps.map(([t, d], i) => (
                <li key={t} data-reveal>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    {i + 1}
                  </span>
                  <h3 className="font-plush-text text-xl leading-tight font-bold">{t}</h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">{d}</p>
                </li>
              ))}
            </ol>
          </section>

          {!gone && (
            <section id={`enquire-${slug}`} aria-labelledby={`enquire-title-${slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
              <span aria-hidden="true" className="tp-letter__stamp">
                <Paw className="size-9" />
              </span>
              <div className="lg:col-span-4">
                <p className="tp-chapter">
                  <span aria-hidden="true" className="tp-chapter__n font-plush">
                    4
                  </span>
                  <span className="font-scrawl">dear TeddyPups…</span>
                </p>
                <h2 id={`enquire-title-${slug}`} className="font-plush text-big mt-2">
                  Ask about {title}
                </h2>
                <p className="mt-4 text-cocoa-soft">Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.</p>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <EnquiryForm puppyId={p.id} puppyLabel={label} />
              </div>
            </section>
          )}

          <Neighbours prev={prev} next={next} />
        </div>
      </article>
    </div>
  );
}
