// PROTOTYPE — Four message-first interface variants, switchable via ?variant=A|D|E|F.
import { PrototypeSwitcher } from '@/components/prototype-switcher';
import { useCallback, useState } from 'react';

import type { PrototypePhase } from './prototype-data';
import { VariantA } from './variant-a';
import { VariantD } from './variant-d';
import { VariantE } from './variant-e';
import { VariantF } from './variant-f';

const variants = ['A', 'D', 'E', 'F'] as const;
type Variant = (typeof variants)[number];

const labels: Record<Variant, string> = {
  A: 'Three-pane chief of staff',
  D: 'AI workroom',
  E: 'WhatsApp-style work messenger',
  F: 'Telegram-style work messenger',
};

function getInitialVariant(): Variant {
  const value = new URLSearchParams(window.location.search).get('variant');
  return variants.includes(value as Variant) ? (value as Variant) : 'A';
}

export function MessageFirstInterfacePrototype() {
  const [variant, setVariant] = useState<Variant>(getInitialVariant);
  const [phase, setPhase] = useState<PrototypePhase>('proposed');

  const changeVariant = useCallback((next: Variant) => {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState(null, '', url);
    setVariant(next);
  }, []);

  return (
    <>
      {variant === 'A' && <VariantA phase={phase} setPhase={setPhase} />}
      {variant === 'D' && <VariantD phase={phase} setPhase={setPhase} />}
      {variant === 'E' && <VariantE phase={phase} setPhase={setPhase} />}
      {variant === 'F' && <VariantF phase={phase} setPhase={setPhase} />}
      <PrototypeSwitcher
        current={variant}
        labels={labels}
        onChange={changeVariant}
        variants={variants}
      />
    </>
  );
}
