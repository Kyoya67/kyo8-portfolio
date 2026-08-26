import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export default function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 flex items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs tracking-[0.3em] text-fg-dim uppercase">{eyebrow}</p>
        )}
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase">
          {title}
          <span className="mt-2 block h-px w-8 bg-fg" />
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group hidden shrink-0 items-center gap-1.5 text-xs tracking-[0.1em] text-fg-muted uppercase transition-colors hover:text-fg sm:inline-flex"
        >
          {action.label}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
