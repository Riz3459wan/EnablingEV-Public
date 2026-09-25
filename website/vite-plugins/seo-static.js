import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";

// Build-time SEO for a client-rendered site:
//   * writes the right <title>/description/canonical/Open Graph tags into the
//     HTML of every route (dist/about/index.html, ...), so crawlers and link
//     previews (WhatsApp, Facebook, X, LinkedIn) see them without running JS
//   * injects Organization JSON-LD (built from src/data/company.js)
//   * generates sitemap.xml and robots.txt
//   * fails the build if a routed page has no SEO entry, or if a title /
//     description is too long or duplicated
// Page data lives in src/seo/routes.js (single source of truth).

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const tagHtml = ({ tag, key, attrs }) =>
  `<${tag} data-seo="${key}" ${Object.entries(attrs)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ")} />`;

const load = (root, rel) => import(pathToFileURL(path.join(root, rel)).href);

const withPageHead = (html, route, siteUrl, buildHeadTags) => {
  const head = buildHeadTags(route, siteUrl)
    .map((t) => `    ${tagHtml(t)}`)
    .join("\n");
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/[ \t]*<(meta|link)\b[^>]*data-seo="(?!jsonld)[^"]*"[^>]*>\r?\n?/g, "")
    .replace("</head>", `${head}\n  </head>`);
};

export default function seoStatic() {
  let config;
  let siteUrl;

  return {
    name: "seo-static",

    configResolved(c) {
      config = c;
      const env = loadEnv(c.mode, c.root, "VITE_");
      siteUrl = (env.VITE_SITE_URL || "https://enablingev.com").replace(/\/+$/, "");
    },

    // Runs for dev and build: default (home page) tags + Organization schema.
    async transformIndexHtml(html) {
      const { routeFor } = await load(config.root, "src/seo/routes.js");
      const { buildHeadTags } = await load(config.root, "src/seo/head.js");
      const company = await load(config.root, "src/data/company.js");

      const org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.COMPANY_NAME,
        alternateName: company.BRAND_NAME,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon-512.png`,
        email: company.EMAIL,
        sameAs: company.SOCIALS.map((s) => s.href),
        contactPoint: company.PHONES.map((p) => ({
          "@type": "ContactPoint",
          telephone: p.display,
          contactType: "customer service",
          areaServed: "IN",
        })),
        address: company.OFFICES.map((o) => ({
          "@type": "PostalAddress",
          streetAddress: o.street,
          addressLocality: o.city,
          addressRegion: o.region,
          postalCode: o.postalCode,
          addressCountry: "IN",
        })),
      };
      const jsonLd = JSON.stringify(org).replace(/</g, "\\u003c");

      const home = routeFor("/");
      const tags = buildHeadTags(home, siteUrl).map((t) => `    ${tagHtml(t)}`);
      tags.push(
        `    <script type="application/ld+json" data-seo="jsonld">${jsonLd}</script>`,
      );
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(home.title)}</title>`)
        .replace("</head>", `${tags.join("\n")}\n  </head>`);
    },

    async closeBundle() {
      if (config.command !== "build") return;
      const root = config.root;
      const outDir = path.resolve(root, config.build.outDir);
      const indexFile = path.join(outDir, "index.html");
      if (!fs.existsSync(indexFile)) return;

      const { ROUTES, PUBLIC_ROUTES } = await load(root, "src/seo/routes.js");
      const { buildHeadTags, canonicalUrl } = await load(root, "src/seo/head.js");

      // ---- guards -------------------------------------------------------
      const routerSrc = fs.readFileSync(path.join(root, "src/routes/AppRoutes.jsx"), "utf8");
      const routed = [...routerSrc.matchAll(/path="(\/[^"]*)"/g)].map((m) => m[1]);
      const known = new Set(ROUTES.map((r) => r.path.toLowerCase()));
      const missing = routed.filter((p) => !known.has(p.toLowerCase()));
      const problems = [];
      if (missing.length) {
        problems.push(`routes with no entry in src/seo/routes.js: ${missing.join(", ")}`);
      }
      const seen = new Map();
      PUBLIC_ROUTES.forEach((r) => {
        if (r.title.length > 60) problems.push(`${r.path}: title is ${r.title.length} chars (max 60)`);
        if (r.description.length > 160) problems.push(`${r.path}: description is ${r.description.length} chars (max 160)`);
        if (seen.has(r.title)) problems.push(`${r.path}: same title as ${seen.get(r.title)}`);
        seen.set(r.title, r.path);
      });
      if (problems.length) {
        throw new Error(`[seo-static]\n  - ${problems.join("\n  - ")}`);
      }

      // ---- one HTML file per route ---------------------------------------
      const baseHtml = fs.readFileSync(indexFile, "utf8");
      let written = 0;
      for (const route of ROUTES) {
        if (route.path === "/") continue; // dist/index.html already carries the home tags
        const dir = path.join(outDir, route.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, "index.html"),
          withPageHead(baseHtml, route, siteUrl, buildHeadTags),
        );
        written++;
      }

      // ---- sitemap.xml + robots.txt --------------------------------------
      const today = new Date().toISOString().slice(0, 10);
      const urls = PUBLIC_ROUTES.map(
        (r) =>
          `  <url>\n    <loc>${canonicalUrl(siteUrl, r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
      ).join("\n");
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      fs.writeFileSync(
        path.join(outDir, "robots.txt"),
        `# Portal pages (logins, dashboards) are kept out of search with a noindex tag,\n# so they must stay crawlable for the tag to be seen.\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      );

      config.logger.info(
        `\n[seo-static] ${written} route pages + sitemap.xml + robots.txt written for ${siteUrl}`,
      );
    },
  };
}
