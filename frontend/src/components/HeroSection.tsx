import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ---------------- Loader ---------------- */

function HeroLoader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#14102e]"
    >
      {/* drawing hexagon */}
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
          <path
            d="M32 4 L56 18 V46 L32 60 L8 46 V18 Z"
            fill="none"
            stroke="rgba(200,157,74,0.15)"
            strokeWidth="2"
          />
          <motion.path
            d="M32 4 L56 18 V46 L32 60 L8 46 V18 Z"
            fill="none"
            stroke="#c89d4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={6 * 12 /* approx perimeter */}
            initial={{ strokeDashoffset: 6 * 12 }}
            animate={{ strokeDashoffset: [6 * 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <motion.span
          animate={{ scale: [1, 0.75, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto block h-2 w-2 rounded-full bg-[#c89d4a]"
        />
      </div>

      <p className="mt-6 f-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        Sealing blocks
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 1] }}
        >
          …
        </motion.span>
      </p>

      {/* thin progress line */}
      <div className="mt-4 h-px w-40 overflow-hidden bg-white/[0.08]">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#c89d4a] to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ---------------- Particle field ---------------- */

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    type P = { x: number; y: number; s: number; vx: number; vy: number };
    const mouse = { x: -9999, y: -9999 };
    let particles: P[] = [];

    const spawn = (): P => ({
      x: Math.random() * width,
      y: Math.random() * height,
      s: Math.random() * 1.4 + 0.6,
      vx: (Math.random() * 0.18 + 0.03) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 0.18 + 0.03) * (Math.random() > 0.5 ? 1 : -1),
    });

    const init = () => {
      particles = Array.from({ length: Math.min(50, Math.floor(width / 26)) }, spawn);
    };

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        if (dx * dx + dy * dy < 12000) {
          p.x -= dx * 0.006;
          p.y -= dy * 0.006;
        }
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,160,23,0.32)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 110) {
            ctx.globalAlpha = 0.1 * (1 - d / 110);
            ctx.strokeStyle = "#d4a017";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    init();
    tick();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ---------------- Tilt ---------------- */

function Tilt({
  children,
  intensity = 4,
}: {
  children: React.ReactNode;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 26, stiffness: 300 });
  const sy = useSpring(y, { damping: 26, stiffness: 300 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);

  return (
    <div
      ref={ref}
      style={{ perspective: 1200 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------- Shimmer text ---------------- */

function ShimmerLine({ text }: { text: string }) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPos((p) => (p + 1) % 360), 60);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="bg-gradient-to-r from-[#c89d4a] via-[#f5f1e8] to-[#c89d4a]/50 bg-clip-text text-transparent"
      style={{ backgroundSize: "250% 100%", backgroundPosition: `${pos}% 50%` }}
    >
      {text}
    </span>
  );
}

/* ---------------- Code editor mockup ---------------- */

const C = {
  kw: "#c792ea", // keywords
  fn: "#ecc76a", // functions
  str: "#a5d6a7", // strings
  num: "#82aaff", // numbers
  var: "#f5f1e8",
  dim: "#5b5580", // punctuation / dim
  cm: "#4a4668", // comment
};

function CodeEditorWindow() {
  const [minted, setMinted] = useState(false);

  // tokenized lines: [colorKey, text][]
  const lines: [keyof typeof C, string][][] = [
    [["cm", "// two-sum · accepted · 12ms"]],
    [["kw", "function"], ["fn", " twoSum"], ["dim", "("], ["var", "nums"], ["dim", ", "], ["var", "target"], ["dim", ") {"]],
    [["var", "  "], ["kw", "const"], ["var", " seen "], ["dim", "= "], ["kw", "new"], ["fn", " Map"], ["dim", "();"]],
    [["var", "  "], ["kw", "for"], ["dim", " ("], ["kw", "let"], ["var", " i "], ["dim", "= "], ["num", "0"], ["dim", "; "], ["var", "i "], ["dim", "< "], ["var", "nums"], ["dim", "."], ["var", "length"], ["dim", "; "], ["var", "i"], ["dim", "++) {"]],
    [["kw", "    const"], ["var", " need "], ["dim", "= "], ["var", "target "], ["dim", "- "], ["var", "nums"], ["dim", "["], ["var", "i"], ["dim", "];"]],
    [["kw", "    if"], ["dim", " ("], ["var", "seen"], ["dim", "."], ["fn", "has"], ["dim", "("], ["var", "need"], ["dim", ")) "]],
    [["kw", "      return"], ["dim", " ["], ["var", "seen"], ["dim", "."], ["fn", "get"], ["dim", "("], ["var", "need"], ["dim", "), "], ["var", "i"], ["dim", "];"]],
    [["var", "    seen"], ["dim", "."], ["fn", "set"], ["dim", "("], ["var", "nums"], ["dim", "["], ["var", "i"], ["dim", "], "], ["var", "i"], ["dim", ");"]],
    [["var", "  }"]],
    [["var", "}"]],
    [["dim", ""]],
    [["cm", "// verdict: original approach · no prior match"]],
  ];

  return (
    <div className="relative">
      {/* soft under-glow */}
      <div aria-hidden className="absolute -inset-6 rounded-3xl bg-[#d4a017]/[0.05] blur-2xl" />

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#131020] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* chrome */}
        <div className="flex h-10 items-center border-b border-white/[0.06] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="mx-auto f-mono text-[11px] tracking-wide text-white/30">
            chaincode — editor
          </span>
          <span className="w-12" />
        </div>

        {/* tab bar */}
        <div className="flex items-stretch border-b border-white/[0.06] bg-black/20 f-mono text-[10px]">
          <span className="flex items-center gap-2 border-r border-white/[0.06] border-t-2 border-t-[#d4a017]/70 bg-[#131020] px-4 py-2 text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a017]/70" />
            twoSum.ts
          </span>
          <span className="flex items-center gap-2 border-r border-white/[0.06] px-4 py-2 text-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            tests.ts
          </span>
        </div>

        {/* editor body */}
        <div className="grid grid-cols-[auto_1fr]">
          {/* line numbers */}
          <div
            aria-hidden
            className="select-none border-r border-white/[0.05] bg-black/15 px-3 py-3 text-right f-mono text-[11px] leading-6 text-white/15"
          >
            {lines.map((_, i) => (
              <div key={i}>{String(i + 1).padStart(2, " ")}</div>
            ))}
          </div>

          {/* code */}
          <pre className="overflow-x-auto px-4 py-3 f-mono text-[11px] leading-6 md:text-xs">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.05, duration: 0.2 }}
                className="whitespace-pre"
              >
                {line.map(([k, t], j) => (
                  <span key={j} style={{ color: C[k] }}>
                    {t}
                  </span>
                ))}
                {/* blinking caret on last visible code line */}
                {i === 9 && (
                  <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 animate-pulse bg-[#d4a017]/70" />
                )}
              </motion.div>
            ))}
          </pre>
        </div>

        {/* results strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.35 }}
          className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/[0.06] bg-black/25 px-4 py-2.5 f-mono text-[10px]"
        >
          <span className="flex items-center gap-1.5 text-[#7fb069]">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            14/14 tests passed
          </span>
          <span className="text-white/35">runtime 12ms</span>
          <span className="text-white/35">uniqueness</span>
          <span className="text-[#c89d4a]">100%</span>
        </motion.div>

        {/* minting strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.35 }}
          className="relative flex items-center gap-3 border-t border-white/[0.06] bg-gradient-to-r from-[#c89d4a]/[0.06] to-transparent px-4 py-2.5"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            {/* hexagon token */}
            <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full">
              <motion.path
                d="M18 2 L32 10 V26 L18 34 L4 26 V10 Z"
                fill="rgba(200,157,74,0.08)"
                stroke="#c89d4a"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 1.7 }}
              />
            </svg>
            {minted ? (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-[#c89d4a]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            ) : (
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="block h-2 w-2 rounded-full bg-[#c89d4a]/70"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate f-mono text-[10px] tracking-wide text-white/70">
                {minted ? "Certificate sealed" : "Minting certificate…"}
              </p>
              <p className="shrink-0 f-mono text-[9px] text-white/35">
                {minted ? "CC-0043 · erc-721" : "tx 0x8f3e…c21a"}
              </p>
            </div>
            {/* progress line */}
            <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
              {!minted ? (
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#c89d4a]/50 to-[#ecc76a]"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "72%", "96%"] }}
                  transition={{ duration: 2.6, delay: 1.9, times: [0, 0.7, 1], ease: "easeInOut" }}
                  onAnimationComplete={() => setMinted(true)}
                />
              ) : (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="h-full w-full origin-left rounded-full bg-[#7fb069]/70"
                />
              )}
            </div>
          </div>

          {/* minted stamp */}
          {minted && (
            <motion.span
              initial={{ opacity: 0, rotate: -8, scale: 1.4 }}
              animate={{ opacity: 1, rotate: -4, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="shrink-0 rounded-sm border border-[#c89d4a]/50 px-2 py-0.5 f-mono text-[8px] uppercase tracking-[0.22em] text-[#c89d4a]"
            >
              sealed
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Floating chips ---------------- */

function StatChip() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 1, ease: "easeOut" }}
      className="absolute left-0 top-6 z-20 hidden md:block lg:-left-4"
    >
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-44 overflow-hidden rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#1a1530]/95 to-[#131020]/95 p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur"
        style={{ transform: "translateZ(50px)" }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <p className="f-display text-2xl font-semibold leading-none text-[#f5f1e8]">+X%</p>
        <p className="mt-2 f-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
          improved streaks
        </p>
        <svg viewBox="0 0 120 32" className="mt-3 h-8 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c89d4a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#c89d4a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 26 L17 22 L34 24 L51 15 L68 18 L85 9 L102 11 L120 3 L120 32 L0 32 Z"
            fill="url(#spark-fill)"
          />
          <motion.path
            d="M0 26 L17 22 L34 24 L51 15 L68 18 L85 9 L102 11 L120 3"
            fill="none"
            stroke="#d4a017"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1.4, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function VerifyChip() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 1.15, ease: "easeOut" }}
      className="absolute bottom-6 right-0 z-20 hidden md:block lg:-right-4"
    >
      <motion.div
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="relative w-44 overflow-hidden rounded-xl border border-white/[0.09] bg-gradient-to-b from-[#12241a]/95 to-[#131020]/95 p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur"
        style={{ transform: "translateZ(60px)" }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7fb069]/40 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="relative h-11 w-11">
            {/* progress ring */}
            <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(127,176,105,0.15)" strokeWidth="2.5" />
              <motion.circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke="#7fb069"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 19}
                initial={{ strokeDashoffset: 2 * Math.PI * 19 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.4, delay: 1.5, ease: "easeInOut" }}
              />
            </svg>
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 m-auto h-4 w-4 text-[#7fb069]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-right">
            <p className="f-display text-xl font-semibold leading-none text-[#f5f1e8]">100%</p>
            <p className="mt-1 f-mono text-[8px] uppercase tracking-[0.2em] text-[#7fb069]/80">
              unique
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-[#f5f1e8]">Originality verified</p>
        {/* comparison bars */}
        <div className="mt-2.5 space-y-1.5">
          {["w-full", "w-3/4", "w-full"].map((w, i) => (
            <motion.div
              key={i}
              className={`h-1 ${w} rounded-full`}
              style={
                i === 2
                  ? { backgroundColor: "#2e7d32" }
                  : { border: "1px solid rgba(255,255,255,0.09)" }
              }
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.7 + i * 0.15 }}
            />
          ))}
        </div>
        <p className="mt-2.5 f-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          sealed on-chain · erc-721
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Hero ---------------- */

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pb-28 md:pt-44">
      {/* base wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 18% -12%, rgba(212,160,23,0.055), transparent 60%), radial-gradient(800px 520px at 88% 20%, rgba(59,130,246,0.045), transparent 62%)",
        }}
      />
      {/* line grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(212,160,23,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 35%, black 25%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 35%, black 25%, transparent 80%)",
        }}
      />

      <ParticleField />

      <AnimatePresence>{loading && <HeroLoader />}</AnimatePresence>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-12 xl:gap-16">
          {/* ---- copy ---- */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            className="w-full lg:w-[46%]"
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-[#c89d4a]/[0.22] bg-[#c89d4a]/[0.06] px-3.5 py-1.5 f-mono text-[10px] uppercase tracking-[0.28em] text-[#c89d4a]"
            >
              <span className="h-1 w-1 rounded-full bg-[#c89d4a]" />
              On-chain proof of original code
            </motion.span>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-8 f-display text-[clamp(2.9rem,5.8vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-[#f5f1e8]"
            >
              Write it once.
              <br />
              <ShimmerLine text="Own it forever." />
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-7 max-w-md text-base leading-relaxed text-white/55 md:text-lg"
            >
              Your solution runs in a sandbox against hidden tests, gets checked
              against every prior submission, and mints as an NFT certificate
              with your wallet stamped beside it.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                onClick={onStart}
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-b from-[#ecc76a] to-[#c89d4a] px-7 py-3 text-sm font-semibold text-[#14102e] shadow-[0_10px_30px_-8px_rgba(200,157,74,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(200,157,74,0.65)] active:translate-y-0"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
                Start solving
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <a
                href="#features"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] px-7 py-3 text-sm font-medium text-white/75 transition-colors duration-200 hover:border-white/25 hover:text-white"
              >
                How it works
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-12 flex items-center gap-6 f-mono text-[10px] uppercase tracking-[0.22em] text-white/35"
            >
              <span>312 solves judged</span>
              <span className="h-3 w-px bg-white/15" />
              <span>41 certificates minted</span>
              <span className="h-3 w-px bg-white/15" />
              <span>updated live</span>
            </motion.div>
          </motion.div>

          {/* ---- visual ---- */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-xl lg:w-[54%] lg:max-w-none"
          >
            <StatChip />
            <VerifyChip />
            <Tilt intensity={3.5}>
              <CodeEditorWindow />
            </Tilt>
            {/* spacer so the bottom chip never overlaps following content */}
            <div className="hidden h-10 md:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
