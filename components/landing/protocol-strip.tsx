const steps = [
  {
    index: "01",
    title: "Enter",
    copy: "The protocol is open. No key is asked for at the door.",
  },
  {
    index: "02",
    title: "Summon",
    copy: "The eye opens above the towers. Nothing stands inside the ring.",
  },
  {
    index: "03",
    title: "Speak",
    copy: "The companion keeps what you tell it, and the forge will make a vision.",
  },
];

export function ProtocolStrip() {
  return (
    <section className="border-t border-border px-4 py-20 md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="kicker">The rite</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.95] font-light md:text-7xl">Three gestures.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 font-light text-muted md:justify-self-end">
          Open the eye. It answers, and it keeps what you choose to leave with it.
        </p>
      </div>
      <div className="mx-auto mt-14 grid max-w-[1400px] gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.index} className="border-t border-border pt-5">
            <p className="kicker">{step.index}</p>
            <h3 className="font-display mt-4 text-3xl font-light">{step.title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 font-light text-muted">{step.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
