/**
 * Computes the relative luminance of an sRGB hex color per WCAG 2.x.
 * @param hex - Color in `#rrggbb` format.
 * @returns Relative luminance between 0 (black) and 1 (white).
 */
function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes the WCAG contrast ratio between two sRGB hex colors.
 * @param hexA - First color in `#rrggbb` format.
 * @param hexB - Second color in `#rrggbb` format.
 * @returns Contrast ratio from 1 (no contrast) to 21 (max contrast).
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}
