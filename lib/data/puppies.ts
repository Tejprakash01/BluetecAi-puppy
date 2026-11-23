import raw from "./puppies.json";
import { gonePups } from "./gone";
import { hash } from "../random";

export type Media = {
  u: string; // url
  k: "image" | "video";
  w: number;
  h: number;
  alt: string;
  fx: number; // focal point x (0-1)
  fy: number; // focal point y (0-1)
  c: string; // dominant colour (placeholder bg)
  p?: string; // video poster
  pfx?: number;
  pfy?: number;
};

export type Puppy = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  breed: string;
  gender: "male" | "female" | "male-female";
  genderLabel: string;
  age: string;
  description?: string;
  status: "available" | "gone";
  origin: "imported" | "local";
  collections: string[];
  breeds: string[];
  media: Media[];
};

export const puppies = raw as Puppy[];

export const getPuppy = (slug: string) => puppies.find((p) => p.slug === slug);

export const cover = (p: Puppy) => p.media.find((m) => m.k === "image") ?? p.media[0];
export const hasVideo = (p: Puppy) => p.media.some((m) => m.k === "video");
export const focal = (m: Pick<Media, "fx" | "fy">) =>
  `${(m.fx * 100).toFixed(1)}% ${(m.fy * 100).toFixed(1)}%`;

/** "Maltipoo · boy · 3 months" when the pup has a name, "girl · 2 months" otherwise. */
export function sketchMeta(p: Puppy) {
  const bits = [p.genderLabel.toLowerCase(), p.age];
  if (p.name) bits.unshift(p.breed);
  return bits.join(" · ");
}

/** "Maltipoo, boy, 3 months, with video" — the label on the home page doors. */
export function doorMeta(p: Puppy) {
  const bits = [p.genderLabel.toLowerCase(), p.age];
  if (p.name) bits.unshift(p.breed);
  if (hasVideo(p)) bits.push("with video");
  return bits.join(", ");
}

export const whereLabel = (p: Puppy) =>
  p.origin === "imported" ? "Imported for you" : "In our Dubai showroom";

const WASHES = ["#f2be6b", "#bfddf5", "#fbe3b4", "#e8c39a", "#f9cdbf"];
export const washFor = (slug: string) => WASHES[hash(slug) % WASHES.length];
export const tiltFor = (slug: string, range = 2.5) =>
  ((hash(slug + "tilt") % 1000) / 1000) * range * 2 - range;

export const DOOR_COLORS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"];

export const breedFilters = [
  { slug: "maltipoo", label: "Maltipoo" },
  { slug: "pomeranian", label: "Pomeranian" },
  { slug: "poodle", label: "Poodle" },
  { slug: "cavapoo", label: "Cavapoo" },
  { slug: "shih-tzu", label: "Shih Tzu" },
];

/** A detail-page record for every puppy, available or gone home. */
export type AnyPuppy = Puppy;

export function goneAsPuppy(slug: string): Puppy | undefined {
  const g = gonePups.find((x) => x.slug === slug);
  if (!g) return undefined;
  const [fx, fy] = g.focal.split(" ").map((v) => parseFloat(v) / 100);
  const gender = g.genderLabel.toLowerCase() === "girl" ? "female" : "male";
  return {
    id: slug,
    slug,
    name: g.name === g.breed ? "" : g.name,
    displayName: g.name,
    breed: g.breed,
    gender,
    genderLabel: g.genderLabel,
    age: "",
    status: "gone",
    origin: "imported",
    collections: [],
    breeds: [],
    media: [{ u: g.image, k: "image", w: 800, h: 1000, alt: g.alt, fx, fy, c: "#f8e8e8" }],
  };
}

export const findAnyPuppy = (slug: string) => getPuppy(slug) ?? goneAsPuppy(slug);
export const allSlugs = () => [...puppies.map((p) => p.slug), ...gonePups.map((g) => g.slug)];
