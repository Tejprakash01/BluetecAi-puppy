import { Hero } from "@/components/home/Hero";
import { MeetThePups } from "@/components/home/MeetThePups";
import { TwoWays } from "@/components/home/TwoWays";
import { Journey } from "@/components/home/Journey";
import { Passport } from "@/components/home/Passport";
import { Families } from "@/components/home/Families";
import { Questions } from "@/components/home/Questions";
import { WelcomeHome } from "@/components/home/WelcomeHome";

/**
 * The home page reads as one day in the life of a puppy shop:
 * sunrise (hero) → morning hallway → afternoon signpost → golden-hour chat →
 * sunset passport → dusk photo wall → night questions → a warm front door.
 */
export default function HomePage() {
  return (
    <div data-page="home">
      <Hero />
      <MeetThePups />
      <TwoWays />
      <Journey />
      <Passport />
      <Families />
      <Questions />
      <WelcomeHome />
    </div>
  );
}
