/** Prefixes a path with the Astro base URL for correct subdirectory deployment. */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const asset = (path: string): string => `${base}${path}`;
