import { Hero } from "@/components/landing/hero";
import { ProtocolStrip } from "@/components/landing/protocol-strip";
import { SiteFooter } from "@/components/site/footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProtocolStrip />
      <SiteFooter />
    </main>
  );
}
