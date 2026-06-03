/**
 * Conditionally initializes the MSW browser worker in development.
 *
 * Call this before your app renders (e.g. in the root route or client entry).
 * It is a no-op in production and on the server.
 */
export async function enableMocking(): Promise<void> {
  // Only run in development mode on the client
  console.log(import.meta.env.PROD, import.meta.env.VITE_MSW);
  if (import.meta.env.PROD) return;
  if (typeof window === "undefined") return;

  // Guard: only enable when the VITE_MSW flag is set
  if (import.meta.env.VITE_MSW !== "true") return;

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: false,
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });

  console.log(
    "%c[MSW] ✅ Mock Service Worker enabled",
    "color: #10b981; font-weight: bold;",
  );
}
