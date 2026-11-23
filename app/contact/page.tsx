import type { Metadata } from "next";
import { LetterForm } from "@/components/forms/LetterForm";
import { Paw, Skyline } from "@/components/icons";
import { showroom, site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit the TeddyPups showroom in Downtown Dubai, call, WhatsApp or write to us.",
};

export default function ContactPage() {
  const photo = showroom.photos[3];
  return (
    <div data-page="contact">
      <section className="tp-scene" data-tone="light" style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" } as React.CSSProperties} aria-labelledby="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm />
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {site.phoneDisplay}
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={site.phoneHref}>
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 text-lg font-semibold break-all">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Skyline className="absolute right-0 -bottom-1 w-3/4 text-toffee/30" />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Paw className="size-5 shrink-0 text-toffee-deep" />
                      {site.address}
                    </p>
                    <a href="https://www.google.com/maps/search/?api=1&query=Downtown+Dubai" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt={photo.alt} loading="lazy" style={{ objectPosition: "45.3% 44.4%" }} />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
