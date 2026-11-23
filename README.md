# TeddyPups U.A.E. — website clone

A full clone of **[puppy.instabizweb.com](https://puppy.instabizweb.com/)**: an illustrated, scroll-driven "storybook" website for a teacup-puppy boutique in Dubai. It covers every page, the responsive layouts, the animated mascot and the interactive features.

> Built as a front-end assignment. All brand copy, puppy photos and videos belong to the original site and are used for educational purposes only. The code is my own re-implementation.

**Live demo:** _add your Vercel URL here_

---

## What's included

| Route | What it does |
| --- | --- |
| `/` | One long "day to night" story told in 8 scenes. The **hero** has puppies peeking over a quilt and playing peekaboo. **Meet the pups** is a pinned hallway of doors that scrolls sideways while Teddy walks along and opens each door. Then come a **signpost** with a plane that flies along its route as you scroll, a **WhatsApp chat** that types itself as you read the steps, a **puppy passport** with inked stamps and a sunset skyline, a **photo wall** at dusk with a lightbox, **FAQs** under a starry night, and a **front door** that swings open. |
| `/puppies` | Teddy's sketchbook: hand-inked cards that draw themselves. Filters for where, breed and boy/girl are kept in the URL, so links like `/puppies?breed=poodle` arrive pre-filtered and can be shared. There is an empty state, plus a "gone home" strip. |
| `/puppies/[slug]` | 42 statically generated puppy pages (15 available, 27 gone home). Each has a storybook gallery with thumbnails, video and a full-screen viewer, a swinging name tag, a "the way home" paw trail, an enquiry form (client and server validation) and previous/next pups. |
| `/gone-home` | Every adopted puppy shown as a "ticket home" that unrolls as it scrolls in. |
| `/happy-families` | A masonry wall of 64 polaroids that bounce in and get a paw "pat". Click any one to open a lightbox (keyboard and swipe work). |
| `/how-it-works` | An accessible tab switch between the "In Dubai" and "Imported" journeys, then postcards, stamps, a delivery section with the flight animation, and why choose us. |
| `/faq` | Notes pinned to a cork board. Live search highlights matches, and each note unfolds like paper. FAQPage JSON-LD is included. |
| `/contact` | A fill-in-the-blanks letter. On submit it folds up, goes into an envelope and is posted into a postbox, then a thank-you card appears. |
| `404` | A "lost puppy" poster with tear-off tabs that link back into the site. |
| `/api/enquiry` | A route handler that validates enquiries on the server, with a honeypot field to catch spam bots. |

Site-wide features:
- **Page-transition curtain:** a quilted blanket covers the page while Teddy runs across it, then lifts away. It also plays on first load.
- **Lenis smooth scrolling**
- **Header behaviour:** the header turns solid once you scroll, hides while you scroll down and comes back when you scroll up. An animated paw marks the active link.
- **Mobile menu:** built on the native `<dialog>` and opens with a circular reveal. Phones also get a sticky WhatsApp/Call bar.
- **Custom paw cursor**
- **Reduced motion:** `prefers-reduced-motion` is respected everywhere.

## Tech stack

- **Next.js 16** (App Router, React Server Components, static generation, route handler), **React 19**, **TypeScript**
- **Tailwind CSS v4** for layout utilities and design tokens (`@theme`), plus hand-written component CSS in `app/styles/*`
- **Lenis** for smooth scrolling
- **Fontsource** variable fonts, self-hosted: Fraunces (with its SOFT, WONK and opsz axes), Figtree and Shantell Sans
- No animation library. Everything is CSS transitions/keyframes, SMIL `<animateTransform>` for the mascot's legs, and small `requestAnimationFrame` scroll handlers.

## Project structure

```
app/
  layout.tsx              header, footer, curtain, smooth scroll, reveal observer
  page.tsx                home: 8 scene components
  puppies/                list + [slug] detail (generateStaticParams)
  gone-home/ happy-families/ how-it-works/ faq/ contact/
  api/enquiry/route.ts    form endpoint
  not-found.tsx
  globals.css             Tailwind + theme tokens
  styles/                 base.css · chrome.css · home.css · pages.css
components/
  teddy/Teddy.tsx         the rigged SVG mascot (poses: sit, walk, stand, peek, snug, bow)
  home/                   Hero, MeetThePups, TwoWays, Flight, Journey, Passport, SunsetHorizon, Families, Questions, WelcomeHome
  puppies/                PuppyBrowser (filters), SketchCard, Gallery, Ribbon
  site/                   Header, Footer, RouteCurtain, SmoothScroll
  forms/                  EnquiryForm, LetterForm, useEnquiry
  faq/ how/ families/ ui/ icons/
lib/
  data/                   puppies.json, gone.ts, families.ts, faq.ts, site.ts (all content)
  random.ts               seeded RNG + blob-path generator for the hand-drawn shapes
  validate.ts             shared enquiry validation
scripts/fetch-assets.mjs  downloads the photos/videos into /public
```

## Running locally

```bash
npm install
npm run assets   # one-off: downloads ~160 photos and videos into public/media (skips files you already have)
npm run dev      # http://localhost:3000
```

You can skip `npm run assets`. `next.config.ts` has a **fallback rewrite**: any `/media/*` file that isn't in `public/` is proxied from the original site, so the clone still works without the download.

```bash
npm run build && npm start   # production build (prebuild runs the asset script automatically)
npm run typecheck
```

## Deploying (Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo and keep the defaults (framework: Next.js). Click **Deploy**.
3. The `prebuild` step downloads the media during the build, so the deployed site serves every image from its own domain.
4. Optional: set `NEXT_PUBLIC_SITE_URL` to your production URL so Open Graph links are absolute.

## Implementation notes

- **Content is data.** Every puppy, photo, FAQ and contact detail lives in `lib/data`. Pages are pure render functions of that data, so adding a puppy means adding one JSON entry.
- **Mascot rig.** Teddy is a single SVG with named parts. A pose is a table of transforms and opacities. Walking legs and the wagging tail use SMIL so they rotate around the right pivot. Blinking, breathing and ear twitches are CSS keyframes. Click him for a speech bubble and hearts.
- **Deterministic randomness.** The sketch cards, stars and doodles use a seeded RNG keyed on each puppy's slug. Server and client render identical "hand-drawn" shapes, so there is no hydration mismatch.
- **Scroll effects without a library.** The pinned door hallway measures its track, sets the section height to `trackWidth − viewport + 100vh` and maps scroll progress to `translateX` on a sticky stage. On phones, or with reduced motion, it falls back to a grid.
- **One reveal observer.** A single `IntersectionObserver` handles every `[data-reveal]` element (`data-armed`, then `data-revealed`). The animations themselves are pure CSS, so server components can opt in with one attribute.
- **Accessibility.** The site uses semantic landmarks, a skip link, native `<dialog>` for the menu and viewers, a proper ARIA tablist with arrow keys, `aria-live` result counts, labelled form blanks, visible focus rings and reduced-motion fallbacks.
