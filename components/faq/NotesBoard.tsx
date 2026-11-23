"use client";

import { useId, useMemo, useState } from "react";
import { Teddy } from "@/components/teddy/Teddy";
import { faqs } from "@/lib/data/faq";
import { site } from "@/lib/data/site";

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PINS = ["var(--color-toffee)", "var(--color-sky-deep)", "#1f6b45", "var(--color-honey)"];

/** Wrap matches of the search query in <mark>. */
function highlight(text: string, q: string) {
  if (!q) return text;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${safe})`, "ig")).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

/** FAQ as notes pinned to a cork board: searchable, each note unfolds like paper. */
export function NotesBoard() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const inputId = useId();
  const query = q.trim().toLowerCase();

  const list = useMemo(
    () => faqs.map((f, i) => ({ ...f, i })).filter((f) => !query || (f.q + " " + f.a).toLowerCase().includes(query)),
    [query],
  );

  return (
    <div className="tp-notes" data-open={open !== null ? "" : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={inputId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input id={inputId} type="search" placeholder="delivery, Korea, vaccinated…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {list.length === 1 ? "1 note on the board" : `${list.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <Teddy pose="sit" />
        </div>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>
      <div className="tp-notes__board">
        <ul className="tp-notes__list">
          {list.map((f, k) => {
            const unfolded = open === f.i || (!!query && list.length <= 2);
            return (
              <li
                key={f.q}
                className="tp-note"
                data-reveal="custom"
                data-unfolded={unfolded ? "" : undefined}
                style={{ "--tilt": `${TILTS[f.i % TILTS.length]}deg`, "--pin": PINS[f.i % PINS.length], "--i": k } as React.CSSProperties}
              >
                <span aria-hidden="true" className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button type="button" id={`q-${f.i}`} aria-expanded={unfolded} aria-controls={`a-${f.i}`} onClick={() => setOpen(open === f.i ? null : f.i)}>
                    <span className="font-plush-text">{highlight(f.q, query)}</span>
                    <span aria-hidden="true" className="tp-note__chevron" />
                  </button>
                </h2>
                <div id={`a-${f.i}`} role="region" aria-labelledby={`q-${f.i}`} className="tp-note__answer" inert={!unfolded}>
                  <div className="tp-note__flap">
                    <p>{highlight(f.a, query)}</p>
                  </div>
                </div>
              </li>
            );
          })}
          {!list.length && (
            <li className="tp-note tp-note--empty" style={{ "--tilt": "-1deg" } as React.CSSProperties}>
              <p className="font-plush-text text-xl font-bold">No notes match “{q}”.</p>
              <p className="mt-2 text-cocoa-soft">Try another word — or ask us directly on WhatsApp, we reply 24/7.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
