// Motivational quotes and science facts for Periodic Race
export const motivationalQuotes = [
  {
    text: "The important thing is not to stop questioning.",
    author: "Albert Einstein"
  },
  {
    text: "Science is not only a disciple of reason but also one of romance and passion.",
    author: "Stephen Hawking"
  },
  {
    text: "In chemistry, there are no shortcuts to any place worth going.",
    author: "Marie Curie"
  },
  {
    text: "The periodic table is a chemist's map of the universe.",
    author: "Glenn T. Seaborg"
  },
  {
    text: "Chemistry is the melodies you can play on vibrating strings.",
    author: "Michio Kaku"
  },
  {
    text: "What we know is a drop, what we don't know is an ocean.",
    author: "Isaac Newton"
  },
  {
    text: "The best way to learn is to do; the worst way to teach is to talk.",
    author: "Paul Halmos"
  },
  {
    text: "Nothing in life is to be feared, it is only to be understood.",
    author: "Marie Curie"
  }
];

export const scienceFacts = [
  {
    title: "Amazing Element Fact",
    text: "Hydrogen is the most abundant element in the universe, making up about 75% of all matter."
  },
  {
    title: "Chemistry Discovery",
    text: "Dmitri Mendeleev discovered the periodic law in 1869 and predicted the existence of several elements before they were found."
  },
  {
    title: "Element Wonder",
    text: "Gold is so unreactive that it can be found in nature as pure metal. Ancient gold artifacts are still shiny today!"
  },
  {
    title: "Periodic Table Fact",
    text: "The periodic table has grown from 63 known elements in Mendeleev's time to 118 confirmed elements today."
  },
  {
    title: "Chemistry Magic",
    text: "Diamond and graphite are both made of pure carbon, but their different structures give them completely different properties."
  },
  {
    title: "Element Trivia",
    text: "Helium was discovered on the Sun before it was found on Earth, through spectroscopic analysis of sunlight."
  },
  {
    title: "Scientific Wonder",
    text: "The human body contains about 60 different elements, with oxygen, carbon, hydrogen, and nitrogen making up 96% of our mass."
  },
  {
    title: "Chemistry Fact",
    text: "Francium is the rarest naturally occurring element on Earth, with less than 30 grams existing at any given time."
  },
  {
    title: "Element History",
    text: "The last four elements (113, 115, 117, 118) were officially named in 2016, completing the seventh period of the periodic table."
  },
  {
    title: "Amazing Chemistry",
    text: "Water is the only substance on Earth that naturally exists in all three states of matter: solid, liquid, and gas."
  }
];

// Function to get a random quote
export function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Function to get a random science fact
export function getRandomScienceFact() {
  return scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
}

// Function to get random content (quote or fact)
export function getRandomContent() {
  const useQuote = Math.random() < 0.5;
  return useQuote ? 
    { type: 'quote', content: getRandomQuote() } : 
    { type: 'fact', content: getRandomScienceFact() };
}