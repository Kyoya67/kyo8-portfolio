export default function PixelArt({
  pattern,
  cell = 4,
  className = "",
}: {
  pattern: string[];
  cell?: number;
  className?: string;
}) {
  const rows = pattern.length;
  const cols = Math.max(...pattern.map((row) => row.length));

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
        imageRendering: "pixelated",
      }}
    >
      {pattern.map((row, y) =>
        Array.from({ length: cols }).map((_, x) => {
          const char = row[x] ?? ".";
          if (char !== "#") return null;
          return (
            <span
              key={`${y}-${x}`}
              style={{ gridColumn: x + 1, gridRow: y + 1, background: "currentColor" }}
            />
          );
        })
      )}
    </div>
  );
}
