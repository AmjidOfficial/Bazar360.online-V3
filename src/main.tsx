import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

console.log('[BAZAR360] 1. Initializing runtime and loading main.tsx entrypoint...');

// Deep link redirect restoration for GitHub Pages (404.html redirection parameter)
try {
  if (typeof window !== 'undefined' && window.location) {
    const queryParams = new URLSearchParams(window.location.search);
    const redirectPath = queryParams.get('p');
    if (redirectPath) {
      let cleanPath = '/' + redirectPath.replace(/~and~/g, '&');
      const redirectSearch = queryParams.get('q');
      if (redirectSearch) cleanPath += '?' + redirectSearch.replace(/~and~/g, '&');
      cleanPath += window.location.hash;
      try {
        window.history.replaceState(null, '', cleanPath);
      } catch (e) {
        console.warn('URL restoration note:', e);
      }
    }
  }
} catch (e) {
  console.warn('Deep link initialization notice:', e);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('[BAZAR360] 2. Found #root element in DOM. Mounting React tree...');
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('[BAZAR360] 3. React createRoot.render dispatched successfully.');
} else {
  console.error('[BAZAR360] FATAL: Root element #root not found in document.');
}

