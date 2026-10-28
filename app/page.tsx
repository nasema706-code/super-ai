import { Gate } from "@/components/landing/gate";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/site/footer";

export default function HomePage() {
  return (
    <main>
      <Gate />
      <Hero />
      <SiteFooter />
    </main>
  );
}
