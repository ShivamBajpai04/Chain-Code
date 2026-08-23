import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import ProductMockup from "@/components/ProductMockup";
import HeroSection from "@/components/HeroSection";
import "./newStyle.css";

const rise = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#d4a017]">
      {children}
    </p>
  );
}

const tickerItems: { text: string; status: "sealed" | "new" }[] = [
  { text: "Two Sum sealed · +0.0040 ETH", status: "sealed" },
  { text: "CC-0039 minted · 0x9F4…71B2", status: "sealed" },
  { text: "New problem posted · LRU Cache", status: "new" },
  { text: "Binary Search accepted · minting", status: "new" },
  { text: "CC-0035 · uniqueness 100%", status: "sealed" },
  { text: "Judge0 sandbox · 12ms median run", status: "sealed" },
];

/* ---------------- Page ---------------- */

export default function UpdatedLandingPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleStartSolving = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() < payload.exp * 1000) {
          navigate("/problems");
          return;
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    navigate("/signup");
  };

  return (
    <div className="ledger-rules min-h-screen overflow-hidden bg-[#14102e] text-[#f5f1e8]">
      <Header />

      {/* Hero — copy left, interactive ledger card right */}
      <HeroSection onStart={handleStartSolving} />

      {/* Recent activity ticker */}
      <section className="relative">
        <div className="ledger-marquee relative overflow-hidden border-y border-white/10 py-3">
          <div className="ledger-marquee-track flex w-max items-center gap-10 whitespace-nowrap f-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f1e8]/55">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                <span>{item.text}</span>
                {item.status === "sealed" ? (
                  <span className="text-[#7fb069]">✓ sealed</span>
                ) : (
                  <span className="text-[#d4a017]">◆ new</span>
                )}
                <span className="text-white/20">///</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product mockup */}
      <ProductMockup />

      {/* Technologies */}
      <section className="container border-t border-white/10 pt-16 mt-16">
        <motion.div {...rise} className="flex flex-col items-center">
          <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[rgba(245,241,232,0.62)]">
            Technologies used
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-14">
            {[
              { src: "/react.svg", name: "React" },
              { src: "/go.svg", name: "Go" },
              { src: "/gemini.svg", name: "Gemini" },
              { src: "/ethers.svg", name: "Ethers Js" },
            ].map((tech) => (
              <figure
                key={tech.name}
                className="flex flex-col items-center gap-2 opacity-60 grayscale transition-opacity duration-200 hover:opacity-100"
              >
                <img src={tech.src} alt={tech.name} className="h-7 w-auto" />
                <figcaption className="f-mono text-[11px] uppercase tracking-widest text-[#f5f1e8]/70">
                  {tech.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works — ledger rows */}
      <section id="features" className="container mt-24 scroll-mt-28">
        <motion.div {...rise}>
          <SectionLabel>Procedure</SectionLabel>
          <h2 className="f-display mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold">
            How ChainCode works
          </h2>

          <div className="mt-10 border-t border-white/10">
            {[
              {
                n: "01",
                title: "Solve challenges",
                body: "Pick a problem from the ledger and write your solution. It runs against hidden tests in the Judge0 sandbox before anyone sees it.",
                tag: "Judge0 sandbox",
              },
              {
                n: "02",
                title: "Originality validation",
                body: "Your approach is compared with every prior submission to the problem. Only solutions that differ in substance pass the check.",
                tag: "Uniqueness record",
              },
              {
                n: "03",
                title: "Mint & earn",
                body: "Accepted solutions are minted as certificates held in your wallet. Others can study them on-chain; you are recorded as the original author.",
                tag: "ERC-721 · Holesky",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-b border-white/10 py-8"
              >
                <span className="col-span-2 f-mono text-sm text-[#d4a017] md:col-span-1">
                  {step.n}
                </span>
                <h3 className="f-display col-span-10 text-lg font-semibold md:col-span-4">
                  {step.title}
                </h3>
                <p className="col-span-10 col-start-3 text-sm leading-relaxed text-[rgba(245,241,232,0.62)] md:col-span-5 md:col-start-auto">
                  {step.body}
                </p>
                <span className="col-span-10 col-start-3 f-mono text-[10px] uppercase tracking-widest text-[rgba(245,241,232,0.45)] md:col-span-2 md:col-start-auto md:text-right">
                  {step.tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why tokenize — paper block */}
      <section className="container mt-24">
        <motion.div
          {...rise}
          className="rounded-lg bg-[#f5f1e8] p-8 text-[#14102e] md:p-10"
        >
          <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#14102e]/60">
            The case for it
          </p>
          <h3 className="f-display mt-3 text-2xl font-semibold">
            Why tokenize your solutions
          </h3>
          <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {[
              "Immutable proof of your coding accomplishments",
              "A library of alternative approaches, on demand",
              "Recognition and rewards for innovative solves",
              "Verified expertise you can show an employer",
              "Curated solutions to learn from efficiently",
              "Priority incentives for first-to-solve authors",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm">
                <span
                  aria-hidden
                  className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full border-2 border-[#2e7d32]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232e7d32' stroke-width='3'%3E%3Cpath d='M5 13l4 4L19 7'/%3E%3C/svg%3E\")",
                    backgroundSize: "12px",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <span className="text-[#14102e]/85">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Newsletter */}
      <section className="container mt-24 pb-24">
        <motion.div
          {...rise}
          className="rounded-lg border border-white/[0.09] bg-[#1a1530] p-8 md:p-10"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="md:w-1/2">
              <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-[#d4a017]">
                Dispatches
              </p>
              <h3 className="f-display mt-3 text-2xl font-semibold">
                New problems, on record
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(245,241,232,0.62)]">
                A short note when new challenges open, results are sealed, or
                minting changes. No noise.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row md:w-1/2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow rounded-md border border-white/15 bg-[#f5f1e8] px-4 py-2.5 text-sm text-[#14102e] placeholder:text-[#14102e]/40 focus-visible:border-[#d4a017]"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-md bg-[#d4a017] px-6 py-2.5 text-sm font-semibold text-[#14102e] transition-colors duration-200 hover:bg-[#c2920f]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        <p className="mt-10 f-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(245,241,232,0.35)]">
          ChainCode — civic ledger for code · est. block 1,204,556
        </p>
      </section>
    </div>
  );
}
