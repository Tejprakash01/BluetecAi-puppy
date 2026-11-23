# Development process & Loom walkthrough

This document records how the clone was built: the process, the tools, how AI was used (with the exact prompt), the main decisions, the challenges and how the site was tested and deployed. The second half is a talk track for the Loom video.

---

## 1. Process (what happened, in order)

1. **Reverse-engineer the reference.** I opened puppy.instabizweb.com in a browser and scrolled every page at desktop width (1024–1280 px) and at mobile width (375 px). I noted each scene and interaction: peekaboo hero, pinned door hallway, signpost, chat phone, passport, photo wall, FAQ, front door, page-transition curtain, mobile menu and sticky WhatsApp bar.
2. **Extract the design system.** From the live page I read:
   - the CSS custom properties: palette (toffee, honey, cocoa, milk, sky, blush), easing curves (`pounce`, `silk`, `snap`) and gutter/header sizes
   - the three Google fonts and their variable axes: Fraunces SOFT/WONK/opsz and Shantell Sans INFM/BNCE
   - the computed values of every component (sizes, `clamp()` type scales, radii, shadows)
3. **Extract the content.** I parsed the page data for all 15 available puppies, with every photo/video, its focal point and dominant colour. I also collected 27 "gone home" puppies, 64 family photos, 9 FAQs and the contact details. All of it became typed data files in `lib/data`.
4. **Plan the architecture.** I chose the Next.js App Router, one component per home scene, a shared CSS design system and data-driven pages (section 3 has the reasons).
5. **Build bottom-up.** The order was tokens and base styles, then the Teddy mascot rig, then the site chrome (header, menu, footer, curtain), the home scenes one by one, and finally the inner pages, forms and API.
6. **Test visually and iterate.** I built for production and took headless-Chrome screenshots of every section at 1280×800 and 375×812. I compared them with the reference side by side and fixed the differences: blink animation fighting the "happy" eyes, reveal specificity, inset photo frames, door grid width on phones and blob wobble.
7. **Package and deploy.** I wrote an asset script that runs as `prebuild`, added a fallback rewrite for missing media, wrote the README and pushed to GitHub. Vercel imports the repo and deploys it.

## 2. Tools

| Tool | Used for |
| --- | --- |
| Next.js 16, React 19, TypeScript | framework, routing, static generation, route handler |
| Tailwind CSS v4 | design tokens via `@theme`, layout utilities |
| Hand-written CSS (`app/styles`) | illustrated components (doors, quilt, passport, tickets, cork board, …) |
| Lenis | smooth inertial scrolling |
| Fontsource variable fonts | self-hosted Fraunces, Figtree and Shantell Sans with all axes |
| Chrome DevTools / browser console | inspecting the reference site's DOM, CSS and data |
| Playwright + headless Chrome | screenshot testing at desktop and mobile sizes |
| Git + GitHub, Vercel | version control, hosting, CI builds |

## 3. AI tools and the exact prompts

**AI tool:** Claude (Anthropic), used in the Claude app as an agent with a browser, a cloud Linux workspace and access to my project folder.

**Prompt 1 (the whole brief, pasted verbatim):**

```text
Assignment: Clone the Complete Website
Reference Website:
https://puppy.instabizweb.com/
Requirements:
Build a complete clone of the reference website, matching its design, layout, responsiveness, and functionality as closely as possible.
You are required to:

1. Deploy the website and share the live URL.
2. Share your GitHub repository with the complete source code.
3. Record a Loom video with screen sharing, explaining:
   * Your development process and project structure.
   * Technologies and tools used.
   * AI tools used and the exact prompts provided.
   * Implementation decisions and challenges faced.
   * Testing and deployment process.

AI Tools Policy:
You are free to use any AI tools or development tools of your choice. However, you must understand your implementation and be able to explain your complete workflow.
```

**Prompt 2 (follow-up):** the name of the empty GitHub repository I created, so the code could be pushed to it.

> _Add any later prompts here word for word (for example, requests for changes after reviewing the live site)._

**How the AI was used.** The AI inspected the reference site in a browser and extracted styles and data. It proposed the architecture, wrote the code, ran builds and screenshot tests and fixed the bugs it found. I reviewed the result and deployed it. Every file is plain, readable TypeScript/CSS with comments that explain the why. Section 4 lists the decisions I can defend.

## 4. Key implementation decisions

- **Next.js App Router + static generation.** The reference is a Next.js site, so the same stack gives the same routing and SEO. 52 pages are pre-rendered at build time. Only `/api/enquiry` runs on the server.
- **Data-driven pages.** All content lives in `lib/data`, so components contain no copy-pasted markup. One `SketchCard` renders 42 different puppies.
- **CSS-first animation.** I didn't use GSAP or Framer Motion. Reveals, stamps, doors, curtains and polaroids are CSS. JavaScript only does what CSS can't: scroll → `translateX` for the hallway, the plane's position along an SVG path (`getPointAtLength`), the chat's step tracking and the sunset. That keeps the bundle small and respects reduced motion for free.
- **The mascot as a rig, not frames.** Teddy is one SVG with named parts, and each pose is a small table of transforms. That's how the same character can sit, walk, peek over a quilt, snuggle in a basket and bow. The legs walk with SMIL `animateTransform`, because CSS transforms on nested SVG groups lose their pivot.
- **Deterministic "hand-drawn" shapes.** The blob masks, ink outlines and doodles come from a seeded RNG keyed on the puppy slug. Each card looks unique, but server and client output is identical, so there are no hydration errors.
- **One global reveal observer.** Server components opt into scroll reveals with a single `data-reveal` attribute. One `IntersectionObserver` in the layout arms and reveals them.
- **URL-driven filters.** `/puppies?breed=poodle&sex=girl` is shareable, and the home page's chat chips deep-link into it.
- **Native `<dialog>`.** The mobile menu and photo viewers get focus trapping, Esc to close and a backdrop with no extra library.
- **Assets.** A `prebuild` script mirrors every referenced photo/video into `public/media`, and a fallback rewrite proxies anything missing. The site therefore works the moment you clone it and is self-hosted once built.

## 5. Challenges

1. **The pinned horizontal hallway.** Vertical scroll has to drive a horizontal track. I used a sticky 100vh stage inside a tall wrapper (`height = trackWidth − viewport + 100vh`) and progress = `−wrapper.top / distance`. Doors open when Teddy's position passes them. It falls back to a plain grid on phones and with reduced motion.
2. **Smooth scrolling vs sticky and page transitions.** Lenis must scroll to the top after the transition curtain covers the page. I exposed the Lenis instance and called `scrollTo(0, { immediate: true })` between "covered" and "lifting".
3. **Page transitions in the App Router.** There is no route-change event before navigation, so a capture-phase click listener intercepts internal links. It covers the page, then calls `router.push`, and lifts the curtain when `usePathname` changes. A safety timeout makes sure the curtain never sticks.
4. **CSS cascade between Tailwind and component CSS.** The component styles are imported into `@layer components`, so Tailwind utilities can still override them. Custom reveal animations use `data-reveal="custom"` so the generic fade doesn't fight them.
5. **SVG animation conflicts.** A CSS blink animation was overriding the `opacity` attribute that switches to "happy" eyes. The blink class is now only applied when the eyes are open.
6. **Fonts with custom axes.** Google's Fraunces "SOFT/WONK" axes aren't in the default subset. Fontsource's `full.css` builds include every axis and are self-hosted.

## 6. Testing

- `npm run typecheck` (strict TypeScript) and `next build` must pass with no warnings. The build also proves all 42 puppy pages generate.
- I took headless Chrome (Playwright) screenshots of every home scene and every route at **1280×800** and **375×812**. I compared them with the reference.
- Manual checks:
  - filters, including the empty state and the deep links
  - gallery arrows, thumbnails and lightbox (keyboard + swipe)
  - FAQ search and unfolding
  - enquiry and letter forms: client validation, server validation (`422`) and the honeypot
  - mobile menu, page curtain and reduced-motion mode
- The forms post to `/api/enquiry`. A curl test:

  ```bash
  curl -X POST localhost:3000/api/enquiry -H 'content-type: application/json' -d '{"name":"A","phone":"1"}'          # 422 with field errors
  curl -X POST localhost:3000/api/enquiry -H 'content-type: application/json' -d '{"name":"Ayush","phone":"+971501234567"}' # {"ok":true}
  ```

## 7. Deployment

1. Push to GitHub: `git push origin main`.
2. Go to Vercel → **Add New Project** → import the repo → Deploy. No configuration is needed.
3. Vercel runs `npm run build`, and its `prebuild` step mirrors the media into `public/`. 52 static pages and one serverless function are deployed.
4. Every later push to `main` redeploys automatically, and pull requests get preview URLs.

---

# Loom talk track (≈ 8–10 min)

| Time | Show on screen | Say |
| --- | --- | --- |
| 0:00 | The live site, top of the home page | "This is my clone of puppy.instabizweb.com, built with Next.js 16, React 19, TypeScript and Tailwind v4, and deployed on Vercel." |
| 0:30 | Scroll the home page slowly | Point out each scene: peekaboo hero, the hallway where Teddy opens doors, the plane flying as you scroll, the chat typing, the passport stamps, the sunset, the photo wall and lightbox, the night FAQ and the door opening. |
| 2:00 | Click "Puppies", then filters, then a puppy | The page curtain; URL filters; the gallery and video; the enquiry form showing a validation error. |
| 3:00 | Gone home, Happy families, How it works, FAQ search, Contact letter | One sentence on each interaction. |
| 3:45 | Resize to a phone width / DevTools device mode | Mobile menu, sticky WhatsApp bar, the hallway turning into a grid. |
| 4:15 | VS Code: folder tree | "Here's the project structure" (section 1 of the README). |
| 5:00 | `lib/data/puppies.json` → `SketchCard.tsx` | Data-driven pages; the seeded RNG for hand-drawn shapes. |
| 5:45 | `Teddy.tsx` → `MeetThePups.tsx` | The mascot rig and poses; the pinned horizontal scroll maths. |
| 6:45 | This document, section 3 | "AI tool: Claude. Here's the exact prompt I gave it and how I used it." |
| 7:30 | Section 5 | Two or three of the challenges. |
| 8:15 | Terminal: `npm run build`; then the Vercel dashboard | Testing, the asset script, the deployment pipeline. |
| 9:00 | GitHub repo | Wrap up with the links. |
