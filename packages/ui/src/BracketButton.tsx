import Link from "next/link";

interface BracketButtonProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  solid?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function BracketButton({
  href,
  children,
  external = false,
  solid = false,
  icon,
  className = "",
}: BracketButtonProps) {
  const base = `group inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] uppercase transition-colors sm:text-xs ${
    solid
      ? "border-fg bg-fg text-bg hover:bg-transparent hover:text-fg"
      : "border-border-strong text-fg-muted hover:border-fg hover:text-fg"
  } ${className}`;

  const content = (
    <>
      <span className="text-fg-dim group-hover:text-current">›</span>
      {children}
      {icon}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={base}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={base}>
      {content}
    </Link>
  );
}
