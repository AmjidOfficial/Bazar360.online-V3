// BAZAR360 Enterprise Master Entrypoint
// Pure unified luxury dark system (#0F172A). Zero theme switchers.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './core/auth/AuthContext';
import { ErrorBoundary } from './core/ErrorBoundary';
import App from './App';
import './index.css';

console.log('[BAZAR360] Initializing enterprise automotive platform...');

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
        console.warn('URL restoration notice:', e);
      }
    }
  }
} catch (e) {
  console.warn('Deep link initialization notice:', e);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
