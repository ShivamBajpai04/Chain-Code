import { useEffect, useRef } from "react";
import { drawCertificateArt } from "@/utils/generativeArt";

interface CertificateArtProps {
  seed: string;
  className?: string;
}

const S = 480;

export default function CertificateArt({ seed, className }: CertificateArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCertificateArt(ctx, S, seed);
  }, [seed]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
