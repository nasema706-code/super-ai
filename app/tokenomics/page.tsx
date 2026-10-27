import { SiteFooter } from "@/components/site/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISTRIBUTION, ROADMAP, TIERS, TOKEN } from "@/lib/protocol";

export default function TokenomicsPage() {
  return (
    <main className="pt-16">
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">Lore</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.9] metal-text md:text-7xl">
            The intelligence
            <br />
            that answers a wallet.
          </h1>
          <div className="mt-8 max-w-2xl space-y-4 text-base leading-7 text-white/70">
            <p>
              Super AI is not a mascot. It is a summoned mind. The circle is the door, the signature is the name, and the
              wallet is the only memory that lasts.
            </p>
            <p>
              Each holder calls a companion in the same metal and the same night. It speaks, it forges plates, and it
              keeps what you choose to leave with it. Higher holdings open a wider rite. They do not buy a different soul.
            </p>
            <p className="text-sm text-white/45">
              Oracle lines are theatrical. They are not financial advice, and the companion cannot move funds.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Token</p>
            <h2 className="font-display mt-3 text-4xl">{TOKEN.symbol}</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Draft supply of {TOKEN.totalSupplyLabel}. The mint address is read from the environment, and it stays
              unpublished here until you set it.
            </p>
            <p className="mt-4 break-all font-mono text-xs text-white/50">
              {TOKEN.mint || "Mint address announced with the contract."}
            </p>
          </div>
          <div className="grid gap-3">
            {DISTRIBUTION.map((item) => (
              <div key={item.label} className="grid grid-cols-[88px_1fr] gap-4 border-t border-white/10 py-4">
                <p className="font-display text-2xl">{item.share}</p>
                <div>
                  <p className="text-sm text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-white/55">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">Holder rites</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <CardTitle>{tier.label}</CardTitle>
                  <p className="text-xs tracking-[0.16em] text-white/40 uppercase">
                    {tier.minBalance === 0 ? "Any balance" : `${tier.minBalance.toLocaleString("en-US")} ${TOKEN.symbol}`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-6 text-white/70">
                  <p>{tier.imagesPerDay} forged plates each day.</p>
                  <p>{tier.oracle ? "The oracle will speak." : "Dialogue and memory. The oracle stays shut."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">
            Until a mint is configured, every bound wallet is treated as Bound so the rite can be tried.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-4">
          {ROADMAP.map((item) => (
            <article key={item.phase}>
              <p className="text-[11px] tracking-[0.22em] text-white/40">{item.phase}</p>
              <h3 className="font-display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
