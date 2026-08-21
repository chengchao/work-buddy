import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type PrototypeSwitcherProps<Variant extends string> = {
  current: Variant;
  labels: Record<Variant, string>;
  onChange: (variant: Variant) => void;
  variants: readonly Variant[];
};

export function PrototypeSwitcher<Variant extends string>({
  current,
  labels,
  onChange,
  variants,
}: PrototypeSwitcherProps<Variant>) {
  const currentIndex = variants.indexOf(current);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches('input, textarea, [contenteditable="true"]') ||
        !['ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        return;
      }

      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + variants.length) % variants.length;
      onChange(variants[nextIndex]);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onChange, variants]);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-neutral-950/95 p-1.5 text-white shadow-2xl backdrop-blur">
      <button
        aria-label="Previous prototype"
        className="grid size-8 place-items-center rounded-full text-neutral-400 transition hover:bg-white/10 hover:text-white"
        onClick={() =>
          onChange(
            variants[(currentIndex - 1 + variants.length) % variants.length],
          )
        }
        type="button"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div className="flex items-center gap-1">
        {variants.map((variant) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              current === variant
                ? 'bg-white text-neutral-950'
                : 'text-neutral-400 hover:text-white'
            }`}
            key={variant}
            onClick={() => onChange(variant)}
            title={labels[variant]}
            type="button"
          >
            {variant}
          </button>
        ))}
      </div>
      <span className="hidden min-w-40 px-2 text-xs text-neutral-300 sm:block">
        {labels[current]}
      </span>
      <button
        aria-label="Next prototype"
        className="grid size-8 place-items-center rounded-full text-neutral-400 transition hover:bg-white/10 hover:text-white"
        onClick={() => onChange(variants[(currentIndex + 1) % variants.length])}
        type="button"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
