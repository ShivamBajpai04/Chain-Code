// Ported from generative-lab.html — 11 of its 46 techniques (numbers below
// match the lab's numbering): #5 Flow Field, #6 Ridge Lines, #9 Truchet
// Tiles, #11 Fractal Tree, #25 Contour Map, #29 Bezier Ribbons, #30 Nebula
// Cloud, #31 Kaleidoscope, #41 Radial Halftone, #42 Boids Swarm, #43
// Domain-Warped Marble. Deterministic: same seed -> byte-identical output
// forever. Seed by submission._id (an immutable Mongo ObjectId, not
// username/title) so certificates don't collide when data gets renamed.
//
// Each mint seeds two independent choices: which technique renders, and
// which accent palette colors it — so certificates vary in both shape and
// color while every palette stays within the app's dark-jewel-tone family.
// Backgrounds are each technique's own authored tone (all near-black,
// already close to the app's #14102e) — only the accent `pal` array is
// swapped per mint, exactly like the lab's own mint-vs-technique split.

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x: number, y: number, s: number) {
  let h = (s ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s);
  const c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, s: number) {
  let val = 0, amp = 0.5, f = 1;
  for (let i = 0; i < 4; i++) {
    val += amp * vnoise(x * f, y * f, s + i * 101);
    amp *= 0.5;
    f *= 2;
  }
  return val;
}

function hexToRgb(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function lerpHex(a: string, b: string, t: number) {
  const A = hexToRgb(a), B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// curated dark-jewel-tone palettes — variety across mints, always cohesive
// with the app's gold/purple identity
const PALETTES: string[][] = [
  ["#e8c664", "#d4a017", "#ecc76a", "#f5f1e8", "#c89d4a"], // gold
  ["#e88ca0", "#d4477a", "#f0a8c4", "#f5f1e8", "#c9578a"], // rose
  ["#5fd4c4", "#2a9d8f", "#8fe8d8", "#f5f1e8", "#3ab5a3"], // teal
  ["#f4a261", "#e76f51", "#ffb37a", "#f5f1e8", "#d9834a"], // amber
  ["#7fb3e8", "#4a7fc9", "#a8d0f5", "#f5f1e8", "#5f95d9"], // ice blue
  ["#7fb069", "#52b69a", "#a8dba8", "#f5f1e8", "#4f9e7a"], // emerald
];

interface G {
  rng: () => number;
  seedInt: number;
  pal: string[];
}

type TechFn = (ctx: CanvasRenderingContext2D, S: number, g: G) => void;

const techFlowField: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(0, 0, S, S);
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = 0.65;
  for (let i = 0; i < 420; i++) {
    let x = g.rng() * S, y = g.rng() * S;
    ctx.strokeStyle = g.pal[i % g.pal.length];
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 55; s++) {
      const a = fbm(x * 0.004, y * 0.004, g.seedInt) * Math.PI * 4;
      x += Math.cos(a) * 2.2;
      y += Math.sin(a) * 2.2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

const techRidgeLines: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0c0e13";
  ctx.fillRect(0, 0, S, S);
  const rows = 34;
  ctx.strokeStyle = "#e8eaf0";
  ctx.lineWidth = 1.4;
  for (let j = 0; j < rows; j++) {
    const baseY = S * 0.16 + j * (S * 0.8 / rows);
    ctx.beginPath();
    ctx.moveTo(0, S);
    for (let px = 0; px <= S; px += 4) {
      const n = fbm(px * 0.008, j * 0.35, g.seedInt);
      const peak = Math.pow(Math.max(0, Math.sin((px / S) * Math.PI)), 1.5);
      ctx.lineTo(px, baseY - n * n * peak * S * 0.16);
    }
    ctx.lineTo(S, S);
    ctx.closePath();
    ctx.fillStyle = "#0c0e13";
    ctx.fill();
    ctx.beginPath();
    for (let px = 0; px <= S; px += 4) {
      const n = fbm(px * 0.008, j * 0.35, g.seedInt);
      const peak = Math.pow(Math.max(0, Math.sin((px / S) * Math.PI)), 1.5);
      const py = baseY - n * n * peak * S * 0.16;
      px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = g.pal[j % g.pal.length];
    ctx.stroke();
  }
};

const techTruchetTiles: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#10141c";
  ctx.fillRect(0, 0, S, S);
  const n = 9, t = S / n;
  ctx.lineWidth = t * 0.16;
  ctx.lineCap = "round";
  for (let ix = 0; ix < n; ix++)
    for (let iy = 0; iy < n; iy++) {
      const x = ix * t, y = iy * t;
      ctx.strokeStyle = g.pal[(ix + iy) % g.pal.length];
      if (g.rng() < 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, t / 2, 0, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + t, y + t, t / 2, Math.PI, Math.PI * 1.5);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x + t, y, t / 2, Math.PI / 2, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y + t, t / 2, Math.PI * 1.5, Math.PI * 2);
        ctx.stroke();
      }
    }
};

const techFractalTree: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, S, S);
  ctx.lineCap = "round";
  (function branch(x: number, y: number, len: number, ang: number, d: number) {
    if (d === 0 || len < 4) {
      if (g.rng() < 0.4) {
        ctx.fillStyle = g.pal[Math.floor(g.rng() * g.pal.length)];
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    const nx = x + Math.cos(ang) * len, ny = y + Math.sin(ang) * len;
    ctx.strokeStyle = "#8a6a4f";
    ctx.lineWidth = Math.max(0.8, d * 0.9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    const spread = 0.35 + g.rng() * 0.45;
    branch(nx, ny, len * (0.68 + g.rng() * 0.1), ang - spread, d - 1);
    branch(nx, ny, len * (0.68 + g.rng() * 0.1), ang + spread, d - 1);
  })(S / 2, S * 0.96, S * 0.22, -Math.PI / 2, 9);
};

const techContourMap: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, S, S);
  const N = 34, cs = S / N;
  const F: number[][] = [];
  for (let j = 0; j <= N; j++) {
    F[j] = [];
    for (let i = 0; i <= N; i++) F[j][i] = fbm(i * 0.18, j * 0.18, g.seedInt);
  }
  const levels = 7;
  for (let L = 0; L < levels; L++) {
    const th = 0.28 + L * (0.46 / levels);
    ctx.strokeStyle = g.pal[L % g.pal.length];
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const a = F[j][i], b = F[j][i + 1], c = F[j + 1][i + 1], d = F[j + 1][i];
        const cr: number[][] = [];
        if (a > th !== b > th) cr.push([i * cs + cs * ((th - a) / (b - a)), j * cs]);
        if (b > th !== c > th) cr.push([(i + 1) * cs, j * cs + cs * ((th - b) / (c - b))]);
        if (d > th !== c > th) cr.push([i * cs + cs * ((th - d) / (c - d)), (j + 1) * cs]);
        if (a > th !== d > th) cr.push([i * cs, j * cs + cs * ((th - a) / (d - a))]);
        if (cr.length === 2) {
          ctx.moveTo(cr[0][0], cr[0][1]);
          ctx.lineTo(cr[1][0], cr[1][1]);
        } else if (cr.length === 4) {
          ctx.moveTo(cr[0][0], cr[0][1]);
          ctx.lineTo(cr[1][0], cr[1][1]);
          ctx.moveTo(cr[2][0], cr[2][1]);
          ctx.lineTo(cr[3][0], cr[3][1]);
        }
      }
    ctx.stroke();
  }
};

const techBezierRibbons: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#f2ede4";
  ctx.fillRect(0, 0, S, S);
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = g.pal[i % g.pal.length];
    ctx.lineWidth = S * (0.03 + g.rng() * 0.08);
    ctx.beginPath();
    ctx.moveTo(-20, S * g.rng());
    ctx.bezierCurveTo(S * g.rng(), S * g.rng(), S * g.rng(), S * g.rng(), S + 20, S * g.rng());
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

const techNebulaCloud: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const x = g.rng() * S, y = g.rng() * S, r = S * (0.18 + g.rng() * 0.25);
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, g.pal[i % g.pal.length]);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 320; i++) {
    const x = g.rng() * S, y = g.rng() * S, rr = g.rng() < 0.85 ? 1 : 2.2;
    ctx.globalAlpha = 0.25 + g.rng() * 0.75;
    ctx.fillStyle = g.rng() < 0.7 ? "#ffffff" : g.pal[i % g.pal.length];
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

const techKaleidoscope: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0a0d13";
  ctx.fillRect(0, 0, S, S);
  const sym = 8, wedge = (Math.PI * 2) / sym;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.8;
  for (let sI = 0; sI < 22; sI++) {
    const col = g.pal[sI % g.pal.length];
    const npts = 3 + Math.floor(g.rng() * 4);
    let a0 = g.rng() * wedge * 0.8;
    const base: number[][] = [];
    for (let p = 0; p < npts; p++) {
      base.push([a0, S * (0.1 + g.rng() * 0.38)]);
      a0 += wedge * (0.08 + g.rng() * 0.12);
    }
    for (let m = 0; m < 2; m++)
      for (let k = 0; k < sym; k++) {
        ctx.strokeStyle = col;
        ctx.beginPath();
        base.forEach((pr, i) => {
          const ang = (m === 0 ? 1 : -1) * pr[0] + k * wedge;
          const px = S / 2 + pr[1] * Math.cos(ang), py = S / 2 + pr[1] * Math.sin(ang);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
  }
  ctx.globalAlpha = 1;
};

const techRadialHalftone: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0a0c11";
  ctx.fillRect(0, 0, S, S);
  const gs = 13;
  for (let gx = gs / 2; gx < S; gx += gs)
    for (let gy = gs / 2; gy < S; gy += gs) {
      const vig = 1 - Math.hypot(gx - S / 2, gy - S / 2) / (S * 0.72);
      const val = fbm(gx * 0.007, gy * 0.007, g.seedInt);
      const r = Math.max(0, val * 1.35 - 0.18) * Math.max(0, vig) * gs * 0.62;
      if (r < 0.5) continue;
      ctx.fillStyle = g.pal[Math.min(g.pal.length - 1, Math.floor(val * 1.8 * g.pal.length))];
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }
};

// tuned down from the lab's 80 agents / 110 frames — O(n^2) per frame, kept
// small so a page rendering a dozen cards at once stays snappy
const techBoidsSwarm: TechFn = (ctx, S, g) => {
  ctx.fillStyle = "#0a0d12";
  ctx.fillRect(0, 0, S, S);
  const n = 36, frames = 60;
  const px: number[] = [], py: number[] = [], vx: number[] = [], vy: number[] = [];
  for (let i = 0; i < n; i++) {
    px.push(S / 2 + (g.rng() - 0.5) * S * 0.4);
    py.push(S / 2 + (g.rng() - 0.5) * S * 0.4);
    const a = g.rng() * Math.PI * 2;
    vx.push(Math.cos(a) * 2);
    vy.push(Math.sin(a) * 2);
  }
  ctx.lineWidth = 1.1;
  ctx.globalAlpha = 0.5;
  for (let f = 0; f < frames; f++)
    for (let i = 0; i < n; i++) {
      let ax = 0, ay = 0, cn = 0, cxx = 0, cyy = 0, avx = 0, avy = 0;
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const dx = px[j] - px[i], dy = py[j] - py[i], d2 = dx * dx + dy * dy;
        if (d2 > 1156 || d2 === 0) continue;
        cn++;
        cxx += px[j];
        cyy += py[j];
        avx += vx[j];
        avy += vy[j];
        if (d2 < 144) {
          ax -= dx * 0.05;
          ay -= dy * 0.05;
        }
      }
      if (cn) {
        ax += (cxx / cn - px[i]) * 0.004 + (avx / cn - vx[i]) * 0.06;
        ay += (cyy / cn - py[i]) * 0.004 + (avy / cn - vy[i]) * 0.06;
      }
      vx[i] += ax;
      vy[i] += ay;
      const sp = Math.hypot(vx[i], vy[i]) || 1;
      const cl = Math.max(1.3, Math.min(2.6, sp));
      vx[i] = (vx[i] / sp) * cl;
      vy[i] = (vy[i] / sp) * cl;
      const ox = px[i], oy = py[i];
      px[i] = (px[i] + vx[i] + S) % S;
      py[i] = (py[i] + vy[i] + S) % S;
      ctx.strokeStyle = g.pal[i % g.pal.length];
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(px[i], py[i]);
      ctx.stroke();
    }
  ctx.globalAlpha = 1;
};

// step size widened from the lab's 3px to 6px — quarters the per-card cost,
// still smooth at thumbnail size
const techDomainWarpedMarble: TechFn = (ctx, S, g) => {
  const sI = g.seedInt;
  const step = 6;
  for (let x = 0; x < S; x += step)
    for (let y = 0; y < S; y += step) {
      const q1 = fbm(x * 0.004, y * 0.004, sI);
      const q2 = fbm(x * 0.004 + 5.2, y * 0.004 + 1.3, sI + 31);
      const w = fbm(x * 0.005 + 4 * q1, y * 0.005 + 4 * q2, sI + 77);
      let t = Math.abs(Math.sin(x * 0.012 + y * 0.007 + w * 7));
      t = Math.pow(t, 0.7);
      ctx.fillStyle = lerpHex(g.pal[0], g.pal[g.pal.length - 1], t);
      ctx.fillRect(x, y, step, step);
      if (t > 0.82) {
        ctx.fillStyle = g.pal[2 % g.pal.length];
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, y, step, step);
        ctx.globalAlpha = 1;
      }
    }
};

const TECHNIQUES: TechFn[] = [
  techFlowField, // #5
  techRidgeLines, // #6
  techTruchetTiles, // #9
  techFractalTree, // #11
  techContourMap, // #25
  techBezierRibbons, // #29
  techNebulaCloud, // #30
  techKaleidoscope, // #31
  techRadialHalftone, // #41
  techBoidsSwarm, // #42
  techDomainWarpedMarble, // #43
];

export function drawCertificateArt(ctx: CanvasRenderingContext2D, S: number, seedStr: string) {
  const hTech = xmur3(seedStr + "::tech")();
  const hPal = xmur3(seedStr + "::pal")();
  const hArt = xmur3(seedStr + "::art")();
  const rng = mulberry32(hArt);
  const tech = TECHNIQUES[hTech % TECHNIQUES.length];
  const pal = PALETTES[hPal % PALETTES.length];
  tech(ctx, S, { rng, seedInt: hArt, pal });
}
