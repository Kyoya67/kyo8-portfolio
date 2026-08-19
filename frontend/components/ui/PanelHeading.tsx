import Link from "next/link";

export default function PanelHeading({
  number,
  title,
  action,
}: {
  number: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-strong px-6 py-4">
      <h2 className="text-xs font-bold tracking-[0.15em] uppercase sm:text-sm">
        <span className="text-fg-dim">{number}.</span> {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[11px] tracking-[0.1em] text-fg-muted uppercase transition-colors hover:text-fg sm:text-xs"
        >
          <span className="text-fg-dim transition-transform group-hover:translate-x-0.5">›</span>
          {action.label}
        </Link>
      )}
    </div>
  );
}
