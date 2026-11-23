import Link from "next/link";
import { Teddy } from "@/components/teddy/Teddy";

const TABS = [
  ["/", "Home"],
  ["/puppies", "Puppies"],
  ["/happy-families", "Families"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
];

/** 404 — a "lost puppy" poster with tear-off tabs that link back into the site. */
export default function NotFound() {
  return (
    <div className="gutter mx-auto grid min-h-[78vh] max-w-[110rem] place-items-center py-14">
      <div className="tp-poster">
        <p className="tp-poster__kicker font-scrawl">have you seen this page?</p>
        <h1 className="tp-poster__title font-plush">Lost</h1>
        <div className="tp-poster__photo">
          <Teddy pose="sit" label="Teddy, looking for the missing page" />
        </div>
        <p className="tp-poster__desc">We sniffed everywhere but this page has wandered off. It was last seen chasing its tail near our homepage.</p>
        <p className="tp-poster__reward font-scrawl">reward: one very happy puppy</p>
        <ul className="tp-poster__tabs">
          {TABS.map(([href, label]) => (
            <li key={href}>
              <Link className="tp-poster__tab" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
