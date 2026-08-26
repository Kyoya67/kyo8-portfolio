import type { Project } from "@/types";

function AnalyticsArt() {
  const bars = [40, 65, 35, 80, 55, 90, 45, 70, 60, 95, 50, 75];
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      <line x1="20" y1="150" x2="280" y2="150" stroke="currentColor" strokeOpacity="0.25" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={24 + i * 21}
          y={150 - h}
          width="10"
          height={h}
          fill="currentColor"
          opacity={0.12 + (i % 5) * 0.05}
        />
      ))}
      <polyline
        points={bars.map((h, i) => `${29 + i * 21},${150 - h - 14}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  );
}

function NetworkArt() {
  const nodes = [
    [40, 40], [150, 25], [260, 45], [70, 100], [180, 90], [250, 130], [40, 150], [130, 150],
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [3, 7], [4, 7], [4, 5], [6, 7],
  ];
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="currentColor"
          strokeOpacity="0.3"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.5} fill="currentColor" opacity="0.8" />
      ))}
    </svg>
  );
}

function TerminalArt() {
  const rows = [90, 60, 75, 40, 85, 55, 70, 45];
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      {rows.map((w, i) => (
        <g key={i}>
          <rect x="20" y={18 + i * 18} width="6" height="6" fill="currentColor" opacity="0.5" />
          <rect x="34" y={17 + i * 18} width={w} height="8" fill="currentColor" opacity={0.1 + (i % 4) * 0.05} />
        </g>
      ))}
    </svg>
  );
}

function GridArt() {
  const cells = Array.from({ length: 6 * 4 });
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      {cells.map((_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const on = (col + row * 2) % 5 === 0 || (col === row);
        return (
          <rect
            key={i}
            x={20 + col * 44}
            y={16 + row * 38}
            width="34"
            height="28"
            fill="currentColor"
            opacity={on ? 0.35 : 0.08}
          />
        );
      })}
    </svg>
  );
}

function ChainArt() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={20 + i * 44}
          y={70}
          width="34"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.5}
        />
      ))}
      <line x1="20" y1="90" x2="284" y2="90" stroke="currentColor" strokeOpacity="0.3" />
    </svg>
  );
}

function StreamArt() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" preserveAspectRatio="none">
      {[40, 70, 100, 130].map((y, i) => (
        <path
          key={i}
          d={`M20 ${y} C 90 ${y - 25}, 150 ${y + 25}, 280 ${y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15 + i * 0.1}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

const GRAPHICS: Record<Project["graphic"], () => React.JSX.Element> = {
  analytics: AnalyticsArt,
  network: NetworkArt,
  terminal: TerminalArt,
  grid: GridArt,
  chain: ChainArt,
  stream: StreamArt,
};

export default function ProjectGraphic({ project }: { project: Project }) {
  if (project.imageUrl) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-bg-inset">
        {/* Arbitrary external/S3 URLs, so next/image's domain allowlist doesn't apply. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageUrl}
          alt={project.title.en}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const Art = GRAPHICS[project.graphic];
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border bg-bg-inset text-fg">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-6">
        <Art />
      </div>
    </div>
  );
}
