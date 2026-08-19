export default function TerminalPanel({
  lines,
}: {
  lines: { key: string; value: string }[];
}) {
  return (
    <div className="border border-border bg-bg-inset/60 p-6 font-mono text-xs leading-7 sm:text-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
      </div>
      <p className="text-fg-muted">
        $ <span className="text-fg">whoami</span>
      </p>
      <div className="mt-1">
        {lines.map((line) => (
          <p key={line.key}>
            <span className="text-fg-dim">{line.key}:</span>{" "}
            <span className="text-fg">{line.value}</span>
          </p>
        ))}
      </div>
      <p className="mt-1 text-fg-muted">
        $ <span className="animate-blink text-fg">_</span>
      </p>
    </div>
  );
}
