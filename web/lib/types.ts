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
  galleryImages: string[];
  featured?: boolean;
  /** Vidéo locale en fond du hero (autoplay muet). */
  heroVideo?: HeroVideo;
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
