// Puppies that have already found their families ("Gone home").
// Each entry: [slug, name, meta line, cover image, focal point, alt text]
type Row = [string, string, string, string, string, string];

const rows: Row[] = [
  ["pomeranian-ace-boy", "Ace", "Pomeranian, boy", "/media/mihUKGFCatU3/0461cca56e/27b888_bac41adfadc44dce846a1c3fd0cdb0de-mv2.avif", "52.8% 46.2%", "Ace, male Pomeranian puppy"],
  ["poodle-leo-male", "Leo", "Poodle, boy", "/media/QgFG5s09n-ss/81af626d2d/27b888_5f9a7189bb21477d832047aae2040921-mv2.avif", "52.1% 38.0%", "Leo, male Poodle puppy"],
  ["maltipoo-mia-girl", "Mia", "Maltipoo, girl", "/media/4vu6_PGfL64H/537c367d85/27b888_747a4667fec640c69aad9bc045d61ac6-mv2.avif", "50.3% 43.2%", "Mia, female Maltipoo puppy"],
  ["maltipoo-sadie-girl", "Sadie", "Maltipoo, girl", "/media/159oT4F46uhk/b66c2be87f/27b888_ea6e7e0fcd43447d854657b6de98d4cb-mv2.avif", "47.9% 41.8%", "Sadie, female Maltipoo puppy"],
  ["blue-marle-pomeranian", "Pomeranian", "Boy", "/media/bMSEHnYcBTFF/970fdc1ee6/27b888_5e612a215bf343328c08d99e0e9c5a37-mv2.avif", "52.3% 51.6%", "Male Pomeranian puppy"],
  ["pomsky-ollie-boy", "Ollie", "Pomsky, boy", "/media/Qs2IHRk7OQIm/c16bea255c/27b888_ef3324a358d64858b4873a146574c3b9-mv2.avif", "53.2% 38.1%", "Ollie, male Pomsky puppy"],
  ["maltipoo-bruno-boy", "Bruno", "Maltipoo, boy", "/media/w-F8mJLs2gtj/f06147a6d3/27b888_301f58cbae624a1da36a79d46571043a-mv2.avif", "46.4% 38.8%", "Bruno, male Maltipoo puppy"],
  ["maltese-buddy-male", "Buddy", "Maltese, boy", "/media/5ygCaO2TQb3v/f23ade89fa/27b888_6053b478acb641d1865de22aef938977-mv2.avif", "48.3% 37.6%", "Buddy, male Maltese puppy"],
  ["maltese-charlie-male", "Charlie", "Maltese, boy", "/media/0c1rFiKXQLLk/75c6a20e15/27b888_b22287e7c1594de7ab2fba46eabea376-mv2.avif", "46.8% 33.4%", "Charlie, male Maltese puppy"],
  ["pomeranian-daisy-girl", "Daisy", "Pomeranian, girl", "/media/d_ji2d9LVy0R/b19b4cf1c2/27b888_c6cbb607448f469a96d73f3bc42a992d-mv2.avif", "47.8% 38.4%", "Daisy, female Pomeranian puppy"],
  ["pomeranian-bella-female", "Bella", "Pomeranian, girl", "/media/9jwfs8kSZW7K/9b8ae31d11/27b888_ab014eabe44c4f6ebaacb9ef1869823f-mv2.avif", "49.4% 36.9%", "Bella, female Pomeranian puppy"],
  ["poodle-teddy-male", "Teddy", "Poodle, boy", "/media/9XFYXsuvjIcz/8d1efc8baa/27b888_430ebbf87dc84b93bcd0b61709a2eaa7-mv2.avif", "39.8% 37.5%", "Teddy, male Poodle puppy"],
  ["poodle-molly-female", "Molly", "Poodle, girl", "/media/WZKcpiogRBW7/9ebcb8d165/27b888_2b9e32b056624a45b62f7d7b4ec7d105-mv2.avif", "53.3% 37.7%", "Molly, female Poodle puppy"],
  ["pomski-coco-girl", "Coco", "Pomsky, girl", "/media/CXIzj6hYrmuI/eff60812df/27b888_ce94335cf4714a99a78c799f666f9323-mv2.avif", "60.3% 38.5%", "Coco, female Pomsky puppy"],
  ["pomsky-rosie-girl", "Rosie", "Pomsky, girl", "/media/FhrW7pE84bji/f7c57baf49/27b888_08271c7de284451fb9c848757f4838fb-mv2.avif", "49.1% 37.8%", "Rosie, female Pomsky puppy"],
  ["pomeranian-leo-boy", "Leo", "Pomeranian, boy", "/media/5iCniMJshKud/8bfe42003c/27b888_84815fae2bd34283a7c79985cfc8b568-mv2.avif", "57.4% 32.4%", "Leo, male Pomeranian puppy"],
  ["poodle-molly-girl", "Molly", "Poodle, girl", "/media/lsaKvJhLwHB4/4cf2a02ed1/27b888_5aa959cec570411a8bb9372abe23f5e9-mv2.avif", "59.1% 37.7%", "Molly, female Poodle puppy"],
  ["poodle-rocky-boy", "Rocky", "Poodle, boy", "/media/51aMfxO7oeVe/6b70c96b1e/27b888_77a51d530b694ba58bc207f2a23e8620-mv2.avif", "49.3% 38.0%", "Rocky, male Poodle puppy"],
  ["maltipoo-sophie-girl", "Sophie", "Maltipoo, girl", "/media/PYYTxpqgo76_/ae53ae6d3c/27b888_0d89c05fa55c43d4b6d55d573be83e73-mv2.avif", "47.6% 37.8%", "Sophie, female Maltipoo puppy"],
  ["maltipoo-lola-girl", "Lola", "Maltipoo, girl", "/media/HPs4cYizPzy9/22b104e2c5/27b888_f24865b2456b46feb6ea6694fe90660f-mv2.avif", "54.3% 37.3%", "Lola, female Maltipoo puppy"],
  ["pomeranian-rex-boy", "Rex", "Pomeranian, boy", "/media/QIIvMqQTe9jr/d997ae172e/27b888_14fd6ec24bd94522bd54a5ae345240b8-mv2.avif", "49.7% 36.9%", "Rex, male Pomeranian puppy"],
  ["pomsky-finn-male", "Finn", "Pomsky, boy", "/media/tEAwWspMD8iG/1f55440daf/27b888_c68794a6e9ee442abb522a1d88a1e8cd-mv2.avif", "56.8% 50.1%", "Finn, male Pomsky puppy"],
  ["maltipoo-zoe-girl", "Zoe", "Maltipoo, girl", "/media/fxj_9aZOSxQM/90c10b9c91/27b888_89e442e0035442308fc87fe3d2837f1d-mv2.avif", "32.8% 37.6%", "Zoe, female Maltipoo puppy"],
  ["pomeranian-mimi-girl", "Mimi", "Pomeranian, girl", "/media/BLOZLPixUcjE/ea8ee97fd9/27b888_870c748ca6ee45cf8e0a311232dfe289-mv2.avif", "58.1% 41.0%", "Mimi, female Pomeranian puppy"],
  ["bichon-bailey-boy", "Bailey", "Bichon, boy", "/media/fI-hlHuSwrRw/e5ae9b6384/27b888_8d87239e23854214a8718ef8f02c2d50-mv2.avif", "51.6% 42.8%", "Bailey, male Bichon puppy"],
  ["puppy", "Maltipoo", "Girl", "/media/Cl0B4v8U3Y-d/3dea5a9fec/27b888_1ae70e063fd7451a87d4dfe79794d58f-mv2.avif", "48.3% 31.3%", "Female Maltipoo puppy"],
  ["maltipo", "Poodle", "Girl", "/media/sFgPBojUhFBo/5ac1429cf4/27b888_aa0ce426ca3848abbc7d695f8c818568-mv2.avif", "44.0% 32.8%", "Female Poodle puppy"],
];

export type GonePup = {
  slug: string;
  name: string;
  meta: string;
  breed: string;
  genderLabel: string;
  image: string;
  focal: string;
  alt: string;
};

export const gonePups: GonePup[] = rows.map(([slug, name, meta, image, focal, alt]) => {
  const parts = meta.split(", ");
  const breed = parts.length > 1 ? parts[0] : name;
  const g = parts[parts.length - 1];
  return {
    slug,
    name,
    meta,
    breed,
    genderLabel: g.charAt(0).toUpperCase() + g.slice(1),
    image,
    focal,
    alt,
  };
});
