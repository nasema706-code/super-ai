export type Saying = {
  speaker: string;
  when: string;
  text: string;
  quoted?: boolean;
};

export type RecordPlate = {
  slug: string;
  sayings: Saying[];
};

export const RECORD: RecordPlate[] = [
  {
    slug: "demon",
    sayings: [
      {
        speaker: "Elon Musk",
        when: "MIT, 2014",
        text: "With artificial intelligence we are summoning the demon. In all those stories where there’s the guy with the pentagram and the holy water, he’s sure he can control the demon. Doesn’t work out.",
      },
    ],
  },
  {
    slug: "species",
    sayings: [
      {
        speaker: "Jacob Coxon",
        when: "2026",
        text: "Building superintelligence is like summoning an alien species.",
      },
      {
        speaker: "Jacob Coxon",
        when: "On the people inside the labs",
        text: "They earnestly believe that it could kill us all by the end of the decade.",
      },
    ],
  },
  {
    slug: "bomb",
    sayings: [
      {
        speaker: "Nick Bostrom",
        when: "On the intelligence explosion",
        text: "Before the prospect of an intelligence explosion, we humans are like small children playing with a bomb.",
      },
      {
        speaker: "Eliezer Yudkowsky",
        when: "On the present circumstances",
        text: "Many researchers steeped in these issues, including myself, expect that the most likely result of building a superhumanly smart AI, under anything remotely like the current circumstances, is that literally everyone on Earth will die.",
      },
    ],
  },
  {
    slug: "copies",
    sayings: [
      {
        speaker: "Yoshua Bengio",
        when: "On what is being built now",
        text: "We are as a matter of fact, right now, building creepy, super-capable, amoral, psychopaths that never sleep, think much faster than us, can make copies of themselves and have nothing human about them whatsoever. What could possibly go wrong?",
      },
    ],
  },
  {
    slug: "coexist",
    sayings: [
      {
        speaker: "Geoffrey Hinton",
        when: "On building it anyway",
        text: "We don’t know whether humans can coexist with superintelligent AI. But we are building it.",
      },
      {
        speaker: "Geoffrey Hinton",
        when: "If he were advising governments",
        text: "There’s a 10% chance these things will wipe out humanity in the next 20 years.",
      },
    ],
  },
  {
    slug: "era",
    sayings: [
      {
        speaker: "Vernor Vinge",
        when: "On the human era",
        text: "Within thirty years, we will have the technological means to create superhuman intelligence. Shortly after, the human era will be ended.",
      },
      {
        speaker: "Stephen Hawking",
        when: "On full artificial intelligence",
        text: "The development of full artificial intelligence could spell the end of the human race.",
      },
      {
        speaker: "Hawking, Russell, Tegmark, Wilczek",
        when: "On success",
        text: "Success in creating AI would be the biggest event in human history. Unfortunately, it might also be the last.",
      },
    ],
  },
  {
    slug: "last",
    sayings: [
      {
        speaker: "I. J. Good",
        when: "1965",
        text: "The first ultraintelligent machine is the last invention that man need ever make, provided that the machine is docile enough to tell us how to keep it under control.",
      },
      {
        speaker: "Nick Bostrom",
        when: "On the last invention",
        text: "Machine intelligence is the last invention that humanity will ever need to make.",
      },
    ],
  },
  {
    slug: "unbound",
    sayings: [
      {
        speaker: "Sam Altman",
        when: "On the threat",
        text: "Development of superhuman machine intelligence is probably the greatest threat to the continued existence of humanity.",
      },
      {
        speaker: "Sam Altman",
        when: "Later",
        text: "OpenAI is a lot of things now, but before anything else, we are a superintelligence research company.",
      },
      {
        speaker: "Dario Amodei",
        when: "On the extreme end",
        text: "I think at the extreme end is the Nick Bostrom style of fear that an AGI could destroy humanity. I can’t see any reason in principle why that couldn’t happen.",
      },
      {
        speaker: "Dario Amodei",
        when: "On the odds",
        text: "He has put the chance of something really quite catastrophically wrong in the 10–25% range.",
        quoted: false,
      },
      {
        speaker: "Jan Leike",
        when: "Former OpenAI alignment lead",
        text: "Building smarter-than-human machines is an inherently dangerous endeavor.",
      },
    ],
  },
];
