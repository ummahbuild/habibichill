export type AppType = "PWA" | "Web App" | "Mobile App" | "Platform" | "Directory" | "Tool";

export interface UmmahProduct {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  emoji: string;
  appType: AppType;
  image?: string;
  tags: string[];
  relatedSlugs: string[];
  isCurrentApp?: boolean;
  featured?: boolean;
}

export const ummahBuildMeta = {
  name: "Ummah Build",
  tagline: "Islamic tech venture studio & ecosystem",
  motto: "Ummaceleration",
  url: "https://ummah.build",
  description:
    "Ummah Build is an Islamic technology venture studio building faith-aligned products for the global Muslim ummah — from emotional wellness to prayer, halal commerce, and spiritual growth.",
};

export const ummahProducts: UmmahProduct[] = [
  {
    slug: "habibichill",
    name: "HabibiChill",
    domain: "habibichill.com",
    url: "https://habibichill.com",
    tagline: "Turn anger into reward",
    description:
      "The Muslim anger and emotional mastery app. Manage anger in real time using Qur'an, Sunnah, and Islamic psychology — with emergency calm protocols, dhikr, Quran, and progress tracking.",
    emoji: "🔥",
    appType: "PWA",
    image: "/habibichillmeta.png",
    tags: ["anger management", "mental health", "emotional wellness", "sunnah"],
    relatedSlugs: ["sunnahsleep", "tryramadan", "praysap"],
    isCurrentApp: true,
    featured: true,
  },
  {
    slug: "sunnahsleep",
    name: "SunnahSleep",
    domain: "sunnahsleep.com",
    url: "https://sunnahsleep.com",
    tagline: "Cure insomnia with Islam",
    description:
      "A faith-grounded sleep app that helps Muslims overcome insomnia using prophetic night routines, Qur'an, dhikr, and Sunnah-based wind-down practices — not generic meditation.",
    emoji: "🌙",
    appType: "Web App",
    tags: ["sleep", "insomnia", "wellness", "sunnah"],
    relatedSlugs: ["habibichill", "tryramadan", "praysap"],
    featured: true,
  },
  {
    slug: "mosquesteps",
    name: "MosqueSteps",
    domain: "mosquesteps.com",
    url: "https://mosquesteps.com",
    tagline: "Earn blessings for walking to the mosque",
    description:
      "Track your steps to the masjid and turn every walk into worship. MosqueSteps motivates consistent mosque attendance with step tracking and spiritual reward framing.",
    emoji: "🕌",
    appType: "Mobile App",
    tags: ["mosque", "fitness", "worship", "community"],
    relatedSlugs: ["mosquelist", "praysap", "tryramadan"],
    featured: true,
  },
  {
    slug: "mosquelist",
    name: "MosqueList",
    domain: "mosquelist.com",
    url: "https://mosquelist.com",
    tagline: "Explore the world's most magnificent mosques",
    description:
      "Discover holy sites and Islamic history through the world's most magnificent mosques. Browse architecture, history, and travel inspiration across the ummah.",
    emoji: "🗺️",
    appType: "Directory",
    tags: ["mosques", "travel", "islamic history", "architecture"],
    relatedSlugs: ["mosquesteps", "praysap", "shariacheck"],
    featured: true,
  },
  {
    slug: "tryramadan",
    name: "TryRamadan",
    domain: "tryramadan.app",
    url: "https://tryramadan.app",
    tagline: "Fast like a Muslim",
    description:
      "Experience Ramadan fasting with guided support for non-Muslims and new Muslims. Learn the spiritual purpose, daily rhythm, and etiquette of fasting in a welcoming way.",
    emoji: "🌙",
    appType: "Web App",
    tags: ["ramadan", "fasting", "dawah", "education"],
    relatedSlugs: ["habibichill", "sunnahsleep", "praysap"],
    featured: true,
  },
  {
    slug: "shariacheck",
    name: "ShariaCheck",
    domain: "shariacheck.com",
    url: "https://shariacheck.com",
    tagline: "Check if products and businesses are halal",
    description:
      "Verify whether products and businesses align with Islamic principles — and understand why. ShariaCheck helps Muslims make informed halal commerce decisions with clear reasoning.",
    emoji: "✅",
    appType: "Tool",
    tags: ["halal", "commerce", "sharia", "consumer"],
    relatedSlugs: ["mosquelist", "muslimname", "habibichill"],
    featured: true,
  },
  {
    slug: "muslimname",
    name: "MuslimName",
    domain: "muslimname.me",
    url: "https://muslimname.me",
    tagline: "Find your Muslim name",
    description:
      "Discover meaningful Islamic names with origins, meanings, and pronunciation. Perfect for converts, parents, and anyone exploring their Muslim identity.",
    emoji: "📛",
    appType: "Tool",
    tags: ["names", "identity", "converts", "culture"],
    relatedSlugs: ["tryramadan", "shariacheck", "habibichill"],
    featured: true,
  },
  {
    slug: "praysap",
    name: "PRAYSAP",
    domain: "praysap.com",
    url: "https://praysap.com",
    tagline: "Pray anywhere — coordinate salah IRL",
    description:
      "The only app built for Muslims to coordinate prayer in real life. Find prayer partners, organize jama'ah, and never pray alone when you don't have to.",
    emoji: "🤲",
    appType: "Mobile App",
    tags: ["prayer", "salah", "community", "coordination"],
    relatedSlugs: ["mosquesteps", "mosquelist", "habibichill"],
    featured: true,
  },
];

export const getProductBySlug = (slug: string) => ummahProducts.find((p) => p.slug === slug);

export const getRelatedProducts = (slug: string, limit = 4) => {
  const product = getProductBySlug(slug);
  if (!product) return ummahProducts.filter((p) => p.slug !== slug).slice(0, limit);

  const related = product.relatedSlugs
    .map((s) => getProductBySlug(s))
    .filter((p): p is UmmahProduct => !!p && p.slug !== slug);

  if (related.length >= limit) return related.slice(0, limit);

  const extras = ummahProducts.filter(
    (p) => p.slug !== slug && !related.some((r) => r.slug === p.slug),
  );
  return [...related, ...extras].slice(0, limit);
};

export const getProductDetailPath = (slug: string) => `/product/${slug}`;
