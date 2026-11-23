"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Paw } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { puppies } from "@/lib/data/puppies";
import { site } from "@/lib/data/site";
import { useEnquiry } from "./useEnquiry";

type Phase = "writing" | "sealing" | "posting" | "sent";

/**
 * The contact form written as a fill-in-the-blanks letter.
 * On submit the letter folds up, drops into an envelope, the envelope is posted
 * into a postbox, and a thank-you card appears.
 */
export function LetterForm() {
  const { status, errors, submit } = useEnquiry();
  const [phase, setPhase] = useState<Phase>("writing");
  const sentRef = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const noteId = useId();

  useEffect(() => {
    if (phase === "sent") sentRef.current?.focus();
  }, [phase]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const ok = await submit(form);
    if (!ok) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setPhase("sent");
    setPhase("sealing");
    setTimeout(() => setPhase("posting"), 900);
    setTimeout(() => setPhase("sent"), 1900);
  };

  const errList = Object.values(errors);

  if (phase === "sent") {
    return (
      <div ref={sentRef} className="tp-post__sent" role="status" tabIndex={-1}>
        <Postbox className="mx-auto w-36" flagUp />
        <p className="font-plush mt-4 text-[2.2rem]">Letter posted! 💌</p>
        <p className="mx-auto mt-2 max-w-[38ch]">Thank you — our team will get back to you very soon. For the quickest reply, say hello on WhatsApp.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            WhatsApp us
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => setPhase("writing")}>
            Write another letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tp-post" data-phase={phase}>
        <form noValidate className="tp-letterform" onSubmit={onSubmit}>
          <span aria-hidden="true" className="tp-letter__stamp">
            <Paw className="size-9" />
          </span>
          <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
          <p className="tp-letterform__line">
            my name is{" "}
            <span className="tp-blank" style={{ "--size": "16ch" } as React.CSSProperties}>
              <input aria-label="Your name (required)" autoComplete="name" required minLength={2} maxLength={80} name="name" aria-invalid={!!errors.name} />
            </span>
            , and you can reach me on{" "}
            <span className="tp-blank" style={{ "--size": "15ch" } as React.CSSProperties}>
              <input aria-label="Phone or WhatsApp number with country code (required)" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+971 50 123 4567" name="phone" aria-invalid={!!errors.phone} />
            </span>{" "}
            or by email at{" "}
            <span className="tp-blank" style={{ "--size": "20ch" } as React.CSSProperties}>
              <input aria-label="Email (optional)" type="email" autoComplete="email" placeholder="optional" name="email" aria-invalid={!!errors.email} />
            </span>
            .
          </p>
          <p className="tp-letterform__line">
            I live in{" "}
            <span className="tp-blank" style={{ "--size": "13ch" } as React.CSSProperties}>
              <input aria-label="Your area (optional)" autoComplete="address-level2" maxLength={80} placeholder="e.g. Dubai Marina" name="area" />
            </span>
            , and I&apos;m curious about{" "}
            <span className="tp-blank tp-blank--select">
              <label htmlFor={selectId} className="sr-only">
                Puppy you&apos;re interested in (optional)
              </label>
              <select id={selectId} name="puppyId" defaultValue="">
                <option value="">any puppy (not sure yet)</option>
                {puppies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name ? `${p.name} (${p.breed}, ${p.genderLabel.toLowerCase()})` : `${p.breed} (${p.genderLabel.toLowerCase()})`}
                  </option>
                ))}
              </select>
            </span>
            .
          </p>
          <label htmlFor={noteId} className="sr-only">
            Your message (optional)
          </label>
          <textarea id={noteId} name="message" rows={4} maxLength={2000} placeholder="Anything else you'd like to tell us…" className="tp-letterform__note" />
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
            </label>
          </div>
          {(errList.length > 0 || status === "error") && (
            <div className="tp-letterform__alert" role="alert">
              <p className="font-semibold">{errList.length ? "Almost there — a couple of blanks need filling:" : "Something went wrong sending your letter. Please try again."}</p>
              {errList.length > 0 && (
                <ul>
                  {errList.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="tp-letterform__sign">
            <p className="font-scrawl">with love, a future puppy parent</p>
            <button type="submit" className="btn btn-primary disabled:opacity-70" disabled={status === "sending" || phase !== "writing"}>
              {status === "sending" ? "Sealing…" : "Post my letter"}
            </button>
          </div>
        </form>
        {phase !== "writing" && (
          <div className="tp-post__scene" aria-hidden="true">
            <svg viewBox="0 0 160 110" className="tp-post__envelope">
              <rect x="4" y="16" width="152" height="90" rx="8" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
              <path d="M6 22l74 50 74-50" fill="none" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
              <path className="tp-post__flap" d="M6 20h148L80 66z" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="80" cy="62" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
            </svg>
            <Postbox className="tp-post__box" />
          </div>
        )}
      </div>
      <div className="mr-6 ml-auto -mt-3 w-36 md:w-40">
        <Teddy pose="sit" facing="left" bubble={phase === "posting" ? "posted!" : null} />
      </div>
    </>
  );
}

function Postbox({ className, flagUp }: { className?: string; flagUp?: boolean }) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true">
      <rect x="70" y="120" width="20" height="78" fill="#7a4a2e" stroke="#2a170e" strokeWidth="4" />
      <path d="M14 70a66 50 0 0 1 132 0v60H14z" fill="#c2622b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <rect x="44" y="76" width="72" height="10" rx="5" fill="#2a170e" />
      <path d={flagUp ? "M146 64V24h26v18h-26" : "M146 92h40v14h-40"} fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <text x="80" y="116" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="15" fill="#fffdf8">
        TeddyPups
      </text>
    </svg>
  );
}
