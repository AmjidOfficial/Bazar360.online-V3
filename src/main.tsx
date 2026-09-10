import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeContext';
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import './index.css';
import './home-redesign.css';

if (typeof window !== 'undefined') {
  const forbiddenKeywords = [
    'success', 'saved', 'updated', 'published', 'changed', 'registered', 'uploaded',
    'deleted', 'copied', 'downloaded', 'exported', 'added', 'removed', 'marked',
    'sent', 'cleared', 'selected', 'applied', 'authenticated', 'logged', 'confirmed',
    'verified', 'vcard', 'pdf', 'signage', 'clipboard', 'whatsapp', 'liked'
  ];

  const isForbidden = (msg: any): boolean => {
    if (!msg) return false;
    const msgStr = typeof msg === 'string' ? msg.toLowerCase() : String(msg).toLowerCase();
    return forbiddenKeywords.some(keyword => msgStr.includes(keyword)) || msgStr.includes('✓') || msgStr.includes('★');
  };

  if (hotToast && typeof hotToast.success === 'function') {
    const originalHotSuccess = hotToast.success;
    hotToast.success = (message, options) => {
      if (isForbidden(message)) {
        console.log('[Toast Interceptor] Silenced HotToast success:', message);
        return '';
      }
      return originalHotSuccess(message, options);
    };

    const originalRawHotToast = (hotToast as any).original || hotToast;
    const wrappedHotToast = function(message: any, options: any) {
      if (options?.type === 'success' && isForbidden(message)) {
        console.log('[Toast Interceptor] Silenced HotToast main success:', message);
        return '';
      }
      return (originalRawHotToast as any)(message, options);
    };
    Object.assign(wrappedHotToast, hotToast);
    (hotToast as any).original = originalRawHotToast;
  }

  if (sonnerToast && typeof sonnerToast.success === 'function') {
    const originalSonnerSuccess = sonnerToast.success;
    sonnerToast.success = (message, data) => {
      if (isForbidden(message)) {
        console.log('[Toast Interceptor] Silenced Sonner success:', message);
        return '';
      }
      return originalSonnerSuccess(message, data);
    };
  }

  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || event.message === 'Script error') {
      console.warn('[BAZAR360] Cross-origin script error handled gracefully:', event);
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[BAZAR360] Unhandled promise rejection handled:', event.reason);
    event.preventDefault();
  });
}

// Restore the real route when GitHub Pages redirects a deep link through 404.html.
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
    console.warn('URL restoration bypassed in main.tsx:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('BAZAR360 PWA Service Worker active anytime:', reg.scope))
      .catch((err) => console.warn('BAZAR360 PWA Service Worker registration note:', err));
  });
}
