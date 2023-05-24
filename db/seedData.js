const seedData = [
  {
    name: "Prof. Oak",
    isAdmin: true,
    email: "oak@palletreseach.com",
    occupation: "Researcher",
    password: "oakLovesPokemon",
  },
  {
    name: "Prof. Smith",
    isAdmin: false,
    email: "smith@pallet.edu",
    occupation: "Researcher",
    password: "iFoundCharmanderFirst",
  },
  {
    name: "Prof. Yun",
    isAdmin: false,
    email: "yun@pallet.edu",
    occupation: "Researcher",
    password: "iFoundCharmanderFirstActually",
  },
];

const pokemonSeedData = [
  {
    name: "Pikachu",
    type: "Electric",
    description: "The electric mouse pokemon.",
  },
  {
    name: "Charizard",
    type: "Fire/Flying",
    description: "A fire lizard evolved to have wings. A dragon perhaps.",
  },
  {
    name: "Blastoise",
    type: "Water",
    description:
      "The turtle/tortoise water pokemon. Has cannons attached to its shell.",
  },
];

const logsSeedData = [
  {
    name: "Prof. Oak",
    entry: "Prof. Oak registered successfully",
  },
  {
    name: "Prof. Yun",
    entry: "Prof. Yun registered successfully",
  },
  {
    name: "Prof. Smith",
    entry: "Prof. Smith registered successfully",
  },
  {
    name: "Prof. Oak",
    entry: "Pikachu was added to the Pokedex by Prof. Oak",
  },
  {
    name: "Prof. Yun",
    entry: "Charizard was added to the Pokedex by Prof. Yun",
  },
  {
    name: "Prof. Smith",
    entry: "Blastoise was added to the Pokedex by Prof. Smith",
  },
];
export { seedData, pokemonSeedData, logsSeedData };
