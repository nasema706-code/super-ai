/**
 * Wallet connect is paused. Phantom and Solflare stay in the project, but they
 * are not mounted, so the page does not offer a connection or auto-connect.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return children;
}
