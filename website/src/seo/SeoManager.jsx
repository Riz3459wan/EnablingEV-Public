import { useEffect } from "react";
import { useLocation } from "react-router";
import { routeFor, DEFAULT_SITE_URL } from "./routes.js";
import { buildHeadTags } from "./head.js";

const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

// Keeps <title>, description, canonical, robots and Open Graph / Twitter tags
// in sync with the current route. The static HTML already contains the right
// tags for a first load (see vite-plugins/seo-static.js); this covers
// in-app navigation. Existing tags are updated in place, never duplicated.
const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routeFor(pathname);
    document.title = route.title;

    const wanted = buildHeadTags(route, SITE_URL, pathname);
    const keep = new Set(wanted.map((t) => t.key));

    wanted.forEach(({ tag, key, attrs }) => {
      let el = document.head.querySelector(`${tag}[data-seo="${key}"]`);
      if (!el) {
        el = document.createElement(tag);
        el.setAttribute("data-seo", key);
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    });

    // e.g. moving from an indexable page to a private one drops the canonical
    document.head
      .querySelectorAll("[data-seo]:not([data-seo^='jsonld'])")
      .forEach((el) => {
        if (!keep.has(el.getAttribute("data-seo"))) el.remove();
      });
  }, [pathname]);

  return null;
};

export default SeoManager;
