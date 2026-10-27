import { SiteFooter } from "@/components/site/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISTRIBUTION, ROADMAP, TIERS, TOKEN } from "@/lib/protocol";

export default function TokenomicsPage() {
  return (
    <main className="pt-16">
      <section className="px-4 py-20 md:px-10">
        <div className="mx-auto max-w-[1100px]">
          <p className="kicker">Thesis</p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[0.95] font-light md:text-7xl">
            The intelligence
            <br />
            <span className="italic">that answers a wallet.</span>
          </h1>
          <div className="mt-8 max-w-2xl space-y-4 text-base leading-7 font-light text-muted">
            <p>
              Super AI is not a mascot. It is a summoned mind. The circle is the door, the signature is the name, and the
              wallet is the only memory that lasts.
            </p>
            <p>
              Each holder calls a companion in the same metal and the same night. It speaks, it forges visions, and it
              keeps what you choose to leave with it. Higher holdings open a wider rite. They do not buy a different soul.
            </p>
            <p className="text-sm text-faint">
              Oracle lines are theatrical. They are not financial advice, and the companion cannot move funds.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="kicker">Token</p>
            <h2 className="font-display mt-4 text-5xl font-light">{TOKEN.symbol}</h2>
            <p className="mt-4 text-sm leading-6 font-light text-muted">
              Draft supply of {TOKEN.totalSupplyLabel}. The mint address is read from the environment, and it stays
              unpublished here until you set it.
            </p>
            <p className="mt-4 break-all font-mono text-xs text-faint">
              {TOKEN.mint || "Mint address announced with the contract."}
            </p>
          </div>
          <div className="grid gap-0">
            {DISTRIBUTION.map((item) => (
              <div key={item.label} className="grid grid-cols-[88px_1fr] gap-4 border-t border-border py-5">
                <p className="font-display text-2xl font-light">{item.share}</p>
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-light text-muted">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 md:px-10">
        <div className="mx-auto max-w-[1100px]">
          <p className="kicker">Holder rites</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <CardTitle>{tier.label}</CardTitle>
                  <p className="kicker">
                    {tier.minBalance === 0 ? "Any balance" : `${tier.minBalance.toLocaleString("en-US")} ${TOKEN.symbol}`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-6 font-light text-muted">
                  <p>{tier.imagesPerDay} forged visions each day.</p>
                  <p>{tier.oracle ? "The oracle will speak." : "Dialogue and memory. The oracle stays shut."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs font-light text-faint">
            Until a mint is configured, every bound wallet is treated as Bound so the rite can be tried.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1100px] gap-8 md:grid-cols-4">
          {ROADMAP.map((item) => (
            <article key={item.phase} className="border-t border-border pt-5">
              <p className="kicker">{item.phase}</p>
              <h3 className="font-display mt-4 text-2xl font-light">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 font-light text-muted">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
