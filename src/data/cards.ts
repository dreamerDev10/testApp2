import firstImage from "../assets/first.png";
import secondImage from "../assets/second.png";
import thirdImage from "../assets/third.png";
import firthImage from "../assets/firth.png";
import fiveImage from "../assets/five.png";
import sixeImage from "../assets/six.png";
import sevenImage from "../assets/seven.png";
import eightImage from "../assets/eight.png";
import nineImage from "../assets/nine.png";
import tenImage from "../assets/ten.png";

export type LoveCardData = {
  id: number;
  title: string;
  note: string;
  image: string;
  alt: string;
};

export const loveCards: LoveCardData[] = [
  {
    id: 1,
    title: "Love is... stealing your fries",
    note: "And pretending it was your plan all along.",
    image: firstImage,
    alt: "Cozy dinner with fries",
  },
  {
    id: 2,
    title: "Love is... laughing at stupid jokes",
    note: "Especially the ones that are not funny to anyone else.",
    image: secondImage,
    alt: "Couple laughing together",
  },
  {
    id: 3,
    title: "Love is... falling asleep together",
    note: "Even when we said we would watch one more episode.",
    image: thirdImage,
    alt: "Hands resting on bed",
  },
  {
    id: 4,
    title: "Love is... sending memes at 3am",
    note: "Because missing each other has no schedule.",
    image: firthImage,
    alt: "Phone glowing in the dark",
  },
  {
    id: 5,
    title: "Love is... matching hoodies",
    note: "Unplanned, but somehow exactly the same vibe.",
    image: fiveImage,
    alt: "Matching cozy hoodies",
  },
  {
    id: 6,
    title: "Love is... tiny surprises",
    note: "The small things that become forever memories.",
    image: sixeImage,
    alt: "Small gift wrapped with ribbon",
  },
  {
    id: 7,
    title: "Love is... sunsets and slow walks",
    note: "When silence feels like the warmest conversation.",
    image: sevenImage,
    alt: "Sunset walk on the beach",
  },
  {
    id: 8,
    title: "Love is... home being a person",
    note: "Not a place. Not a city. Just you.",
    image: eightImage,
    alt: "Warm lights in a cozy room",
  },
  {
    id: 9,
    title: "Love is... cheering for each other",
    note: "Loud in victories and gentle in hard days.",
    image: nineImage,
    alt: "Celebration moment",
  },
  {
    id: 10,
    title: "Love is... choosing you, daily",
    note: "Again today. Again tomorrow. Always.",
    image: tenImage,
    alt: "Hands intertwined",
  },
];
