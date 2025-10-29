import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Calendar, Snowflake, ChevronDown } from "lucide-react";

/* =========================
 * THEME / TUNING KNOBS
 * ========================= */
const THEME = {
  bgImage: "/photos/mimi-bg.jpg",
  bgDarken: 0.45,
  bgContrast: 1.1,
  bgBlurPx: 0,
  showGrain: true,
  snowflakes: 60,
  snowSpeedBase: 14,
};

/* UTILITIES */
function usePreloadedImage(src) {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    img.src = src;
  }, [src]);
  return status;
}

/* BACKGROUND */
function ParallaxLayer({ img, img2, blend = "overlay", speed = 0.05 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * speed * -1);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ y }}
    >
      {/* Base image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          filter: "brightness(0.6)",
        }}
      />
      {/* Blended overlay image */}
      {img2 && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${img2})`,
            backgroundBlendMode: blend,
            opacity: 0.5, // adjust intensity
            backgroundSize: "cover",
          }}
        />
      )}
    </motion.div>
  );
}

/* SNOW */
function SnowOverlay({ count = 50, speedBase = 14 }) {
  const flakes = Array.from({ length: count });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2]">
      {flakes.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: [-20, 120], opacity: [0, 1, 0] }}
          transition={{ duration: speedBase + (i % 6), repeat: Infinity, delay: i * 0.1, ease: "linear" }}
          className="absolute text-white/80"
          style={{ left: `${(i * 15) % 100}%` }}
        >
          <Snowflake className="w-4 h-4" />
        </motion.div>
      ))}
    </div>
  );
}

/* SECTIONS */
function Section({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl p-10 md:p-14 relative z-[3] text-white">
          <div className="mb-10 md:mb-14 text-center">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-widest bg-white/10 border-white/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{eyebrow}</span>
              </div>
            )}
            {title && <h2 className="mt-4 text-3xl md:text-5xl font-extrabold drop-shadow">{title}</h2>}
            {subtitle && <p className="mt-3 max-w-3xl mx-auto text-lg md:text-xl text-white/80">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* PROGRESS + BACK TO TOP */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div className="fixed top-0 left-0 h-1.5 bg-cyan-300/90 z-[60]" style={{ width }} />;
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
      className="fixed bottom-6 right-6 z-[70] rounded-2xl bg-white/90 shadow-lg px-4 py-2 text-slate-800 hover:bg-white"
    >
      Back to top
    </button>
  );
}

/* COUNTDOWN */
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
    <div className="w-full flex justify-center">
      <div className="inline-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: "Years", value: years },
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Minutes", value: minutes },
          { label: "Seconds", value: seconds },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 min-w-[110px]">
            <div className="text-3xl font-extrabold text-cyan-200 text-center tabular-nums">{item.value}</div>
            <div className="mt-1 text-center text-xs uppercase tracking-widest text-white/70">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* DATA */
const MILESTONES = [
  {
    year: "2022",
    title: "First Steps on Ice",
    copy: "Mimi first glided across the ice and felt her dream begin at the Columbia Ice Rink in Maryland.",
    images: ["/photos/firsttimeonice.JPG"],
  },
  {
    year: "2022",
    title: "First Skating Lesson",
    copy: "She took her first skating lesson at the Bowie Ice Arena in Maryland.",
    images: ["/photos/firstlesson.jpg"],
  },
  {
    year: "2023",
    title: "First Figure Skating Competition",
    copy: "Her first time performing in front of a crowd at the Bowie ISI Valentines Invitational 2023.",
    images: ["/photos/firstcomp.jpg", "/photos/firstcomp2.jpg"],
  },
  {
    year: "2025",
    title: "First Axel",
    copy: "After lots of attempts and falls, I LANDED MY FIRST AXEL.",
    videos: ["/videos/firstaxel.mp4"],
  },
  {
    year: "2025",
    title: "First Double Salchow",
    copy: "Not even two days after landing my Axel, I landed my double Salchow.",
    videos: ["/videos/firstdoublesalchow.mp4"],
  },
];

const GALLERY = [
  "/photos/firsttimeonice.JPG",
  "/photos/firstlesson.jpg",
  "/photos/firstcomp.jpg",
  "/photos/firstcomp2.jpg",
  "/photos/program.jpg",
];

/* MAIN COMPONENT */
export default function MimiSkatingJourney() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0vh", "-25vh"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-20 bg-[#0b1220]" />
      <ParallaxLayer
        img="/photos/mimi-bg.jpg"
        img2="/photos/mimi-bg2.png"
        blend="screen"  // overlay, multiply, screen, soft-light, etc.
        speed={0.06}
      />      
      <SnowOverlay count={THEME.snowflakes} speedBase={THEME.snowSpeedBase} />
      <ScrollProgress />

      {/* Hero */}
      <header ref={heroRef} className="relative flex min-h-[90vh] items-center z-[3]">
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          {/* Circular Bio Photo with stronger blur edges */}
          <div className="flex justify-center mb-8">
            <div className="relative w-75 h-75 md:w-96 md:h-96 overflow-hidden rounded-full ring-4 ring-white/40 shadow-2xl">
              <img
                src="/photos/bio.jpg"
                alt="Emily 'Mimi' Helowicz portrait"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0) 100%, rgba(15,23,42,0.9) 100%)",
                  mixBlendMode: "overlay",
                }}
              />
            </div>
          </div>

          <motion.h1 style={{ y: heroY, opacity: heroOpacity }} className="text-5xl md:text-7xl font-extrabold drop-shadow leading-[1.05]">
            Emily “Mimi” Helowicz
            <span className="block text-2xl md:text-3xl font-medium mt-4 text-white/90">
              An Immersive Figure Skating Journey
            </span>
          </motion.h1>
          <motion.p style={{ opacity: heroOpacity }} className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-white/85">
            Follow the glide, the grit, and the grace—from first edges to confident performance. Scroll to begin.
          </motion.p>
          <div className="mt-10 flex items-center justify-center gap-3 text-white/80">
            <ChevronDown className="h-6 w-6 animate-bounce" />
            <span>Scroll</span>
          </div>
        </div>
      </header>

      {/* Origins */}
      <Section id="origins" eyebrow="Chapter 1" title="Origins on the Ice" subtitle="Where curiosity met cold air and a wide-open rink.">
        <p className="text-lg text-white/85 max-w-3xl mx-auto">
          The first glide is a small miracle. Mimi learned to trust the edge, breathe through the wobble,
          and chase that floating feeling only ice can give.
        </p>
      </Section>

      {/* Milestones */}
      <Section id="milestones" eyebrow="Chapter 2" title="Milestones" subtitle="Tiny steps, brave moments, and the smile that says: again.">
        <div className="space-y-16">
          {MILESTONES.map((m, i) => (
            <div key={`${m.year}-${i}`} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
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

      {/* Olympics */}
      <Section id="olympic-goal" eyebrow="Chapter 3" title="Goal: The 2034 Winter Olympics" subtitle="Salt Lake City, Utah • February 10–26, 2034">
        <Countdown />
      </Section>

      {/* Gallery */}
      <Section id="gallery" eyebrow="Chapter 4" title="Gallery" subtitle="Favorite skating moments">
        <div className="overflow-hidden rounded-3xl ring-1 ring-white/15">
          <motion.div className="flex gap-4 p-4" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {[...GALLERY, ...GALLERY].map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`} className="h-56 w-96 flex-none rounded-2xl object-cover" />
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Gratitude */}
      <Section id="gratitude" eyebrow="Finale" title="Gratitude">
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Thank you to the coaches and staff of the Bowie Ice Arena for making me fall in love with figure skating.”
        </p>
        <br></br>
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Thank you to Coach Greg and the Coaches of the Gardens Sports Academy for refining my skating technique and skill, pushing my further along my journey.”
        </p>
        <br></br>
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “A huge thank you to Coach Anna Prikockis and Coach Rashid Kadyrkaev for all the countless hours you have put in making me an advanced skater, making me get my first Axel and several doubles.”
        </p>
        <br></br>
        <p className="max-w-3xl mx-auto text-white/85 text-center">
          “Great skating is steady work. Mimi brings curiosity to each rep—and that is where breakthroughs live.”
        </p>

      </Section>

      <footer className="relative border-t border-white/10 py-10 text-center text-white/70 z-[3]">
        <p className="text-sm">© {currentYear} Helowicz Family • Built with love and a lot of rink time.</p>
      </footer>

      <BackToTop />
    </main>
  );
}