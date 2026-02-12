export function trackPlausibleEvent(eventName: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") {
    return;
  }

  const plausible = (window as Window & {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }).plausible;

  if (typeof plausible === "function") {
    plausible(eventName, props ? { props } : undefined);
  }
}
