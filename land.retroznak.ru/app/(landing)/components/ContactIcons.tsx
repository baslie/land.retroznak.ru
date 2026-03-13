import Image from "next/image";
import type { MessengerLink } from "@/types/content";
import { cn } from "@/lib/utils";
import {
  Mail,
  MessageCircle,
  Phone,
  Send,
  Youtube,
  type LucideIcon,
} from "lucide-react";

// Branded colored icons for iconOnly mode
const MaxColorIcon = () => (
  <Image src="/contacts/max.svg" alt="MAX" width={20} height={20} className="h-5 w-5 rounded" />
);

const TelegramColorIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-social-telegram transition-colors group-hover:fill-social-telegram">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const VKColorIcon = () => (
  <svg viewBox="0 0 101 100" className="h-5 w-5 fill-foreground transition-colors group-hover:fill-social-vk dark:fill-white dark:group-hover:fill-social-vk">
    <g clipPath="url(#clip0_vk)">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.52944 7.02944C0.5 14.0589 0.5 25.3726 0.5 48V52C0.5 74.6274 0.5 85.9411 7.52944 92.9706C14.5589 100 25.8726 100 48.5 100H52.5C75.1274 100 86.4411 100 93.4706 92.9706C100.5 85.9411 100.5 74.6274 100.5 52V48C100.5 25.3726 100.5 14.0589 93.4706 7.02944C86.4411 0 75.1274 0 52.5 0H48.5C25.8726 0 14.5589 0 7.52944 7.02944ZM17.3752 30.4169C17.9168 56.4169 30.9167 72.0418 53.7084 72.0418H55.0003V57.1668C63.3753 58.0001 69.7082 64.1252 72.2498 72.0418H84.0835C80.8335 60.2085 72.2914 53.6668 66.9581 51.1668C72.2914 48.0835 79.7915 40.5835 81.5831 30.4169H70.8328C68.4995 38.6669 61.5836 46.1668 55.0003 46.8751V30.4169H44.2499V59.2501C37.5833 57.5835 29.1668 49.5002 28.7918 30.4169H17.3752Z" />
    </g>
    <defs>
      <clipPath id="clip0_vk">
        <rect width="100" height="100" fill="white" transform="translate(0.5)"/>
      </clipPath>
    </defs>
  </svg>
);

const iconMap: Record<string, LucideIcon> = {
  phone: Phone,
  max: MessageCircle,
  telegram: Send,
  email: Mail,
  vk: MessageCircle, // Placeholder, VKColorIcon used in iconOnly mode
  youtube: Youtube,
};

export interface ContactIconsProps {
  items: MessengerLink[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  iconOnly?: boolean;
}

export function ContactIcons({ items, orientation = "horizontal", className, iconOnly = false }: ContactIconsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        orientation === "vertical" && "flex-col items-start gap-4",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = iconMap[item.platform] ?? MessageCircle;
        const descriptionId = `${item.platform}-${item.label}`;

        if (iconOnly) {
          // Use colored icons for MAX, Telegram, and VK
          const ColorIcon = item.platform === 'max' ? MaxColorIcon :
                           item.platform === 'telegram' ? TelegramColorIcon :
                           item.platform === 'vk' ? VKColorIcon :
                           null;

          return (
            <a
              key={`${item.platform}-${item.href}`}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/80 text-muted-foreground transition hover:bg-accent hover:border-primary/20 hover:text-primary"
              aria-label={item.label}
            >
              {ColorIcon ? <ColorIcon /> : <Icon className="h-5 w-5" aria-hidden />}
            </a>
          );
        }

        // Use colored icons for MAX and Telegram
        const ColorIcon = item.platform === 'max' ? MaxColorIcon :
                         item.platform === 'telegram' ? TelegramColorIcon :
                         null;

        return (
          <a
            key={`${item.platform}-${item.href}`}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-2 text-sm transition hover:bg-accent hover:border-primary/20"
            aria-describedby={item.description ? descriptionId : undefined}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
              {ColorIcon ? <ColorIcon /> : <Icon className="h-4 w-4" aria-hidden />}
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-foreground">{item.label}</span>
              {item.description ? (
                <span id={descriptionId} className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </span>
          </a>
        );
      })}
    </div>
  );
}
