export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_100%_at_20%_0%,black,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.3em] text-fg-muted uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-fg" />
          {eyebrow}
        </p>
        <h1 className="text-4xl font-bold tracking-tight uppercase sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
