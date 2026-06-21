export type AppType = "PWA" | "Web App" | "Mobile App" | "Platform" | "Directory" | "Tool";
export type ProductCategory = "Wellness" | "Worship" | "Discovery" | "Commerce" | "Identity";
export type ProductStatus = "live" | "beta" | "coming-soon";

export interface UmmahProduct {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  longDescription?: string;
  emoji: string;
  appType: AppType;
  category: ProductCategory;
  status: ProductStatus;
  image?: string;
  accent: string;
  tags: string[];
  highlights: string[];
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

export const productCategories: ProductCategory[] = [
  "Wellness",
  "Worship",
  "Discovery",
  "Commerce",
  "Identity",
];

export const ummahProducts: UmmahProduct[] = [
  {
    slug: "habibichill",
    name: "HabibiChill",
    domain: "habibichill.com",
    url: "https://habibichill.com",
    tagline: "Turn anger into reward",
    description:
      "The Muslim anger and emotional mastery app. Manage anger in real time using Qur'an, Sunnah, and Islamic psychology.",
    longDescription:
      "HabibiChill is the first Muslim anger management PWA — built for the moment rage hits. Emergency Sunnah protocols, dhikr, Quran, journaling, and Sabr tracking help you convert emotional struggle into spiritual growth.",
    emoji: "🔥",
    appType: "PWA",
    category: "Wellness",
    status: "live",
    image: "/habibichillmeta.png",
    accent: "from-orange-500/20 to-teal-500/20",
    tags: ["anger management", "mental health", "emotional wellness", "sunnah"],
    highlights: ["Emergency calm protocol", "Offline PWA", "No account required", "100% private"],
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
      "Faith-grounded sleep support using prophetic night routines, Qur'an, dhikr, and Sunnah wind-down practices.",
    longDescription:
      "SunnahSleep replaces generic sleep apps with an Islamic approach to rest — guided by prophetic sleep etiquette, calming recitations, and routines rooted in the Sunnah.",
    emoji: "🌙",
    appType: "Web App",
    category: "Wellness",
    status: "live",
    accent: "from-indigo-500/20 to-slate-500/20",
    tags: ["sleep", "insomnia", "wellness", "sunnah"],
    highlights: ["Prophetic sleep routines", "Qur'an wind-down", "Insomnia support", "Faith-first design"],
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
      "Track steps to the masjid and turn every walk into worship with spiritual reward framing.",
    longDescription:
      "MosqueSteps motivates consistent mosque attendance by tracking your walk to jama'ah and reframing fitness as ibadah — every step toward the masjid counts.",
    emoji: "🕌",
    appType: "Mobile App",
    category: "Worship",
    status: "live",
    accent: "from-emerald-500/20 to-teal-500/20",
    tags: ["mosque", "fitness", "worship", "community"],
    highlights: ["Step tracking to masjid", "Reward framing", "Community motivation", "Daily consistency"],
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
      "Discover holy sites and Islamic history through magnificent mosques around the world.",
    longDescription:
      "MosqueList is a curated directory of the world's most breathtaking masajid — architecture, history, and travel inspiration for Muslims and explorers alike.",
    emoji: "🗺️",
    appType: "Directory",
    category: "Discovery",
    status: "live",
    accent: "from-amber-500/20 to-orange-500/20",
    tags: ["mosques", "travel", "islamic history", "architecture"],
    highlights: ["Global mosque directory", "Architecture & history", "Travel inspiration", "Curated collections"],
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
      "Experience Ramadan fasting with guided support for non-Muslims and new Muslims.",
    longDescription:
      "TryRamadan welcomes curious learners and reverts into the Ramadan experience — spiritual purpose, daily rhythm, etiquette, and community connection without overwhelm.",
    emoji: "🌙",
    appType: "Web App",
    category: "Worship",
    status: "live",
    accent: "from-purple-500/20 to-indigo-500/20",
    tags: ["ramadan", "fasting", "dawah", "education"],
    highlights: ["Beginner-friendly fasting", "Spiritual education", "Daily rhythm guides", "Welcoming dawah"],
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
      "Verify whether products and businesses align with Islamic principles — and understand why.",
    longDescription:
      "ShariaCheck gives Muslims transparent halal commerce decisions — not just labels, but clear reasoning on whether products and businesses meet Islamic standards.",
    emoji: "✅",
    appType: "Tool",
    category: "Commerce",
    status: "live",
    accent: "from-green-500/20 to-emerald-500/20",
    tags: ["halal", "commerce", "sharia", "consumer"],
    highlights: ["Halal verification", "Clear reasoning", "Business checks", "Consumer confidence"],
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
      "Discover meaningful Islamic names with origins, meanings, and pronunciation.",
    longDescription:
      "MuslimName helps converts, parents, and seekers find names rooted in Islamic tradition — with meanings, origins, and pronunciation guides.",
    emoji: "📛",
    appType: "Tool",
    category: "Identity",
    status: "live",
    accent: "from-rose-500/20 to-pink-500/20",
    tags: ["names", "identity", "converts", "culture"],
    highlights: ["Meaning & origin", "Pronunciation guides", "Convert-friendly", "Curated collections"],
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
      "The only app built for Muslims to coordinate prayer in real life — find partners and organize jama'ah.",
    longDescription:
      "PRAYSAP solves a real gap: coordinating salah in person. Find prayer partners nearby, organize jama'ah, and build community around the five daily prayers.",
    emoji: "🤲",
    appType: "Mobile App",
    category: "Worship",
    status: "live",
    accent: "from-cyan-500/20 to-blue-500/20",
    tags: ["prayer", "salah", "community", "coordination"],
    highlights: ["IRL prayer coordination", "Jama'ah finder", "Community building", "Pray anywhere"],
    relatedSlugs: ["mosquesteps", "mosquelist", "habibichill"],
    featured: true,
  },
];

export const getProductBySlug = (slug: string) => ummahProducts.find((p) => p.slug === slug);

export const getProductsByCategory = (category: ProductCategory) =>
  ummahProducts.filter((p) => p.category === category);

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

export const filterProducts = (query: string, category: ProductCategory | "") => {
  const q = query.trim().toLowerCase();
  return ummahProducts.filter((product) => {
    if (category && product.category !== category) return false;
    if (!q) return true;
    return (
      product.name.toLowerCase().includes(q) ||
      product.tagline.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
};
