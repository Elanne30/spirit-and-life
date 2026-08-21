type LibraryPageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  actions?: readonly { label: string; href: string; primary?: boolean }[];
};

export function LibraryPageHero({ eyebrow, title, subtitle, description, imageUrl, actions }: LibraryPageHeroProps) {
  return (
    <header
      className="relative isolate overflow-hidden border-b border-[color:var(--line)] px-6 py-20 text-[color:var(--foreground)] sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      style={{ backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--background) 90%, transparent), color-mix(in srgb, var(--background) 62%, transparent) 58%, color-mix(in srgb, var(--background) 30%, transparent)), url(${imageUrl})`, backgroundPosition: "center", backgroundSize: "cover" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">{eyebrow}</p>
          <h1 className="!mb-0 max-w-[18ch] break-words font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.045em] !text-[color:var(--foreground)] [text-wrap:balance] sm:text-6xl lg:text-7xl">{title}</h1>
          {subtitle ? <p className="mt-4 max-w-2xl font-serif text-xl italic leading-tight text-[color:var(--accent-strong)] sm:text-2xl">{subtitle}</p> : null}
          <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--foreground)]/85 sm:text-base">{description}</p>
          {actions?.length ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {actions.map((action) => (
                <a key={action.href} href={action.href} className={action.primary ? "inline-flex min-h-11 items-center justify-center rounded-md bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--on-accent)] transition hover:bg-[color:var(--accent-strong)]" : "inline-flex min-h-11 items-center justify-center rounded-md border border-[color:var(--line)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"}>{action.label}</a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
