import type { Metadata } from "next";
import { FamilyWall } from "@/components/families/FamilyWall";
import { Heart } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { familyPhotos, testimonial } from "@/lib/data/families";

export const metadata: Metadata = {
  title: "Happy families",
  description: "Beautiful moments shared by TeddyPups families after welcoming their new puppy home.",
};

export default function HappyFamiliesPage() {
  return (
    <div data-page="families">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal>
                our wall of happy endings
              </p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title" data-reveal>
                Happy families
                <Heart className="tp-memories__heart" />
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal>
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal>
                {familyPhotos.length} moments and counting
              </p>
            </div>
            <figure className="tp-memories__note" data-reveal>
              <span aria-hidden="true" className="tp-tape tp-tape--center" style={{ "--tape": "#cfe5f6" } as React.CSSProperties} />
              <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
              <figcaption className="font-scrawl">
                {testimonial.author}, {testimonial.place}
              </figcaption>
            </figure>
          </div>
          <div className="mt-16 md:mt-20">
            <FamilyWall />
          </div>
          <div className="tp-memories__foot">
            <div className="w-36 md:w-44">
              <Teddy pose="sit" facing="left" />
            </div>
            <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </section>
    </div>
  );
}
