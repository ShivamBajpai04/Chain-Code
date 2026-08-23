import { CheckCircle2 } from "lucide-react";

type Line = { parts: { t: string; c?: string }[]; hl?: boolean };

const G = "#d4a017";

const codeLines: Line[] = [
  {
    parts: [{ t: "// Two Sum - find indices that add up to target", c: "rgba(245,241,232,0.35)" }],
  },
  { parts: [{ t: "" }] },
  {
    parts: [
      { t: "function", c: G },
      { t: " twoSum(nums: number[], target: number) {" },
    ],
  },
  {
    parts: [
      { t: "  const", c: G },
      { t: " seen = new Map();" },
    ],
  },
  {
    parts: [
      { t: "  for", c: G },
      { t: " (let", c: G },
      { t: " i = 0; i < nums.length; i++) {" },
    ],
  },
  {
    parts: [
      { t: "    const", c: G },
      { t: " need = target - nums[i];" },
    ],
  },
  {
    hl: true,
    parts: [
      { t: "    if", c: G },
      { t: " (seen.has(need)) " },
      { t: "return", c: G },
      { t: " [seen.get(need), i];" },
    ],
  },
  {
    parts: [{ t: "    seen.set(nums[i], i);" }],
  },
  { parts: [{ t: "  }" }] },
  { parts: [{ t: "};" }] },
];

function EditorPanel() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 text-left">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/25 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#f5f1e8]/60" />
        <span className="h-2 w-2 rounded-full bg-[#d4a017]/80" />
        <span className="h-2 w-2 rounded-full ring-1 ring-white/25" />
        <span className="ml-auto font-mono text-[10px] tracking-wide text-[#f5f1e8]/60">
          solution.js
        </span>
      </div>

      <div className="overflow-x-auto bg-black/25 p-3">
        <div className="flex gap-2 font-mono text-[11px] leading-6">
          <div className="select-none text-right text-[#f5f1e8]/30">
            {[...Array(codeLines.length)].map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            {codeLines.map((l, i) => (
              <div
                key={i}
                className={`whitespace-pre ${l.hl ? "rounded bg-[#d4a017]/15 px-1" : ""}`}
              >
                {l.parts.map((p, j) => (
                  <span key={j} style={{ color: p.c ?? "rgba(245,241,232,0.85)" }}>
                    {p.t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
          <button className="rounded-md bg-[#d4a017] px-3 py-1 font-mono text-[11px] font-medium text-[#14102e] transition-colors duration-200 hover:bg-[#c2920f]">
            Cast run
          </button>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#f5f1e8]/50">
            <CheckCircle2 className="h-3 w-3 text-[#7fb069]" />
            Judge0 · 12ms · Accepted
          </span>
        </div>
      </div>
    </div>
  );
}

function Certificate() {
  return (
    <div className="relative mx-auto w-full max-w-[270px] rotate-[-2deg] rounded-lg border border-[#14102e]/25 border-2 bg-[#f5f1e8] p-4 text-left">
      <div className="absolute -right-3 -top-3 flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border-2 border-[#d4a017] bg-[#14102e]">
        <div className="m-1 flex h-full w-full items-center justify-center rounded-full border border-dashed border-[#d4a017]/70">
          <CheckCircle2 className="h-5 w-5 text-[#d4a017]" />
        </div>
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#14102e]/55">
        chaincode · protocol
      </p>
      <h4 className="f-display mt-2 text-xl font-semibold leading-snug text-[#14102e]">
        Certificate of Originality
      </h4>
      <p className="mt-1 font-mono text-[10px] text-[#14102e]/70">
        Problem #001 · Two Sum
      </p>

      <div className="my-3 border-t border-[#14102e]/15" />

      <div className="space-y-1.5 font-mono text-[10px] text-[#14102e]/75">
        <div className="flex justify-between">
          <span>Author</span>
          <span>0xAbC…099A</span>
        </div>
        <div className="flex justify-between">
          <span>Network</span>
          <span>Holesky</span>
        </div>
        <div className="flex justify-between">
          <span>Token ID</span>
          <span>CC-0042</span>
        </div>
      </div>

      <div className="mt-3 border-t border-[#14102e]/15 pt-3">
        <span className="inline-block rotate-[-3deg] rounded-sm border-2 border-[#2e7d32] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[#2e7d32]/80">
          Unique ✓ Verified
        </span>
      </div>
    </div>
  );
}

export default function ProductMockup() {
  return (
    <section className="container relative z-10 mt-14 md:mt-16">
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <EditorPanel />

        <div className="hidden flex-col items-center self-center lg:flex">
          <span className="h-12 w-px border-l border-dashed border-[#f5f1e8]/25" />
          <span className="my-1.5 rounded-full border border-[#2e7d32]/50 bg-[#2e7d32]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#7fb069]">
            verified
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4a017]">
            mint
          </span>
          <span className="mt-1.5 h-12 w-px border-l border-dashed border-[#f5f1e8]/25" />
        </div>

        <Certificate />
      </div>
    </section>
  );
}
