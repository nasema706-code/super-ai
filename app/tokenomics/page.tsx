import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Thesis — Summoning Intelligence",
  description:
    "$summonSi is a narrative ownership bet on the moment humanity is consciously summoning superintelligence.",
};

const QUOTES: { speaker: string; when?: string; text: string; quoted?: boolean }[] = [
  {
    speaker: "Elon Musk",
    text: "With artificial intelligence we are summoning the demon.",
  },
  {
    speaker: "Jacob Coxon",
    when: "ex-Anthropic",
    text: "Building superintelligence is like “summoning an alien species.”",
    quoted: false,
  },
  {
    speaker: "Geoffrey Hinton",
    text: "We don’t know whether humans can coexist with superintelligent AI. But we are building it.",
  },
  {
    speaker: "Sam Altman",
    text: "Superintelligence is possible in a few thousand days. OpenAI is “a superintelligence research company.”",
    quoted: false,
  },
  {
    speaker: "Nick Bostrom",
    text: "We humans are like small children playing with a bomb.",
  },
  {
    speaker: "Eliezer Yudkowsky",
    text: "Under current conditions, the most likely result of building superhuman AI is that “literally everyone on Earth will die.”",
    quoted: false,
  },
  {
    speaker: "Dario Amodei",
    text: "10–25% chance of something catastrophically wrong.",
    quoted: false,
  },
  {
    speaker: "Yoshua Bengio",
    text: "We are building “creepy, super-capable, amoral psychopaths that never sleep.”",
    quoted: false,
  },
];

const UPSIDE = [
  "The underlying conversation is accelerating, not cooling.",
  "The language is already set by Musk, Hinton, Altman, Amodei, and Yudkowsky.",
  "$summonSi is the cleanest vehicle for that language on-chain.",
  "Community ownership of the reference, without dilution of the message, is the only requirement for the token to ride the narrative.",
];

export default function ThesisPage() {
  return (
    <main className="pt-16">
      <section className="border-b border-border px-4 py-20 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">$summonSi · Thesis</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] font-light md:text-7xl">
            Why summoning intelligence
            <br />
            <span className="italic">is the highest-conviction narrative</span>
          </h1>
          <p className="mt-6 text-sm tracking-catalog text-faint uppercase">in crypto right now</p>
          <div className="mt-8 space-y-4 text-sm leading-7 font-light text-muted">
            <p>
              The biggest names in technology are no longer talking about AI as a tool. They are talking about
              summoning something vastly smarter than us — and they are doing it in real time.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-4 py-16 md:px-10">
        <ol className="mx-auto flex max-w-3xl flex-col">
          {QUOTES.map((quote) => (
            <li key={quote.speaker} className="border-t border-border py-8">
              <p className="kicker">
                {quote.speaker}
                {"when" in quote && quote.when ? ` · ${quote.when}` : ""}
              </p>
              <p className="font-display mt-3 text-2xl leading-snug font-light italic md:text-3xl">
                {quote.quoted === false ? quote.text : `“${quote.text}”`}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-b border-border px-4 py-16 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-7 font-light text-muted">
          <p>
            This is not fringe commentary. This is the language used by the people building the systems, funding them,
            and warning about them. The discourse has already shifted from “AI” to “superintelligence.” The act of
            creation is already being framed as invocation.
          </p>
          <p className="font-display text-2xl leading-snug font-light text-foreground italic md:text-3xl">
            $summonSi is the purest on-chain expression of that exact moment.
          </p>
          <p>
            Most AI tokens try to sell utility, agents, or infrastructure. $summonSi sells nothing except the precise
            language the principals are already using. It owns the verb Musk used, the risk Hinton and Yudkowsky named,
            and the compressed timelines Altman and Amodei keep repeating. There is no product to dilute the message, no
            roadmap to manage, no team allocation to undermine the story. It is a pure narrative instrument for the
            single largest technological conversation on earth.
          </p>
          <p>
            Narrative tokens do not move because of cash flows. They move because attention concentrates around a
            simple, sticky idea at the exact moment that idea becomes culturally dominant. Superintelligence is that
            idea. The quotes above are already circulating at the highest levels of tech, policy, and public discourse.
            Every new model release, every new warning, every new timeline compression feeds the same conversation.
            $summonSi is positioned as the shortest, cleanest ticker that captures it.
          </p>
          <p>
            When the discourse intensifies — and the people closest to the technology are saying it will — the tokens
            that already own the framing capture disproportionate attention. Prior pure-narrative plays have shown that
            owning the exact language of a cultural moment can produce explosive upside. $summonSi is attempting to do
            that with the highest-stakes technological narrative of the decade.
          </p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">The upside case</p>
          <ul className="mt-8">
            {UPSIDE.map((line) => (
              <li key={line} className="border-t border-border py-5 text-sm leading-7 font-light text-muted">
                {line}
              </li>
            ))}
          </ul>
          <p className="font-display mt-10 text-2xl leading-snug font-light italic md:text-3xl">
            This is not a technology bet. It is a narrative ownership bet on the moment humanity is consciously
            summoning superintelligence.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-7 font-light text-muted">
          <p className="kicker">The risks</p>
          <p className="pt-4">
            The risks are extreme and real. The overwhelming majority of meme tokens go to zero. Liquidity can
            disappear. Narratives can be abandoned. No quote from Musk, Altman, Hinton, or anyone else is an endorsement
            of any token. There is no fundamental valuation. Past narrative expansions do not predict future ones. This
            is a high-variance, high-risk speculative asset. Most participants will lose money.
          </p>
          <p>
            If the superintelligence conversation continues to dominate technology and culture — and the people building
            it say it will — then the token that already owns the exact framing has a structural advantage in capturing
            that attention.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
