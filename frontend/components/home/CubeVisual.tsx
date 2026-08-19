"use client";

import { useEffect, useRef } from "react";

const GRID = 5;
const STEP = 2 / GRID;

type Point3 = [number, number, number];

function buildGridLines(): [Point3, Point3][] {
  const lines: [Point3, Point3][] = [];
  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const a = -1 + i * STEP;
      const b = -1 + j * STEP;
      lines.push([
        [-1, a, b],
        [1, a, b],
      ]);
      lines.push([
        [a, -1, b],
        [a, 1, b],
      ]);
      lines.push([
        [a, b, -1],
        [a, b, 1],
      ]);
    }
  }
  return lines;
}

const LINES = buildGridLines();

export default function CubeVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let angle = 0.6;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function isDark() {
      return document.documentElement.getAttribute("data-theme") !== "light";
    }

    function draw() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + h * 0.04;
      const scale = Math.min(w, h) * 0.30;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const tilt = 0.62;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const dark = isDark();
      const rgb = dark ? "243, 243, 241" : "18, 18, 18";

      function project([x, y, z]: Point3) {
        const rx = x * cos + z * sin;
        const rz = -x * sin + z * cos;
        const ry = y * ct - rz * st;
        const rz2 = y * st + rz * ct;
        const depth = rx * 0.3 + ry * 0.3 + rz2;
        const sx = cx + rx * scale;
        const sy = cy - ry * scale * 0.86 + rz2 * scale * 0.12;
        return { sx, sy, depth };
      }

      const projected = LINES.map(([p1, p2]) => {
        const a = project(p1);
        const b = project(p2);
        return { a, b, depth: (a.depth + b.depth) / 2 };
      }).sort((l1, l2) => l1.depth - l2.depth);

      for (const line of projected) {
        const t = (line.depth + 1.6) / 3.2;
        const alpha = 0.05 + Math.max(0, Math.min(1, t)) * 0.22;
        ctx.strokeStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(line.a.sx, line.a.sy);
        ctx.lineTo(line.b.sx, line.b.sy);
        ctx.stroke();
      }

      const corners: Point3[] = [];
      for (const x of [-1, 1]) {
        for (const y of [-1, 1]) {
          for (const z of [-1, 1]) {
            corners.push([x, y, z]);
          }
        }
      }
      for (const c of corners) {
        const p = project(c);
        const t = (p.depth + 1.6) / 3.2;
        ctx.fillStyle = `rgba(${rgb}, ${(0.35 + t * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      angle += reduceMotion ? 0 : 0.0016;
      draw();
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-lg">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
