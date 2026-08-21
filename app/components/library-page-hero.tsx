type LibraryPageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
};

export function LibraryPageHero({ eyebrow, title, subtitle, description, imageUrl }: LibraryPageHeroProps) {
  return (
    <header
      className="relative isolate overflow-hidden border-b border-white/10 px-6 py-20 text-[#fffaf2] sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 13, 18, 0.88), rgba(8, 13, 18, 0.58) 58%, rgba(8, 13, 18, 0.38)), url(${imageUrl})`, backgroundPosition: "center", backgroundSize: "cover" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9a467]">{eyebrow}</p>
          <h1 className="!mb-0 font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.045em] !text-[#fffaf2] sm:text-6xl lg:text-7xl">{title}</h1>
          {subtitle ? <p className="mt-4 font-serif text-xl italic text-[#e3c39c] sm:text-2xl">{subtitle}</p> : null}
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#f2eee5]/85 sm:text-base">{description}</p>
        </div>
      </div>
    </header>
  );
}
