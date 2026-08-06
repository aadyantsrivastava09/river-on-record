"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function Chart({
  option,
  className = "h-72 w-full",
}: {
  option: echarts.EChartsOption;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
    chart.setOption(option);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={ref} className={className} />;
}

export const AXIS = {
  axisLine: { lineStyle: { color: "rgba(148,176,190,0.25)" } },
  axisLabel: { color: "#7e97a6", fontFamily: "JetBrains Mono, monospace", fontSize: 11 },
  splitLine: { lineStyle: { color: "rgba(148,176,190,0.08)" } },
} as const;

export const TOOLTIP = {
  trigger: "axis" as const,
  backgroundColor: "#0e1921",
  borderColor: "rgba(148,176,190,0.25)",
  textStyle: { color: "#e9f1f5", fontFamily: "Inter, sans-serif", fontSize: 12 },
};
