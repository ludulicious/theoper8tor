export interface SectionImage {
  src: string;
  alt: string;
  to?: string;
}
export interface PageSection {
  title?: string;
  eyebrow?: string;
  image?: SectionImage;
  images?: SectionImage[];
  actions?: { label: string; to: string }[];
  links?: { label: string; to: string }[];
  visible?: boolean;
  position?: string;
  mobilePosition?: string;
  layout?: "standard" | "hero" | "photo";
  level?: number;
  sessions?: { featuredOnly: boolean };
  form?: { src: string; title: string; kind?: string };
  video?: string;
  videoLibrary?: boolean;
}
export interface SectionPage {
  studio?: {
    blocks: { id: string; label: string; slot: string; field: string }[];
  };
  [key: string]: unknown;
}
