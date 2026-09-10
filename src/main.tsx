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

// Global toast interceptor to silence unnecessary success notifications
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
        return '' as any;
      }
      return originalSonnerSuccess(message, data);
    };
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
