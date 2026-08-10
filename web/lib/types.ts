export type Sector =
  | "restaurant"
  | "bar"
  | "lounge"
  | "nightclub"
  | "evenementiel";

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

export type HeroVideo = {
  src: string;
  webm?: string;
  poster?: string;
};

export type GalleryCategory =
  | "vibes"
  | "guests"
  | "events"
  | "food"
  | "drinks"
  | "interior"
  | "ambiance";

/** Image galerie filiale — chaîne simple ou objet avec catégorie explicite */
export type SubsidiaryGalleryEntry =
  | string
  | {
      src: string;
      category?: GalleryCategory;
      categories?: GalleryCategory[];
    };

export type SubsidiaryAboutHighlightIcon = "cocktail" | "rating" | "music" | "dining";

export type SubsidiaryAboutHighlight = {
  icon: SubsidiaryAboutHighlightIcon;
  title: string;
  description: string;
};

export type SubsidiaryAboutSlide = {
  src: string;
  alt: string;
};

/** Bloc éditorial « About » optionnel (ex. K Lounge, Millionaire Club). */
export type SubsidiaryAboutSection = {
  eyebrow: string;
  /** Slogan ou sous-titre affiché sous le titre (variant luxury-dark). */
  subtitle?: string;
  title: string;
  description: string;
  ctaLabel: string;
  /** Lien interne (`/contact`) ou ancre (`#…`). */
  ctaHref?: string;
  image: string;
  imageAlt: string;
  /** Carrousel auto sans contrôles (prioritaire sur `image` si défini). */
  slides?: SubsidiaryAboutSlide[];
  /** Galerie mosaïque (6 visuels) — layout éditorial Wabi Sabi. */
  mosaicImages?: SubsidiaryAboutSlide[];
  highlights?: SubsidiaryAboutHighlight[];
};

/** Hero éditorial Wabi Sabi — carrousel immersif plein format. */
export type SubsidiaryHeroSection = {
  image: string;
  imageAlt: string;
  /** Carrousel auto (prioritaire sur `image` si défini). */
  slides?: SubsidiaryAboutSlide[];
  /** Intervalle entre deux slides (ms). */
  slideIntervalMs?: number;
};

/** Bande philosophique de marque (Wabi Sabi). */
export type SubsidiaryPhilosophySection = {
  quote: string;
  attribution: string;
};

/** Section éditoriale split — texte + images superposées (Wabi Sabi). */
export type SubsidiaryDiningSection = {
  title: string;
  paragraphs: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  images: {
    back: SubsidiaryAboutSlide;
    front: SubsidiaryAboutSlide;
  };
};

/** Vitrine immersive bar / lounge (Wabi Sabi). */
export type SubsidiaryBarSection = {
  title: string;
  paragraphs: string[];
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
};

/** Section éditoriale split — titre, texte, CTA + image (Wabi Sabi). */
export type SubsidiarySpotlightSection = {
  title: string;
  description: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
};

/** Introduction éditoriale sombre — split texte / visuels (K Lounge). */
export type SubsidiaryIntroSection = {
  title: string;
  paragraphs: string[];
  cta: { label: string; href: string };
  primaryImage: SubsidiaryAboutSlide;
  secondaryImage: SubsidiaryAboutSlide;
};

export type Subsidiary = {
  slug: string;
  name: string;
  sector: Sector;
  tagline: string;
  description: string;
  practicalInfo: {
    address?: string;
    hours?: string;
    phone?: string;
    /** Établissements multi-sites (Wabi Sabi, K Lounge) */
    locations?: { city: string; address: string; phone: string }[];
  };
  social: SocialLinks;
  accentColor: string;
  coverImage: string;
  /** Logo wordmark de l'enseigne (chemin `/public/...`) — carrousel home. */
  brandLogo?: string;
  galleryImages: SubsidiaryGalleryEntry[];
  featured?: boolean;
  /** Vidéo locale en fond du hero (autoplay muet). */
  heroVideo?: HeroVideo;
  /** Hero éditorial dédié (Wabi Sabi). */
  heroSection?: SubsidiaryHeroSection;
  /** Philosophie de la marque (Wabi Sabi). */
  philosophySection?: SubsidiaryPhilosophySection;
  /** Vitrine culinaire éditoriale (Wabi Sabi). */
  diningSection?: SubsidiaryDiningSection;
  /** Vitrine bar / lounge immersive (Wabi Sabi). */
  barSection?: SubsidiaryBarSection;
  /** Mise en avant éditoriale split (Wabi Sabi). */
  spotlightSection?: SubsidiarySpotlightSection;
  /** Introduction éditoriale sombre (K Lounge). */
  introSection?: SubsidiaryIntroSection;
  /** Section éditoriale claire (contraste avec le dark mode filiale). */
  aboutSection?: SubsidiaryAboutSection;
  /** Témoignages clients (Wabi Sabi). */
  testimonialsSection?: SubsidiaryTestimonialsSection;
  /** Section « Notre histoire » 3 colonnes (Pinkberry). */
  storySection?: SubsidiaryStorySection;
  /** Galerie produits filtrable par catégorie (Pinkberry). */
  productGallerySection?: SubsidiaryProductGallerySection;
  /** Cartes actualités « Stay Tuned » (Pinkberry). */
  newsSection?: SubsidiaryNewsSection;
  /** Carrousel produits « Our Menu » (Pinkberry). */
  menuSection?: SubsidiaryMenuSection;
  /** Section « Get In Touch » — infos pratiques + formulaire (Pinkberry). */
  contactSection?: SubsidiaryContactSection;
  /** Site officiel externe — les liens filiale pointent hors de Cen21 (ex. Pain Quotidien). */
  externalUrl?: string;
  /** Section « Nos Spécialités » — rangées alternées photo/texte (L'Olive Verte). */
  specialtiesSection?: SubsidiarySpecialtiesSection;
  /** Section « Notre Menu » — catégories navigables (L'Olive Verte). */
  menuCategoriesSection?: SubsidiaryMenuCategoriesSection;
  /** Bandeau avantages + carrousel menu (Muzik Café). */
  muzikMenuSection?: SubsidiaryMuzikMenuSection;
  /** Carrousel galerie plats — hover reveal nom/prix (Muzik Café). */
  muzikGallerySection?: SubsidiaryMuzikGallerySection;
};

/** Rangée de spécialité — photo + texte (L'Olive Verte). */
export type SubsidiarySpecialtyRow = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

/** Section « Nos Spécialités » — rangées alternées photo/texte (L'Olive Verte). */
export type SubsidiarySpecialtiesSection = {
  eyebrow: string;
  title: string;
  description: string;
  rows: SubsidiarySpecialtyRow[];
};

/** Plat — catégorie navigable (L'Olive Verte). */
export type SubsidiaryMenuDish = {
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
};

/** Catégorie de plats — colonne gauche (L'Olive Verte). */
export type SubsidiaryMenuCategory = {
  id: string;
  label: string;
  dishes: SubsidiaryMenuDish[];
};

/** Section « Notre Menu » — catégories navigables (L'Olive Verte). */
export type SubsidiaryMenuCategoriesSection = {
  title: string;
  description: string;
  categories: SubsidiaryMenuCategory[];
};

/** Avantage — bandeau 3 colonnes (Muzik Café). */
export type SubsidiaryMuzikBenefit = {
  title: string;
  description: string;
};

/** Plat — carrousel menu à plat (Muzik Café). */
export type SubsidiaryMuzikMenuItem = {
  name: string;
  subtitle: string;
  price: string;
  image: string;
  imageAlt: string;
};

/** Bandeau avantages + carrousel menu (Muzik Café). */
export type SubsidiaryMuzikMenuSection = {
  menuTitle: string;
  benefits: SubsidiaryMuzikBenefit[];
  items: SubsidiaryMuzikMenuItem[];
};

/** Plat — carrousel galerie avec hover reveal nom/prix (Muzik Café). */
export type SubsidiaryMuzikGalleryItem = {
  name: string;
  price: string;
  image: string;
  imageAlt: string;
};

/** Carrousel galerie plats (Muzik Café). */
export type SubsidiaryMuzikGallerySection = {
  title: string;
  items: SubsidiaryMuzikGalleryItem[];
};

/** Section éditoriale « Notre histoire » 3 colonnes (Pinkberry). */
export type SubsidiaryStorySection = {
  eyebrow: string;
  title: string;
  aboutTitle: string;
  aboutText: string;
  signatureName: string;
  overviewTitle: string;
  overviewText: string;
  highlights: string[];
  ctaLabel: string;
};

/** Catégorie de filtre — galerie produits (Pinkberry). */
export type SubsidiaryProductGalleryCategory = {
  id: string;
  label: string;
};

export type SubsidiaryProductGalleryPhoto = {
  src: string;
  alt: string;
  categoryIds: string[];
};

/** Galerie produits filtrable par catégorie (Pinkberry). */
export type SubsidiaryProductGallerySection = {
  eyebrow: string;
  title: string;
  description: string;
  categories: SubsidiaryProductGalleryCategory[];
  photos: SubsidiaryProductGalleryPhoto[];
};

export type SubsidiaryNewsCard = {
  image: string;
  imageAlt: string;
  badgeLabel: string;
  date: string;
  author: string;
  title: string;
  description: string;
};

/** Cartes actualités « Stay Tuned » (Pinkberry). */
export type SubsidiaryNewsSection = {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  cards: SubsidiaryNewsCard[];
};

export type SubsidiaryMenuProduct = {
  image: string;
  imageAlt: string;
  name: string;
  price: string;
};

/** Carrousel produits « Our Menu » (Pinkberry). */
export type SubsidiaryMenuSection = {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  products: SubsidiaryMenuProduct[];
};

/** Section « Get In Touch » — infos pratiques + formulaire (Pinkberry). */
export type SubsidiaryContactSection = {
  eyebrow: string;
  title: string;
  hoursTitle: string;
  contactInfoTitle: string;
  socialTitle: string;
  formTitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
};

export type SubsidiaryTestimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  /** Note sur 5 (optionnelle). */
  rating?: number;
  avatarInitials?: string;
  avatarImage?: string;
};

export type SubsidiaryTestimonialsSection = {
  eyebrow: string;
  title: string;
  items: SubsidiaryTestimonial[];
};

export type EventStatus = "upcoming" | "sold-out" | "vip";

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  subsidiarySlug: string;
  image: string;
  excerpt: string;
  /** Libellé court pour affiches (ex. « Urban Wednesday »). */
  displayTitle?: string;
  status?: EventStatus;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  subsidiarySlug?: string;
  tags: string[];
};

export type StatIconId = "award" | "users" | "globe" | "trending";

export type StatItem = {
  icon: StatIconId;
  value: string;
  label: string;
};

export type StatsContent = {
  items: StatItem[];
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: SocialLinks;
  /** @deprecated préférer heroSlides */
  heroImage: string;
  heroSlides?: { src: string; alt: string }[];
  /** @deprecated préférer experienceVideos */
  experienceYoutubeId?: string;
  /** Vidéos de la section Expérience (slider horizontal). */
  experienceVideos?: ExperienceVideo[];
};

export type ExperienceVideo = {
  /** ID ou URL YouTube */
  youtubeId: string;
  title?: string;
  titleAccent?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  photo: string;
  linkedin?: string;
};

export type AboutContent = {
  history: string;
  vision: string;
  values: { title: string; description: string }[];
  positioning: string;
  heroImage?: string;
  originsImage?: string;
  visionImages?: string[];
  team?: TeamMember[];
};
