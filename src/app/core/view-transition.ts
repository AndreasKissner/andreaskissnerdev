/** Applies a DOM-changing callback wrapped in a View Transition when the browser supports it. */
export function runWithViewTransition(applyChange: () => void): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyChange();
    return;
  }
  document.startViewTransition(applyChange);
}
