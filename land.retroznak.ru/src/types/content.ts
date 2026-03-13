export type CtaVariant = "primary" | "secondary" | "outline" | "ghost";

export interface Cta {
  label: string;
  variant?: CtaVariant;
  href?: string;
  targetId?: string;
  description?: string;
}

export const MESSENGER_PLATFORMS = [
  "phone",
  "max",
  "telegram",
  "email",
  "vk",
  "youtube",
] as const;

export type MessengerPlatform = (typeof MESSENGER_PLATFORMS)[number];

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  description?: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  visual: {
    image: string;
    alt: string;
    badge: {
      title: string;
      description: string;
    };
  };
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  cta?: Cta;
}

export interface TimelineContent {
  title: string;
  subtitle: string;
  items: TimelineItem[];
  expertQuote: {
    name: string;
    role: string;
    text: string;
    image?: string;
  };
  cta: Cta;
}

export interface SegmentItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface SegmentsContent {
  title: string;
  subtitle: string;
  segments: SegmentItem[];
  cta: Cta;
}

export type UpsellGroup = "lighting" | "text-style" | "steel" | "color" | "extras";

export interface ProductUpsellOption {
  id: string;
  label: string;
  price: number;
  group: UpsellGroup;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  badge?: {
    label: string;
    tone?: "default" | "highlight" | "premium";
  };
  description: string;
  priceFrom?: string;
  basePrice?: number;
  leadTime?: string;
  size?: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  tabImage?: {
    src: string;
    alt: string;
  };
  features: string[];
  equipment: string[];
  paymentOptions: string[];
  upsells: ProductUpsellOption[];
}

export interface ProductComparisonRow {
  label: string;
  values: Record<string, string>;
}

export interface ProductContent {
  title: string;
  subtitle: string;
  variants: ProductVariant[];
  comparison: ProductComparisonRow[];
  cta: Cta;
  secondaryCta: Cta;
}

export interface ProductionStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProductionTeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  image?: string;
}

export interface ProductionMetric {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface ProductionContent {
  title: string;
  subtitle: string;
  steps: ProductionStep[];
  team: ProductionTeamMember[];
  metrics: ProductionMetric[];
}

export interface ReviewItem {
  id: string;
  name: string;
  date?: string;
  role?: string;
  location?: string;
  rating: number;
  text: string;
  image?: string;
  photos?: string[];
}

export interface ReviewsContent {
  title: string;
  subtitle: string;
  subtitleLink?: {
    text: string;
    href: string;
  };
  subtitleAfterLink?: string;
  reviews: ReviewItem[];
  cta: Cta;
  moreCta?: Cta;
}

export interface OrderProcessStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface OrderProcessContent {
  title: string;
  subtitle: string;
  steps: OrderProcessStep[];
  cta: Cta;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FaqContent {
  title: string;
  subtitle: string;
  items: FaqItem[];
  cta: Cta;
}

export interface FinalCtaTrigger {
  id: string;
  title: string;
  description: string;
}

export interface MessengerLink {
  platform: MessengerPlatform;
  label: string;
  href: string;
  description?: string;
  qrCodeImage?: string;
}

export interface ResourceLink {
  label: string;
  href: string;
  type: "pdf" | "article" | "video" | "news";
}

export interface SocialLink {
  platform: MessengerPlatform;
  label: string;
  href: string;
}

export interface FinalCtaContent {
  title: string;
  subtitle: string;
  triggers: FinalCtaTrigger[];
  primaryCta: Cta;
  secondaryCta: Cta;
  messengers: MessengerLink[];
  resources: ResourceLink[];
  socials: SocialLink[];
  contacts?: Array<{
    label: string;
    value: string;
    href?: string;
  }>;
  legalNotice: string;
  copyright: string;
}

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterContent {
  menu: FooterLinkGroup[];
  contacts: Array<{
    label: string;
    value: string;
    href?: string;
  }>;
  messengers: MessengerLink[];
  socials: SocialLink[];
  legal: string;
  copyright: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  targetId: string;
}

export interface NavigationContent {
  menuItems: NavigationItem[];
  cta: Cta;
  messengers: MessengerLink[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryContent {
  title: string;
  subtitle: string;
  images: GalleryImage[];
}
