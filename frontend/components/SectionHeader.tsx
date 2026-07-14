type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase text-teal">{eyebrow}</p>
      <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-ink/70 md:text-lg">{description}</p>
    </div>
  );
}
