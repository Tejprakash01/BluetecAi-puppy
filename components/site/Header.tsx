"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Paw } from "@/components/icons";
import { nav, site } from "@/lib/data/site";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const home = pathname === "/";

  // Solid background once scrolled; hide while scrolling down, reveal on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHidden(false);
    closeMenu(true);
  }, [pathname]);

  const openMenu = () => menuRef.current?.showModal();
  function closeMenu(instant = false) {
    const d = menuRef.current;
    if (!d?.open) return;
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    d.setAttribute("data-closing", "");
    setTimeout(() => {
      d.removeAttribute("data-closing");
      d.close();
    }, 400);
  }

  return (
    <header
      id="site-header"
      className="tp-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-home={home ? "true" : undefined}
    >
      <div className="tp-header__bar gutter">
        <Link href="/" className="tp-header__brand" aria-label={`${site.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={56} height={56} className="tp-header__logo" />
          <span className="font-plush tp-header__name">{site.short}</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {nav.map((n) => {
              const active = isActive(pathname, n.href);
              return (
                <li key={n.href}>
                  <Link href={n.href} className="tp-nav-link" data-active={active} aria-current={active ? "page" : undefined}>
                    <span>{n.label}</span>
                    <Paw className="tp-nav-link__paw" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">
            WhatsApp us
          </a>
          <button type="button" className="tp-header__menu-btn" aria-haspopup="dialog" onClick={openMenu}>
            <Paw className="size-4" />
            Menu
          </button>
          <dialog ref={menuRef} aria-label="Site menu" className="tp-menu" data-lenis-prevent onClick={(e) => e.target === e.currentTarget && closeMenu()}>
            <div className="gutter flex h-full flex-col pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button type="button" className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk" onClick={() => closeMenu()}>
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {nav.map((n) => {
                    const active = isActive(pathname, n.href);
                    return (
                      <li key={n.href}>
                        <Link href={n.href} className="tp-menu-link font-plush" data-active={active} aria-current={active ? "page" : undefined} onClick={() => closeMenu(true)}>
                          {n.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="space-y-3">
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{site.phoneDisplay}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
