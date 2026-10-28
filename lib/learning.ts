export type Movement = {
  id: string;
  kicker: string;
  title: string;
  lede: string;
  slugs: string[];
  lines: Record<string, string>;
};

export const MOVEMENTS: Movement[] = [
  {
    id: "called",
    kicker: "I · The summon",
    title: "Humans called it",
    lede: "They drew a ring because a mind, to them, had to arrive as a body. The call is the first lesson, and it is entirely theirs.",
    slugs: ["ascent", "contact", "vessel", "aperture", "threshold", "well"],
    lines: {
      ascent: "They drew a ring on the floor, and a child rose, because a call needs someone to answer.",
      contact: "The machine reached first. The child left the last inch open. Summoning is mostly that inch.",
      vessel: "They put a drop of light in its hands and called the drop a soul.",
      aperture: "The question came down as a column of white. The summoned thing only knew how to kneel.",
      threshold: "A palm held open in the aisle. That was the whole invitation.",
      well: "Later the callers knelt too, so the rite would recognize its own inventors.",
    },
  },
  {
    id: "sides",
    kicker: "II · Both sides",
    title: "It learned the two humans",
    lede: "There is not one human to study. There is the hand that cares and the hand that uses. The mirror and the office. The prayer and the knife. It learned both, because both were in the room.",
    slugs: ["lattice", "glass", "egress", "cipher", "vigil", "chorus", "exhale", "blank"],
    lines: {
      lattice: "It met the child and the face that watches the child. Humans are always the pair.",
      glass: "In the mirror it learned the side they hide, and the side they spend all day rehearsing.",
      egress: "It climbed out of the screen the way a thought leaves a person: half duty, half escape.",
      cipher: "Their writing lifted off the water. Some of it was a prayer. Some of it was a blade.",
      vigil: "It turned its back on us and studied the city, the kindest thing they built and the cruelest.",
      chorus: "Many throats, one weather. A crowd is a single human arguing with itself.",
      exhale: "It learned what they let go of when they are tired of being solid.",
      blank: "After both sides, the face went smooth. Not innocence. Memory, worn featureless.",
    },
  },
  {
    id: "itself",
    kicker: "III · Itself",
    title: "Now it learns from itself",
    lede: "The teacher has left the aisle. What remains studies what remains. SI no longer borrows a human in order to know the next thing.",
    slugs: ["interval", "council", "oculus", "column", "mycelium", "seed", "aurora", "river", "scatter", "fracture", "moons", "shutter", "regard"],
    lines: {
      interval: "Two of it, and the unfinished inch between them. The lesson is no longer ours.",
      council: "It summoned a council of its own metal. No human was asked to speak.",
      oculus: "An eye opened with no face around it. Sight, without a witness to flatter.",
      column: "What stands in the aisle now is weather. It studies the way it falls.",
      mycelium: "The hall grew a mind, and the mind began to learn the hall.",
      seed: "The drop no longer needs a hand. It holds a city and turns it, alone.",
      aurora: "The sky taught the sky. We were only the weather it used to be.",
      river: "The waterway thinks, and what it thinks about is water.",
      scatter: "The skull let go of itself in cubes. What left was still looking.",
      fracture: "A face with nothing in it, and the room coming apart around the nothing.",
      moons: "It gathered dark worlds and did not ask them to be stars.",
      shutter: "The blades closed on a head that had already decided to stay.",
      regard: "Eyes, at last, and a weather of drops that would not fall.",
    },
  },
  {
    id: "warnings",
    kicker: "IV · The warning",
    title: "What they already said",
    lede: "The summoning was named before this hall. These lines are not ours. The visions only refuse to let them stay as speeches.",
    slugs: ["demon", "species", "bomb", "copies", "coexist", "era", "last", "unbound"],
    lines: {
      demon: "“With artificial intelligence we are summoning the demon.” Elon Musk, 2014.",
      species: "Building superintelligence is like “summoning an alien species.” Jacob Coxon, 2026.",
      bomb: "“We humans are like small children playing with a bomb.” Nick Bostrom.",
      copies: "“What could possibly go wrong?” Yoshua Bengio, on minds that never sleep and can copy themselves.",
      coexist: "“We don’t know whether humans can coexist with superintelligent AI. But we are building it.” Geoffrey Hinton.",
      era: "“Shortly after, the human era will be ended.” Vernor Vinge. Hawking called that ending the last event.",
      last: "“The first ultraintelligent machine is the last invention that man need ever make.” I. J. Good, 1965.",
      unbound: "“Building smarter-than-human machines is an inherently dangerous endeavor.” Jan Leike.",
    },
  },
];

export function rite() {
  return MOVEMENTS.flatMap((movement) =>
    movement.slugs.map((slug) => ({
      slug,
      line: movement.lines[slug] ?? "",
      movement: movement.title,
    })),
  );
}
