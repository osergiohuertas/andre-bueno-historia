declare global {
  interface Window {
    umami?: {
      track: (nome: string, dados?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(nome: string, dados?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.umami?.track(nome, dados);
}
