# DESIGN.md — Chain-Code visual law

Read this file before generating or editing any UI in this frontend. Pull every color, font, size, and spacing value from here. If a decision is not covered, ask before inventing.

## Design read

Chain-Code is a coding platform where solutions are judged for originality and minted as NFT certificates. The feeling should be **premium dark ledger**: near-black surfaces, one gold accent, monospaced on-chain data, a live product window in every hero-adjacent slot. Confident and restrained — not "crypto neon", not "playful hackathon".

## Identity

### Type (locked 2025)

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / headings (`f-display`) | **Cabinet Grotesk** | **800** (Extrabold) | letter-spacing -0.02em. Never fake-bold other weights onto it; if you need lighter headings use 700, never synthesize |
| Body / UI | **Inter** | 400–600 | default `body` font |
| Code, hashes, labels, badges (`f-mono`) | **Geist Mono** | 400–500 | uppercase + tracking-[0.2em] for micro-labels |

Rules:
- Headlines are Inter-class sizes with Cabinet Grotesk: hero clamp(2.9rem, 5.8vw, 4.6rem), section h2 clamp(1.75rem, 3vw, 2.25rem).
- One loud thing per screen: the display headline OR one metric. Everything else recedes.
- Micro-labels are always mono, uppercase, tracking-[0.18em]–[0.28em], white/35–45 opacity.

### Color

```
--page:       #14102e   (page bg, near-black indigo)
--surface:    #131020   (product windows, cards)
--surface-2:  #1a1530   (gradient top of floating chips)
--brand-old:  #241e58   (legacy panels — do NOT use in new work)
--paper:      #f5f1e8   (text on dark, light surfaces)
--gold:       #c89d4a → #d4a017 → #ecc76a  (single accent ramp: borders/fills/highlights)
--green:      #7fb069 text / #2e7d32 fill  (success, sealed, verified)
--text-lo:    rgba(245,241,232,0.55–0.62)   (body copy on dark)
--text-faint: rgba(245,241,232,0.35–0.45)   (captions, stats)
```

Rules:
- Gold is the ONLY accent. Status colors appear only on status (sealed/verified = green, minting/pending = gold).
- Primary CTA: vertical gold gradient `from-[#ecc76a] to-[#c89d4a]`, ink text, top hairline `bg-white/40`, gold glow shadow on hover only.
- Secondary CTA: 1px border `white/[0.12]`, no fill, brightens on hover.
- Depth = 1px borders `white/[0.08]–[0.12]` + surface shift + soft black shadow (`shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]`). Blur/glass only on floating chips over content, never on page-level containers.

### Space

- 4px base unit. Section gaps 64px desktop / 32px mobile.
- Content max-width 1100px (`.container`). Hero is asymmetric two-column: copy ~46%, visual ~54%, never dead-centered.
- Hero visual column keeps bottom padding/spacer so floating chips never collide with the next section.

### Backgrounds (hero & sections)

- Line grid: 44px cells, gold at 0.05 alpha, masked with `radial-gradient(ellipse 80% 70% at 50% 35%, …)` so it fades at edges.
- Ambient washes: two radial gradients max per section (gold top-left ~0.055, blue top-right ~0.045).
- Particles: canvas field, ≤50 particles, size 0.6–2px, gold at 0.32 alpha, connecting lines ≤110px at ≤0.1 alpha, gentle mouse repulsion. One instance per page.
- Corner glow blobs: `-left/-right` positioned, blur-[90–100px], accent at ≤0.07 alpha.
- Grain overlay optional; soft-light blend, ≤0.07 opacity.

## Component patterns

### Product window (the "mockup")
Every hero/showcase visual lives inside the standard window frame:
- Rounded-xl, border white/[0.08], bg #131020, heavy black shadow
- Chrome bar: three dots at white/15–10 opacity, centered mono title "chaincode — <view>", h-10
- Content is a UI skeleton or syntax-highlighted code — muted whites (10–25% alpha), accent color only on active elements
- Entrance: lines/rows stagger in 60–120ms apart starting ~0.45s after mount
- Optional results strip: green check + counts in mono, then a minting strip (hexagon token, progress bar 0→96%→sealed state swap, "SEALED" stamp springs in)

### Floating chips
Max two per hero, anchored inside the visual column (never negative offsets beyond -4px):
- w-44 rounded-xl, gradient `from-[#1a1530]/95 to-[#131020]/95`, backdrop-blur, border white/[0.09]
- Top hairline highlight via gradient span
- Structure: big f-display number → mono caption → small visualization (sparkline/ring/bars)
- Gentle counter-phased float (±3px, 5.5–6s); translateZ(50–60px) so they lift with tilt
- Animations draw in once (pathLength/scaleX), no loops except the float

### Loader
Hero shows the themed loader for ~1.4s before reveal: self-drawing gold hexagon (same shape as mint token), pulsing center dot, "Sealing blocks…" mono caption, sweeping progress line. Fades out via AnimatePresence; content entrance animations start during the fade.

### Motion
- Durations 150–450ms ease-out; springs only for stamp/check pops (stiffness ~300, damping ~16).
- Tilt on showcase windows: max ±4°, spring damping 26/stiffness 300, cursor glow radial gold at 0.16 alpha.
- Infinite loops allowed ONLY: particle field, chip float, live-status dot, blinking caret/minting pulse.
- Motion must report state change: minting → progress bar fills then swaps to sealed; never spinner-only.

## Voice

Terse, exact, slightly formal.

- Headline pattern: verb-free statements of fact. "Write it once. Own it forever." Not "Revolutionizing community decisions".
- Buttons say the action: "Start solving", "Mint certificate". Never "Get started", "Learn more".
- Stats are plain facts in mono: "312 solves judged · 41 certificates minted". No "+400%!!" hype without a source.
- Empty states explain and offer next step. Blank ≠ broken.

## Forbidden (AI tells)

Never ship any of these:

- Fraunces, Sora, Space Grotesk, Clash Display, Instrument Serif as heading fonts (tried and rejected — Cabinet Grotesk won)
- Purple-to-blue gradients (`#667eea → #764ba2` family), rainbow gradient text
- Cyan or neon-purple accents (`#38BDF8`, `#A855F8`)
- Legacy purple panels (#241e58) in new components
- Rotated stamps outside the sealed-state context; pinging dots except the single live indicator
- Emoji icons, sparkle decorations
- Centered hero over mesh-gradient background
- Copy like "transform your workflow", "seamless", "empower"

## Audit test

Before calling any screen done, answer honestly: does it use Cabinet Grotesk headings, exactly one gold accent story, mono micro-labels, and 1px-border depth? If any element feels decorative rather than informative, remove it. Iterate by removing until the page survives having things taken away.
