type WordmarkProps = {
  size?: number;
};

export function Wordmark({ size = 16 }: WordmarkProps) {
  return (
    <div
      className="flex items-baseline gap-[0.3em] font-sans text-ink leading-none tracking-tight whitespace-nowrap"
      style={{ fontSize: size }}
    >
      <span className="font-semibold">Mon carnet</span>
      <span className="font-normal text-slate">de commandes</span>
    </div>
  );
}
