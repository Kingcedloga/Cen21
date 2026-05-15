/**
 * Google Maps embed (no API key) — “Search” style iframe.
 * Opens larger map in new tab via external link (see MapEmbed).
 */
export function googleMapsEmbedUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export function googleMapsExternalUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
