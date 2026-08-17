import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app';
import { AppProviders } from '@/providers';
import { followSystemTheme } from '@/theme';
import '@/styles.css';

followSystemTheme();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Renderer root element is missing');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);

