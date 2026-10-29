"use client";

import { useEffect, useRef, useState } from "react";

// The stylised Yamuna 22-km stretch, top (Wazirabad) to bottom (Okhla).
export const RIVER_PATH =
  "M150 20 C 60 70, 240 110, 150 165 C 60 220, 240 270, 150 325 C 60 380, 240 430, 150 485 C 110 520, 190 545, 150 615";

export type RiverPoint = { x: number; y: number; p: number };

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgbToHex(r: number, g: number, b: number) {
  const c = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

// Health stops along the stretch, keyed to real DO readings (DPCC Sep 2026):
// Palla alive (6.5) -> Wazirabad not reported -> ISBT/ITO/Okhla stressed (2.9-4.2)
// -> Asgarpur nil (0.0).
const HEALTH_STOPS: [number, string][] = [
  [0, "#2fbf8f"],
  [0.14, "#f0b429"],
  [0.88, "#f0b429"],
  [1, "#f05252"],
];

/** Colour for a point along the river, interpolated from real DO health. */
export function colorForHealth(p: number): string {
  for (let i = 1; i < HEALTH_STOPS.length; i++) {
    const [p0, c0] = HEALTH_STOPS[i - 1];
    const [p1, c1] = HEALTH_STOPS[i];
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0 || 1);
      const [r0, g0, b0] = hexToRgb(c0);
      const [r1, g1, b1] = hexToRgb(c1);
      return rgbToHex(lerp(r0, r1, t), lerp(g0, g1, t), lerp(b0, b1, t));
    }
  }
  return "#f05252";
}

/**
 * River width at a point — thin and clean upstream, visibly fatter downstream,
 * mirroring drain flow piling in (750.4 MGD revised up to 1,324.4 MGD, DJB May 2026).
 */
export function widthForVolume(p: number): number {
  return 3 + 22 * Math.pow(p, 0.8);
}

/**
 * Samples the path into a dense array of points so components can render
 * per-segment strokes (varying width + colour) instead of one flat path.
 */
export function useRiverPoints(path: string, count = 56) {
  const ref = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<RiverPoint[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    const total = ref.current.getTotalLength();
    const pts: RiverPoint[] = [];
    for (let i = 0; i <= count; i++) {
      const p = i / count;
      const pt = ref.current!.getPointAtLength(p * total);
      pts.push({ x: pt.x, y: pt.y, p });
    }
    setPoints(pts);
  }, [count]);

  return { ref, points };
}
