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
  galleryImages: string[];
  featured?: boolean;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  subsidiarySlug: string;
  image: string;
  excerpt: string;
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
};

export type AboutContent = {
  history: string;
  vision: string;
  values: { title: string; description: string }[];
  positioning: string;
};
