import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge ships knowing Tailwind's own default theme scale, not
 * ours — without this, its font-size matcher doesn't recognize custom
 * names like `text-h2`, falls through to the (much more permissive)
 * text-color matcher, and silently drops the size class whenever a color
 * class appears alongside it in the same cn() call. This teaches it our
 * named type scale (see the `--text-*` tokens in globals.css) so
 * `cn("text-h2", "text-ink-900")` keeps both instead of colliding.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "h4", "body", "small", "label", "caption"],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a minor-unit-free decimal amount (as the backend returns it —
 * a string like "49.99") as a localized currency string. Returns null
 * when there's nothing displayable, so callers can fall back to a
 * quote-based pricing message instead of rendering "null" or "NaN".
 */
export function formatPrice(amount: string | null, currency: string | null): string | null {
  if (amount === null || currency === null) return null;
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}
