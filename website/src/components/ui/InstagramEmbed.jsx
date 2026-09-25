import { useEffect, useRef } from "react";

// Instagram's own oEmbed widget — the exact script Meta serves via the
// "Embed" option on any public post/reel. No API key, login or backend
// needed; works for any public Instagram post/reel URL.
let scriptPromise = null;
const loadEmbedScript = () => {
  if (window.instgrm) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
};

// `url` is the public permalink to a post or reel, e.g.
// "https://www.instagram.com/reel/ABC123xyz/"
const InstagramEmbed = ({ url }) => {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadEmbedScript().then(() => {
      if (!cancelled && window.instgrm) {
        window.instgrm.Embeds.process();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <blockquote
      ref={ref}
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: "0 auto", width: "100%", minWidth: "270px" }}
    />
  );
};

export default InstagramEmbed;
