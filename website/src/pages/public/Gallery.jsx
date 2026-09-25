import { memo, useState } from "react";
import galleryImages from "../../data/galleryImages";
import instagramReels from "../../data/instagramReels";
import Lightbox from "../../components/ui/Lightbox";
import InstagramEmbed from "../../components/ui/InstagramEmbed";
import ImageWithFallback from "../../components/ImageWithFallback";
import { SocialIcon } from "../../components/ui/SocialIcons";
import { SOCIALS } from "../../data/company";

const Gallery = memo(() => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const instagramProfile = SOCIALS.find((s) => s.name === "instagram");
  const youtubeProfile = SOCIALS.find((s) => s.name === "youtube");

  const visibleImages = showAll ? galleryImages : galleryImages.slice(0, 8);
  const hasMore = galleryImages.length > 8;

  return (
    <div className="bg-ink text-white">
      {/* Hero */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-48 pb-14 sm:pb-20 lg:pb-28 text-center">
          <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
              Our Gallery
            </span>
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
          </div>

          <h1
            className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] mb-6 sm:mb-8 max-w-4xl mx-auto text-balance"
            style={{ animationDelay: "120ms" }}
          >
            Moments From
            <br />
            <span className="text-primary">The Road.</span>
          </h1>

          <p
            className="animate-fade-up text-lead text-white/60 max-w-2xl mx-auto"
            style={{ animationDelay: "220ms" }}
          >
            Photos, films, and behind-the-scenes moments from EnablingEV. Every
            JhatPat Jio on the road is a small story — here are a few.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative bg-ink">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 lg:py-28">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {visibleImages.map((img, idx) => {
              const isFeatured = idx === 0 && !showAll;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`group relative overflow-hidden bg-background ${
                    isFeatured ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                  aria-label={`View gallery image ${idx + 1}`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`EnablingEV gallery ${idx + 1}`}
                    label={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500 pointer-events-none" />
                </button>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10 sm:mt-12">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="group inline-flex items-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full"
              >
                {showAll
                  ? "Show Less"
                  : `Show All ${galleryImages.length} Photos`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* YouTube */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 sm:gap-10 lg:gap-16 items-start">
            <div className="max-w-md">
              <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-px w-6 sm:w-8 bg-primary/60" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                  Watch Our Journey
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-5 sm:mb-6"
                style={{ animationDelay: "120ms" }}
              >
                Stories
                <br />
                From The
                <br />
                Road.
              </h2>

              <p
                className="animate-fade-up text-lead text-white/65 mb-6 sm:mb-8"
                style={{ animationDelay: "220ms" }}
              >
                Films and highlights from our channel — service days, dealer
                milestones, and the JhatPat Jio in motion.
              </p>

              {youtubeProfile && (
                <a
                  href={youtubeProfile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-fade-up group inline-flex items-center gap-2 text-punch uppercase text-white hover:text-primary transition-colors duration-300"
                  style={{ animationDelay: "320ms" }}
                >
                  <span className="link-luxe">Subscribe On YouTube</span>
                </a>
              )}
            </div>

            <div className="animate-fade-up relative w-full aspect-video overflow-hidden bg-background">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed?listType=playlist&list=UUh0Sj3fpFAoUys8Vckkwspg"
                title="EnablingEV on YouTube"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 sm:gap-10 lg:gap-16 items-start">
            <div className="max-w-md">
              <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-px w-6 sm:w-8 bg-primary/60" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                  On Instagram
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-5 sm:mb-6"
                style={{ animationDelay: "120ms" }}
              >
                Quick Clips
                <br />
                &amp; Behind
                <br />
                The Scenes.
              </h2>

              <p
                className="animate-fade-up text-lead text-white/65 mb-6 sm:mb-8"
                style={{ animationDelay: "220ms" }}
              >
                Follow us for reels, quick clips, and the everyday moments that
                make up the JhatPat Jio story.
              </p>

              {instagramProfile && (
                <a
                  href={instagramProfile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-fade-up group inline-flex items-center gap-2 text-punch uppercase text-white hover:text-primary transition-colors duration-300"
                  style={{ animationDelay: "320ms" }}
                >
                  <span className="link-luxe">Follow On Instagram</span>
                </a>
              )}
            </div>

            <div>
              {instagramReels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {instagramReels.map((url) => (
                    <div
                      key={url}
                      className="rounded-none overflow-hidden border border-white/[0.06] bg-background"
                    >
                      <InstagramEmbed url={url} />
                    </div>
                  ))}
                </div>
              ) : (
                instagramProfile && (
                  <a
                    href={instagramProfile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animate-fade-up group block p-8 sm:p-10 lg:p-16 border border-white/[0.08] hover:border-primary/40 transition-colors duration-500"
                    style={{ animationDelay: "320ms" }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/15 group-hover:border-primary/60 flex items-center justify-center text-white/60 group-hover:text-primary transition-colors duration-500 mb-4 sm:mb-6">
                        <SocialIcon name="instagram" size={24} />
                      </span>
                      <p className="font-display text-xl sm:text-2xl uppercase text-white mb-2">
                        @jhatpatjio
                      </p>
                      <p className="text-white/55 text-sm max-w-sm">
                        Reels, clips, and behind-the-scenes from the EnablingEV
                        workshop and the road.
                      </p>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social CTA */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                Connect With Us
              </span>
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-8 sm:mb-12"
              style={{ animationDelay: "120ms" }}
            >
              Stay In The Loop.
            </h2>

            <div
              className="animate-fade-up flex items-center justify-center gap-3 sm:gap-4"
              style={{ animationDelay: "220ms" }}
            >
              {SOCIALS.map(({ name, href, label }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/15 hover:border-primary/60 text-white/50 hover:text-primary transition-all duration-300 flex items-center justify-center"
                >
                  <SocialIcon name={name} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
    </div>
  );
});

export default Gallery;
