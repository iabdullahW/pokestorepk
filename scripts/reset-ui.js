// Run this script in the browser console to reset UI state if it gets stuck

// Remove all modals and overlays
const removeElements = [
  '.loading-screen-wrapper',
  '.loading-overlay',
  '[role="dialog"]',
  '.modal',
  '.overlay',
  '.ReactModal__Overlay',
  '.ReactModal__Content',
  '.modal-backdrop',
  '.modal-open',
  '.modal-dialog',
  '.modal-content',
  '.modal-backdrop',
  '.modal-open',
  '.modal-dialog',
  '.modal-content',
  '.modal-backdrop',
  '.ReactModalPortal',
];

// Enable all pointer events and scrolling
const enablePointerEvents = () => {
  // Enable pointer events on all elements
  document.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.pointerEvents = '';
      el.style.touchAction = '';
    }
  });

  // Enable scrolling
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.documentElement.style.overflow = '';
  document.documentElement.style.position = '';
  document.documentElement.style.height = '';
  document.body.style.height = '';
  
  // Remove any overlay styles
  const overlays = document.querySelectorAll('.overlay, .modal, [role="dialog"]');
  overlays.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.display = 'none';
    }
  });
};

// Remove all matching elements
removeElements.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    try {
      el.remove();
    } catch (e) {
      console.warn(`Could not remove element with selector: ${selector}`, e);
    }
  });
});

// Enable pointer events and scrolling
enablePointerEvents();

console.log('UI reset complete! All modals and overlays have been removed.');
