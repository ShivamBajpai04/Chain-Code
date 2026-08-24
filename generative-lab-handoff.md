# Generative Lab — Handoff Document

**File:** `D:\Chain-Code\generative-lab.html` (single self-contained file, zero dependencies, no build step)
**Status:** Working prototype · 46 deterministic generative-art engines · verified with `node --check`
**Purpose:** Research lab for seeded procedural art, built toward an NFT collection generator. Every visual on the page derives from one user-supplied seed string ("DNA"), reproducing identically on any machine — the core determinism mechanic behind identicons and platforms like Art Blocks.

---

## 1. Quick Start

1. Open `generative-lab.html` in any modern browser.
2. Type a seed (e.g. `nft-0042`) in the top-right input → press **Mint** (or Enter).
3. All 46 canvases render from that seed. **Random** rolls a new one.
4. Seed is written to the URL hash (`#nft-0042`) — shareable provenance links.
5. Each card has **Save PNG** (filenames embed technique + seed).

---

## 2. Architecture

### 2.1 Determinism pipeline

```
masterSeed (user string)
  └─ per card: subSeed = masterSeed + "::" + technique.name
       ├─ xmur3(subSeed)      → 32-bit seedInt  (hash #1: drives noise fields)
       ├─ xmur3 again         → mulberry32 rng stream (hash #2: all random draws)
       └─ pickPal(rng)        → one of 7 curated HSL-harmonious palettes
```

- Same input ⇒ byte-identical output, forever, anywhere. No `Math.random()` touches art code.
- Sub-seeding per technique means one mint produces a *coherent but distinct* 46-piece set.
- `g.seedStr` is passed into every draw fn (needed by Initials Avatar; available to all).

### 2.2 Shared libraries (top of `<script>`)

| Helper | Role |
|---|---|
| `xmur3(str)` | String → 32-bit hasher (seeds everything) |
| `mulberry32(a)` | Fast 32-bit seeded PRNG, returns `[0,1)` |
| `hash2 / vnoise / fbm` | Value-noise + 4-octave fractal Brownian motion, seeded by int |
| `PALETTES` | 7 hand-picked 5-color palettes (never random RGB) |
| `hexToRgb / lerpHex / pickPal` | Color plumbing |
| `fitDraw(ctx, pts, S, col, lw)` | Bounding-box fitter used by Dragon + Levy curves |

### 2.3 Technique contract

Every entry in the `TECHS` array:

```js
{
  name: "Flow Field",            // unique, becomes part of sub-seed
  tag: "fidenza core",           // lineage label shown in header
  odds: "exact dupe: ~0 ... ",   // collision math line (see §4)
  desc: "one-line explainer",
  fn(ctx, S, g){ ... }           // S=480 logical px, g={rng, seedInt, pal, seedStr}
}
```

Rules inside `fn`:
- Draw only via `g.rng()` / `g.seedInt`-seeded calls. No time, no network, no globals that mutate.
- Canvas backing store is `S*2` with `ctx.setTransform(2,0,0,2,0,0)` — draw in logical 480-space, get retina sharpness free.
- Clear your own background first.

### 2.4 Page wiring (bottom of `<script>`)

- `mint(seed)` — sets `masterSeed`, syncs input/URL/label, re-renders all cards.
- Cards are plain DOM; `.odds`, `.seed`, `.png` elements per card.
- Init reads `location.hash` so pasted links reproduce the exact collection.

---

## 3. The 46 Techniques

| Class | Techniques |
|---|---|
| Identity/avatar | Identicon (GitHub algo), Bauhaus, Rings, Posterized Noise, Initials Avatar (Substack/Gmail style) |
| Flow/noise fields | Flow Field (Fidenza core), Ridge Lines, Contour Map, Warped Grid, Domain-Warped Marble |
| Packing/tiling | Circle Packing, Voronoi Mosaic, Truchet Tiles, Hex Mosaic |
| Composition | Recursive Split (Mondrian), Kandinsky Cells, Bezier Ribbons, Thread Weave |
| Recursion/fractals | Fractal Tree, Koch Curve, Chaos Game, Hilbert Curve, Barnsley Fern, Dragon Curve, Levy C Curve |
| Math curves | Harmonograph, Lorenz Attractor, Superformula, Spirograph, Rose Garden, Lissajous Tiles, String Art, Phyllotaxis |
| Simulation/emergence | DLA Coral, Reaction-Diffusion (Gray-Scott), Boids Swarm, Perfect Maze |
| Optical/texture | Moire Interference, Ripple Interference, Ordered Dither (Bayer), Radial Halftone, Circuit Traces, Nebula Cloud |

Heaviest renders: Reaction-Diffusion (~320 steps × 92² grid), DLA (~1300 walkers), Boids (O(n²)×frames). Total initial mint ≈ 1–2s on a typical laptop; fine for a research page, batch-generate offline for production.

---

## 4. Uniqueness & Collision Model

Three honest classes of output space (odds lines live on every card):

1. **Deterministic-shape engines** (Fern, Dragon, Levy, Hilbert, Koch): geometry is fixed by constants; only palette varies → space = 7. Twin risk EXTREME. Never use solo as an NFT trait.
2. **Countable discrete spaces**: Identicon = 15 mirrored bits × 360 hues ≈ 11.8M; Truchet = 2⁸¹ tile flips; Maze ≈ 10¹⁰⁰ spanning trees; String Art = 84 combos. Real numbers, real birthday-paradox stakes.
3. **Float-parameter engines** (most of the page): exact pixel dupes ≈ measure-zero. The operative risk is **perceptual near-twins** — same palette + clustered params read as siblings.

Birthday bound: P(any collision in n mints) ≈ 1 − e^(−n²/2M).
Example: 10k drop over an 11.8M space ⇒ ~98% chance at least one duplicate pair exists somewhere without a registry.

Production kill-list (not yet implemented here):
- Dedupe registry of rendered-output hashes
- Perceptual hashing (pHash) + Hamming-distance rejection at mint
- ≥128-bit seeding (mulberry32 state is 32-bit → max ~4.29B distinct streams; fine for 10k, thin for public mint-your-own). Hash tokenId + salt through xmur3 twice or move to a wider PRNG.
- Reserve legendary trait combos explicitly.

---

## 5. How to Add a Technique (5 min)

1. Copy an existing entry in `TECHS`.
2. Set unique `name` (it joins the sub-seed hash — changing names changes art), `tag`, `desc`.
3. Write its `odds` line using the three-class model above. Be honest; that's the point.
4. Implement `fn(ctx, S, g)` obeying the purity rules in §2.3.
5. Reload. Numbering, odds line, PNG export and URL provenance wire up automatically.

No other files. No registration step. The grid is generated from the array.

---

## 6. Research Provenance

- GitHub identicon algorithm: MD5 of user-id string → nibbles → mirrored 5×5 grid (reverse-engineered by dgraham/identicon, stewartlord/identicon.js; github.blog "Identicons!" 2013).
- Fidenza (Tyler Hobbs): flow fields + thick non-colliding strokes + probabilistic palettes (Art Blocks, 2021).
- Art Blocks model: p5.js script stored on-chain; mint assigns hash as DNA; render in browser.
- Boring Avatars: marble/beam/pixel/sunset/ring/bauhaus variants, seeded SVG.
- DiceBear: 55+ styles, HTTP API + libs, MIT/CC0.
- Substack reality check: default avatars are initials-on-hash-color (Gmail pattern), not generative art — replicated as demo #46, including its documented weakness (same-name collisions).
- Classic algorithm sources: Barnsley IFS (85/7/7/1 probabilities), Gray-Scott reaction-diffusion presets, Paul Bourke's DLA notes, marching-squares contour extraction (Jamie Wong), Wikipedia pseudocode for Dragon/Hilbert/Koch/Levy.

---

## 7. Production Path (if this becomes the actual NFT engine)

1. **Split renderers into modules** (`techniques/*.js`) and drive them headless (Node + `canvas` pkg or Puppeteer) to batch-generate collections.
2. **Trait/metadata layer:** emit JSON per token (`trait_type`/`value` + rarity %), pin images + metadata to IPFS, mint ERC-721 (Base/Polygon recommended for cost).
3. **Determinism upgrade:** 256-bit seed = keccak256(tokenId ++ salt); swap mulberry32 for xoshiro128** or splitmix64 chain if supply > ~100k.
4. **Quality gate:** pHash every render, enforce min Hamming distance vs existing supply before allowing mint.
5. **On-chain flavor (optional Art Blocks route):** embed the chosen renderer as a dependency-free script string in contract metadata; frontend re-renders from tokenId forever.
6. **Rarity design:** weighted variant tables + compatibility rules (see Floniks/HashLips workflows researched earlier in this thread).

---

## 8. Known Limits

- Single-file by design; ~1.4k lines total. Splitting is straightforward (§7.1) but not done.
- Fixed logical canvas 480px; DPR hard-coded ×2.
- `history.replaceState` requires http(s) or will silently no-op on some `file://` setups — page still works, just no URL sync.
- Reaction-Diffusion uses edge-clamped Laplacian (visual only, not scientifically exact).
- Odds strings are estimates where marked `~`; exact where the space is truly countable.

— End of handoff.
