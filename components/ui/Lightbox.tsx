"use client";

import { useCallback, useEffect, useRef } from "react";
import { responsive } from "@/lib/img";

export type Slide = { src: string; alt: string; kind?: "image" | "video"; poster?: string; caption?: string };

/**
 * Full-screen photo/video viewer built on the native <dialog> element
 * (free focus trap, Esc to close, backdrop). Arrow keys and swipe navigate.
 */
export function Lightbox({
  slides,
  index,
  onIndex,
  onClose,
  label = "Photo viewer",
}: {
  slides: Slide[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onIndex((index + dir + slides.length) % slides.length);
    },
    [index, onIndex, slides.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const s = index !== null ? slides[index] : null;

  return (
    <dialog
      ref={ref}
      className="tp-viewer"
      aria-label={label}
      data-lenis-prevent
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <span className="font-scrawl text-lg text-honey">
          {index !== null ? `${index + 1} / ${slides.length}` : ""}
        </span>
        <button type="button" className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa" onClick={onClose} autoFocus>
          Close
        </button>
      </div>
      <div className="tp-viewer__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {s &&
          (s.kind === "video" ? (
            <video key={s.src} src={s.src} poster={s.poster} controls autoPlay playsInline aria-label={s.alt} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} {...responsive(s.src, "100vw")} alt={s.alt} />
          ))}
      </div>
      <div className="flex items-center justify-center gap-6 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button type="button" className="tp-viewer__btn" aria-label="Previous" onClick={() => go(-1)}>
          ‹
        </button>
        {s?.caption ? <p className="font-scrawl max-w-[30ch] text-center text-milk/85">{s.caption}</p> : null}
        <button type="button" className="tp-viewer__btn" aria-label="Next" onClick={() => go(1)}>
          ›
        </button>
      </div>
    </dialog>
  );
}
