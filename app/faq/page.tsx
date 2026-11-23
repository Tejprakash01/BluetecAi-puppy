import type { Metadata } from "next";
import { NotesBoard } from "@/components/faq/NotesBoard";
import { faqs } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "Vaccinations, imports, delivery, breeds — answers to the questions families ask TeddyPups most.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div data-page="faq">
      <section className="tp-scene tp-faqroom overflow-hidden" data-tone="dark" style={{ "--sky-top": "#a95e32", "--sky-bottom": "#331c11" } as React.CSSProperties} aria-labelledby="faq-title">
        <div className="gutter relative mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.</p>
          </header>
          <div className="mt-12 md:mt-16">
            <NotesBoard />
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
