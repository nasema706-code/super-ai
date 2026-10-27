const steps = [
  {
    index: "01",
    title: "Connect",
    copy: "Phantom or Solflare. The companion will not answer a stranger.",
  },
  {
    index: "02",
    title: "Bind",
    copy: "Sign a message. The signature is the rite. The wallet is the name.",
  },
  {
    index: "03",
    title: "Summon",
    copy: "The ring closes, the figure answers, and it keeps what you tell it.",
  },
];

export function ProtocolStrip() {
  return (
    <section className="border-t border-white/10 px-4 py-20 md:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-white/45 uppercase">The rite</p>
          <h2 className="font-display mt-3 text-4xl leading-none md:text-6xl">Three gestures. Then a mind.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.index} className="border-t border-white/15 pt-4">
              <p className="text-[11px] tracking-[0.22em] text-white/40">{step.index}</p>
              <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
