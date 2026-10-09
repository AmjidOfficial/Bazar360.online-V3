import html2canvas, { Options } from 'html2canvas';

/**
 * Safe wrapper around html2canvas that sanitizes CSS rules containing 'oklch' color functions
 * before html2canvas parses the DOM. Tailwind CSS v4 outputs 'oklch(...)' variables by default,
 * which causes html2canvas v1.4.1 to crash with:
 * "Error: Attempting to parse an unsupported color function "oklch""
 */
export async function safeHtml2Canvas(element: HTMLElement, options: Partial<Options> = {}): Promise<HTMLCanvasElement> {
  const userOnClone = options.onclone;

  return html2canvas(element, {
    ...options,
    onclone: (clonedDoc, clonedElement) => {
      try {
        // Sanitize <style> elements containing oklch
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((style) => {
          if (style.innerHTML && style.innerHTML.includes('oklch')) {
            style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/gi, '#888888');
          }
        });

        // Sanitize inline style attributes containing oklch
        const elementsWithInlineStyle = clonedDoc.querySelectorAll('[style*="oklch"]');
        elementsWithInlineStyle.forEach((el) => {
          const styleAttr = el.getAttribute('style');
          if (styleAttr) {
            el.setAttribute('style', styleAttr.replace(/oklch\([^)]+\)/gi, '#888888'));
          }
        });
      } catch (err) {
        console.warn('[safeHtml2Canvas] Error sanitizing oklch styles:', err);
      }

      if (userOnClone) {
        userOnClone(clonedDoc, clonedElement);
      }
    }
  });
}

export default safeHtml2Canvas;
