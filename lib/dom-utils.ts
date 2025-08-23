/**
 * Safely removes loading screen elements from the DOM
 */
export function removeLoadingScreen() {
  if (typeof document === 'undefined') return;
  
  // Remove all loading screen elements
  const loadingElements = [
    ...Array.from(document.querySelectorAll('.loading-screen-wrapper')),
    ...Array.from(document.querySelectorAll('.loading-overlay'))
  ];

  loadingElements.forEach(el => {
    try {
      if (el && el.parentNode && document.body.contains(el)) {
        // Use modern method if available, fallback to old method
        if (el.remove) {
          el.remove();
        } else if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    } catch (error) {
      console.error('Error removing loading element:', error);
    }
  });

  // Force enable pointer events on body in case they were disabled
  enablePointerEvents();
}

/**
 * Safely enables all pointer events on the document
 */
export function enablePointerEvents() {
  if (typeof document === 'undefined') return;
  
  // Enable pointer events on all elements
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.pointerEvents = '';
      el.style.touchAction = '';
    }
  });

  // Enable scrolling
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
