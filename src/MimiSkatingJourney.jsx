// src/App.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Snowflake,
  ChevronDown,
  Award,
  BadgeCheck,
  Instagram,
  ShoppingBag,
} from "lucide-react";

/* =========================
 * PARALLAX BACKGROUND (one image)
 * ========================= */
function ParallaxLayer({
  img = "/photos/mimi-bg.jpg", // fallback if you haven’t moved bg yet
  darken = 0.45,
  contrast = 1.1,
  blurPx = 0,
  strength = 5,
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 10000], ["0vh", `-${strength}vh`]);
  return (
    <motion.div aria-hidden className="fixed inset-0 z-0 overflow-hidden" style={{ y }}>
      <div
        className="absolute left-0 right-0 top-[-20vh] h-[140vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${img})`,
          filter: `brightness(${1 - darken}) contrast(${contrast}) blur(${blurPx}px)`,
        }}
      />
    </motion.div>
  );
}

/* =========================
 * PINK SNOW OVERLAY (random drift)
 * ========================= */
function SnowOverlay({ count = 60 }) {
  const flakes = Array.from({ length: count });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[30]">
      {flakes.map((_, i) => {
        const drift = Math.random() * 100 - 30;
        const duration = 14 + (i % 6);
        const delay = i * 0.1;
        const hue = 330 + Math.random() * 10;
        const light = 70 + Math.random() * 10;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0, x: 0 }}
            animate={{ y: [-20, 120], x: [0, drift, -drift, 0], opacity: [0, 1, 0] }}
            transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
            className="absolute"
            style={{ left: `${(i * 15) % 100}%` }}
          >
            <Snowflake
              className="w-4 h-4"
              style={{
                color: `hsl(${hue}, 80%, ${light}%)`,
                filter: "drop-shadow(0 0 6px rgba(255, 105, 180, 0.5))",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* =========================
 * SCROLL BAR + BACK TO TOP
 * ========================= */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div className="fixed top-0 left-0 h-1.5 bg-pink-300/90 z-[60]" style={{ width }} />;
}
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-[70] rounded-2xl bg-white/90 shadow-lg px-4 py-2 text-slate-800 hover:bg-pink-400"
    >
      Back to top
    </button>
  );
}

/* =========================
 * SECTION WRAPPER
 * ========================= */
function Section({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="relative py-28 md:py-36 z-[3]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl p-10 md:p-14 text-white">
          <div className="mb-10 md:mb-14 text-center">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-widest bg-white/10 border-white/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{eyebrow}</span>
              </div>
            )}
            {title && <h2 className="mt-4 text-3xl md:text-5xl font-extrabold drop-shadow">{title}</h2>}
            {subtitle && (
              <p className="mt-3 max-w-3xl mx-auto text-lg md:text-xl text-white/80">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* =========================
 * COUNTDOWN (Salt Lake City 2034)
 * ========================= */
const OLYMPICS_START = new Date("2034-02-10T00:00:00-07:00");
function Countdown() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = OLYMPICS_START - now;
  if (diff <= 0) return <p className="text-center text-white">It’s here—let the Games begin!</p>;
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return (
    <div className="flex flex-col md:flex-row items-center justify-center text-center md:space-x-12 space-y-6 md:space-y-0">
      <img src="/photos/Salt-lake-white.png" alt="Salt Lake 2034 Logo" className="w-40 md:w-48 lg:w-56 select-none" />
      <div className="grid justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 font-sans">
        {[
          { label: "Years", value: years },
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Minutes", value: minutes },
          { label: "Seconds", value: seconds },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 min-w-[110px]">
            <div className="text-3xl font-extrabold text-cyan-200 tabular-nums font-heading">{item.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-white/70 font-sans">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
 * MILESTONES (images/videos supported)
 * ========================= */
const MILESTONES = [
  {
    year: "2025",
    title: "First Double Salchow",
    copy: "Not even two days after landing my Axel, I landed my double Salchow.",
    videos: ["/videos/firstdoublesalchow.mp4"],
  },
  {
    year: "2025",
    title: "First Axel",
    copy: "After lots of attempts and falls, I LANDED MY FIRST AXEL.",
    videos: ["/videos/firstaxel.mp4"],
  },
  {
    year: "2024",
    title: "First US Figure Skating Competition",
    copy:
      "This started Mimi's competitive fiure skating journey!",
    images: ["/photos/firstusfscomp1.jpg", "/photos/firstusfscomp2.jpg"],
  },
  {
    year: "2024",
    title: "Passed First US Figure Skating Test",
    copy:
      "Mimi passed her first US Figure Skating Test, Pre-Preliminary Skating Skills with the help of Coach Anna. This was the start of pushing her to higher levels!",
    images: ["/photos/firstusfstest.jpg"],
  },
  {
    year: "2023",
    title: "First ISI Figure Skating Competition",
    copy:
      "Her first time performing in front of a crowd at the Bowie ISI Valentines Invitational 2023.",
    images: ["/photos/firstcomp.jpg", "/photos/firstcomp2.jpg"],
  },
  {
    year: "2022",
    title: "First Skating Lesson",
    copy: "She took her first skating lesson at the Bowie Ice Arena in Maryland.",
    images: ["/photos/firstlesson.jpg"],
  },
  {
    year: "2022",
    title: "First Steps on Ice",
    copy:
      "Mimi first glided across the ice and felt her dream begin at the Columbia Ice Rink in Maryland.",
    images: ["/photos/firsttimeonice.JPG"],
  },
];

/* =========================
 * GALLERY (ONLY from /src/assets/gallery + filename order)
 * Vite 5 syntax: query '?url'
 * ========================= */
const galleryGlob = import.meta.glob("/src/assets/gallery/*.{jpg,jpeg,png,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

function useGalleryFiles() {
  return useMemo(() => {
    const items = Object.entries(galleryGlob).map(([path, url]) => {
      const name = path.split("/").pop()?.toLowerCase() ?? "";
      return { url, name };
    });
    items.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
    return items.map((x) => x.url);
  }, []);
}

/* =========================
 * MARQUEE ROW (infinite, click opens lightbox)
 * ========================= */
function GalleryMarqueeRow({ images, duration = 30, reverse = false, onOpen }) {
  const strip = [...images, ...images]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4 py-2"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        {strip.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onOpen(images, i % images.length)}
            className="h-40 w-72 flex-none rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-200 focus:outline-none"
          >
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </motion.div>
    </div>
  );
}

/* =========================
 * APP
 * ========================= */
export default function App() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0vh", "-25vh"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const currentYear = new Date().getFullYear();

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, index: 0, items: [] });
  const openLightbox = (items, index) => setLightbox({ open: true, index, items });
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }));
  const prevLight = () => setLightbox((s) => ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length }));
  const nextLight = () => setLightbox((s) => ({ ...s, index: (s.index + 1) % s.items.length }));

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLight();
      if (e.key === "ArrowRight") nextLight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open]);

  // Optional protection: disable right-click + certain keys
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    const disableKeys = (e) => {
      if (
        (e.ctrlKey && ["s", "u"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeys);
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  const galleryFiles = useGalleryFiles();

  return (
    <main className="relative min-h-screen text-white">
      {/* Solid base to avoid “white bar” at very bottom */}
      <div className="fixed inset-0 -z-20 bg-[#0b1220]" />
      <ParallaxLayer img="/photos/mimi-bg2.jpg" />
      <SnowOverlay />
      <ScrollProgress />

      {/* HERO */}
      <header ref={heroRef} className="relative flex min-h-[90vh] items-center z-[3]">
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          {/* Circular Bio Photo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64 md:w-96 md:h-96 overflow-hidden rounded-full ring-4 ring-white/40 shadow-2xl">
              <img src="/photos/mimi-bio2.jpg" alt="Emily 'Mimi' Helowicz portrait" className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0) 55%, rgba(15,23,42,0.9) 100%)", mixBlendMode: "overlay" }}
              />
            </div>
          </div>

          <motion.h1 style={{ y: heroY, opacity: heroOpacity }} className="text-5xl md:text-7xl font-extrabold drop-shadow leading-[1.05]">
            Emily “Mimi” Helowicz
            <span className="block text-2xl md:text-3xl font-medium mt-4 text-white/90">An Immersive Figure Skating Journey</span>
          </motion.h1>
          <motion.p style={{ opacity: heroOpacity }} className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-white/85">
            Follow the glide, the grit, and the grace—from first edges to confident performance.
          </motion.p>
          <div className="mt-10 flex items-center justify-center gap-3 text-white/80">
            <ChevronDown className="h-6 w-6 animate-bounce" />
            <span>Scroll</span>
          </div>
        </div>
      </header>

      {/* CHAPTER 1 */}
      <Section id="origins" eyebrow="Chapter 1" title="Origins on the Ice" subtitle="Where curiosity met cold air and a wide-open rink.">
        <p className="text-lg text-white/85 max-w-3xl mx-auto">
          The first glide is a small miracle. Mimi learned to trust the edge, breathe through the wobble, and chase that floating feeling only ice can give.
        </p>
      </Section>

      {/* QUALIFICATIONS */}
      <Section
        id="qualifications"
        eyebrow="Chapter 2"
        title="Current Qualifications"
        subtitle={
          <>
            Progress to date across US Figure Skating, Learn to Skate USA, and ISI.
            <br />
            <span className="text-sm text-white/70 italic">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* USFS */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-cyan-300" />
              <h4 className="text-xl font-semibold">US Figure Skating</h4>
            </div>
            <p className="mt-2 text-white/85">
              Skating Skills <span className="font-semibold">Pre-Bronze</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                Skills
              </span>
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                USFS
              </span>
            </div>
          </div>

          {/* LTS */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-6 h-6 text-emerald-300" />
              <h4 className="text-xl font-semibold">Learn to Skate USA</h4>
            </div>
            <p className="mt-2 text-white/85">
              <span className="font-semibold">Freeskate 6</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                LTS
              </span>
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                Freeskate
              </span>
            </div>
          </div>

          {/* ISI */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-pink-300" />
              <h4 className="text-xl font-semibold">ISI</h4>
            </div>
            <p className="mt-2 text-white/85">
              <span className="font-semibold">Freestyle 5</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                ISI
              </span>
              <span className="text-xs uppercase tracking-widest rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
                Freestyle
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* CHAPTER 3: MILESTONES */}
      <Section id="milestones" eyebrow="Chapter 3" title="Milestones" subtitle="Tiny steps, brave moments, and the smile that says: again.">
        <div className="space-y-16">
          {MILESTONES.map((m, i) => (
            <div
              key={`${m.year}-${i}`}
              className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
                  <Calendar className="h-3.5 w-3.5" />
                  {m.year}
                </div>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold">{m.title}</h3>
                <p className="mt-2 text-white/85 max-w-xl">{m.copy}</p>
              </div>
              <div className={`grid ${m.images || m.videos ? "grid-cols-2 gap-3" : ""}`}>
                {(m.images ?? []).map((src, idx) => (
                  <div key={`img-${idx}`} className="overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl">
                    <img src={src} alt={`${m.title} ${idx + 1}`} className="h-72 w-full object-cover" />
                  </div>
                ))}
                {(m.videos ?? []).map((src, idx) => (
                  <div key={`vid-${idx}`} className="overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl">
                    <video src={src} className="h-72 w-full object-cover" autoPlay loop muted playsInline />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CHAPTER 4: OLYMPIC GOAL */}
      <Section id="olympic-goal" eyebrow="Chapter 4" title="Goal: The 2034 Winter Olympics" subtitle="Salt Lake City, Utah • February 10–26, 2034">
        <Countdown />
      </Section>

      {/* CHAPTER 5: GALLERY (3 rows, infinite, with MODAL lightbox) */}
      <Section id="gallery" eyebrow="Chapter 5" title="Gallery" subtitle="Favorite skating moments">
        {galleryFiles.length === 0 ? (
          <p className="text-center text-white/80">
            Add images to <code className="text-pink-300">/src/assets/gallery</code> to populate the gallery.
          </p>
        ) : (
          (() => {
            const third = Math.ceil(galleryFiles.length / 3);
            const r1 = galleryFiles.slice(0, third);
            const r2 = galleryFiles.slice(third, 2 * third);
            const r3 = galleryFiles.slice(2 * third);
            return (
              <div className="rounded-3xl ring-1 ring-white/15 p-2 md:p-4 bg-white/5 backdrop-blur-md">
                <GalleryMarqueeRow images={r1.length ? r1 : galleryFiles} duration={28} reverse={false} onOpen={openLightbox} />
                <GalleryMarqueeRow images={r2.length ? r2 : galleryFiles} duration={32} reverse={true} onOpen={openLightbox} />
                <GalleryMarqueeRow images={r3.length ? r3 : galleryFiles} duration={36} reverse={false} onOpen={openLightbox} />
              </div>
            );
          })()
        )}
      </Section>

      {/* CHAPTER 5: GRATITUDE */}
      <Section id="gratitude" eyebrow="Finale" title="Gratitude">
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Thank you to the coaches and staff of the Bowie Ice Arena for making Mimi fall in love with figure skating.”
        </p>
        <br />
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Thank you to Coach Greg and the Coaches of the Gardens Sports Academy for refining Mimi&apos;s technique and skill.”
        </p>
        <br />
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “A huge thank you to Coach Anna Prikockis and Coach Rashid Kadyrkaev for countless hours—first Axel and several doubles!”
        </p>
        <br />
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Great skating is steady work. Mimi brings curiosity to each rep—and that is where breakthroughs live.”
        </p>
      </Section>

      {/* FOOTER + LINKS */}
      <footer className="relative border-t border-white/10 py-10 text-center text-white/70 z-[3]">
        <p className="text-sm mb-6">© {currentYear} Helowicz Family • Built with love and a lot of rink time.</p>
        <div className="flex justify-center gap-8">
          <a
            href="https://www.instagram.com/mimi.on.ice/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-pink-400 transition"
          >
            <Instagram className="w-8 h-8" />
            <span className="text-lg">@mimi.on.ice</span>
          </a>
          <a
            href="https://www.amazon.com/hz/wishlist/ls/3MW5LZ8I0Z7P2?ref_=wl_share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-yellow-400 transition"
          >
            <ShoppingBag className="w-8 h-8" />
            <span className="text-lg">Amazon Wishlist</span>
          </a>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative max-w-6xl w-[92vw] h-[82vh] flex items-center justify-center">
            <img
              src={lightbox.items[lightbox.index]}
              alt="Gallery item"
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-1 text-sm"
            >
              Close
            </button>
            <button
              onClick={prevLight}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-2"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={nextLight}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-2"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <BackToTop />
    </main>
  );
}
