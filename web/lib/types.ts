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

/** Hero éditorial Wabi Sabi — carte photo premium sur fond texturé. */
export type SubsidiaryHeroSection = {
  image: string;
  imageAlt: string;
  quote?: string;
  attribution?: string;
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
  /** Section éditoriale claire (contraste avec le dark mode filiale). */
  aboutSection?: SubsidiaryAboutSection;
  /** Témoignages clients (Wabi Sabi). */
  testimonialsSection?: SubsidiaryTestimonialsSection;
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
  team?: TeamMember[];
};
