export type SvgDataUrl = `data:image/svg+xml;utf8,${string}`;

type BadgeOptions = {
  text: string;
  background?: string;
  color?: string;
};

type MockPhotoOptions = {
  width?: number;
  height?: number;
  background?: string;
  gradientFrom?: string;
  gradientTo?: string;
  accent?: string;
  muted?: string;
  title: string;
  subtitle?: string;
  footer?: string;
  badge?: BadgeOptions;
  description?: string;
};

type QrPlaceholderOptions = {
  width?: number;
  height?: number;
  background?: string;
  foreground?: string;
  accent?: string;
  label: string;
  description?: string;
  footer?: string;
};

const defaultAccent = "#f3efe2";
const defaultMuted = "#d5d5cf";

export function createMockPhoto({
  width = 960,
  height = 640,
  background = "#0f1014",
  gradientFrom = "#262a33",
  gradientTo = "#13141c",
  accent = defaultAccent,
  muted = defaultMuted,
  title,
  subtitle,
  footer,
  badge,
  description,
}: MockPhotoOptions): SvgDataUrl {
  const radius = Math.round(Math.min(width, height) * 0.06);
  const badgeWidth = Math.round(width * 0.44);
  const badgeHeight = Math.round(height * 0.16);
  const badgeX = Math.round(width * 0.08);
  const badgeY = Math.round(height * 0.08);
  const badgeRadius = Math.round(badgeHeight * 0.35);
  const composedDescription = description ?? [title, subtitle, footer].filter(Boolean).join(". ");

  const badgeMarkup = badge
    ? `<g transform="translate(${badgeX}, ${badgeY})">
        <rect width="${badgeWidth}" height="${badgeHeight}" rx="${badgeRadius}" fill="${badge.background ?? "#1f222c"}" opacity="0.82" />
        <text x="${Math.round(badgeWidth / 2)}" y="${Math.round(badgeHeight / 2)}" fill="${badge.color ?? accent}" font-family="Manrope, Arial, sans-serif" font-size="${Math.round(badgeHeight * 0.48)}" text-anchor="middle" dominant-baseline="middle">${badge.text}</text>
      </g>`
    : "";

  const subtitleMarkup = subtitle
    ? `<text x="${width / 2}" y="${Math.round(height * 0.68)}" fill="${muted}" font-family="Manrope, Arial, sans-serif" font-size="${Math.round(height * 0.08)}" text-anchor="middle" dominant-baseline="middle">${subtitle}</text>`
    : "";

  const footerMarkup = footer
    ? `<text x="${width / 2}" y="${Math.round(height * 0.84)}" fill="${muted}" font-family="Manrope, Arial, sans-serif" font-size="${Math.round(height * 0.06)}" text-anchor="middle" dominant-baseline="middle">${footer}</text>`
    : "";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="mock-title mock-desc">
  <title id="mock-title">${title}</title>
  <desc id="mock-desc">${composedDescription}</desc>
  <defs>
    <linearGradient id="mock-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradientFrom}" />
      <stop offset="100%" stop-color="${gradientTo}" />
    </linearGradient>
    <pattern id="mock-pattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="18" height="18" fill="none" stroke="${accent}" stroke-width="2" opacity="0.04" />
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#mock-gradient)" opacity="0.9" />
  <rect width="${width}" height="${height}" rx="${radius}" fill="url(#mock-pattern)" />
  ${badgeMarkup}
  <g opacity="0.5">
    <circle cx="${Math.round(width * 0.82)}" cy="${Math.round(height * 0.28)}" r="${Math.round(
    Math.min(width, height) * 0.18
  )}" fill="none" stroke="${accent}" stroke-width="3" />
    <path d="M${Math.round(width * 0.18)} ${Math.round(height * 0.82)} L${Math.round(width * 0.82)} ${Math.round(
    height * 0.28
  )}" stroke="${accent}" stroke-width="2" stroke-opacity="0.4" />
  </g>
  <text x="${width / 2}" y="${Math.round(height * 0.52)}" fill="${accent}" font-family="Noto Serif, Georgia, serif" font-size="${Math.round(
    height * 0.16
  )}" text-anchor="middle" dominant-baseline="middle">${title}</text>
  ${subtitleMarkup}
  ${footerMarkup}
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` as SvgDataUrl;
}

export function createQrPlaceholder({
  width = 256,
  height = 256,
  background = defaultAccent,
  foreground = "#0f1014",
  accent = "#c8c8bf",
  label,
  description,
  footer,
}: QrPlaceholderOptions): SvgDataUrl {
  const matrix = [
    "111111100011111",
    "100000100010001",
    "101110101011101",
    "101110101011101",
    "100000100010001",
    "111111100011111",
    "000000000000000",
    "011101011101110",
    "010001010100010",
    "011101010101110",
    "000000000000000",
    "111111001111111",
    "100001001000001",
    "101101111011101",
    "111111001111111",
  ];

  const moduleSize = Math.min(width, height) / matrix.length;
  const qrModules = matrix
    .map((row, y) =>
      row
        .split("")
        .map((cell, x) =>
          cell === "1"
            ? `<rect x="${(x * moduleSize).toFixed(2)}" y="${(y * moduleSize).toFixed(2)}" width="${moduleSize.toFixed(
                2
              )}" height="${moduleSize.toFixed(2)}" fill="${foreground}" />`
            : ""
        )
        .join("")
    )
    .join("");

  const textY = height + 48;
  const composedDescription = description ?? `${label}. ${footer ?? "QR код Retroznak"}`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height + 96}" role="img" aria-labelledby="qr-title qr-desc">
  <title id="qr-title">${label}</title>
  <desc id="qr-desc">${composedDescription}</desc>
  <rect width="${width}" height="${height}" rx="24" fill="${background}" />
  <g transform="translate(${(width - moduleSize * matrix.length) / 2}, ${(height - moduleSize * matrix.length) / 2})">
    <rect width="${moduleSize * matrix.length}" height="${moduleSize * matrix.length}" rx="16" fill="none" stroke="${accent}" stroke-width="4" opacity="0.4" />
    ${qrModules}
  </g>
  <text x="${width / 2}" y="${textY}" fill="${foreground}" font-family="Manrope, Arial, sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">${label}</text>
  ${footer ? `<text x="${width / 2}" y="${textY + 32}" fill="${accent}" font-family="Manrope, Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">${footer}</text>` : ""}
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` as SvgDataUrl;
}
