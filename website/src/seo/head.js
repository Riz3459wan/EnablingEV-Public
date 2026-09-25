import { OG_IMAGE, OG_IMAGE_ALT } from "./routes.js";

// Builds the list of <head> tags that depend on the page. The same list is
// written into the static HTML at build time and re-applied in the browser on
// client-side navigation, so the two can never drift apart.
// Every managed tag carries data-seo="<key>" so it can be found and updated
// in place (never duplicated).
export const canonicalUrl = (siteUrl, path) =>
  path === "/" || path == null ? `${siteUrl}/` : `${siteUrl}${path}`;

export function buildHeadTags(route, siteUrl, pathname = route.path) {
  const url = canonicalUrl(siteUrl, route.noindex ? pathname : route.path);
  const image = `${siteUrl}${OG_IMAGE}`;
  const tags = [
    { tag: "meta", key: "description", attrs: { name: "description", content: route.description } },
    { tag: "meta", key: "robots", attrs: { name: "robots", content: route.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" } },
    { tag: "meta", key: "og:type", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", key: "og:site_name", attrs: { property: "og:site_name", content: "EnablingEV" } },
    { tag: "meta", key: "og:locale", attrs: { property: "og:locale", content: "en_IN" } },
    { tag: "meta", key: "og:title", attrs: { property: "og:title", content: route.title } },
    { tag: "meta", key: "og:description", attrs: { property: "og:description", content: route.description } },
    { tag: "meta", key: "og:url", attrs: { property: "og:url", content: url } },
    { tag: "meta", key: "og:image", attrs: { property: "og:image", content: image } },
    { tag: "meta", key: "og:image:width", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", key: "og:image:height", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", key: "og:image:alt", attrs: { property: "og:image:alt", content: OG_IMAGE_ALT } },
    { tag: "meta", key: "twitter:card", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", key: "twitter:title", attrs: { name: "twitter:title", content: route.title } },
    { tag: "meta", key: "twitter:description", attrs: { name: "twitter:description", content: route.description } },
    { tag: "meta", key: "twitter:image", attrs: { name: "twitter:image", content: image } },
    { tag: "meta", key: "twitter:image:alt", attrs: { name: "twitter:image:alt", content: OG_IMAGE_ALT } },
  ];
  // Only indexable pages get a canonical (private pages are noindex anyway).
  if (!route.noindex) {
    tags.push({ tag: "link", key: "canonical", attrs: { rel: "canonical", href: url } });
  }
  return tags;
}
