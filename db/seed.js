import { db, Users, Pokedex, Logs } from "./index.js";
import { seedData, pokemonSeedData } from "./seedData.js";

async function genUsers(usersObject) {
  await Users.bulkCreate(usersObject);
}

async function genPokemons(pokemonObject) {
  await Pokedex.bulkCreate(pokemonObject);
}

async function assignPokedexEntry() {
  let pokemons = await Pokedex.findAll();
  let professors = await Users.findAll({
    where: {
      occupation: "Researcher",
    },
  });

  await professors[0].addPokedex(pokemons[0]);
  await professors[2].addPokedex(pokemons[1]);
  await professors[1].addPokedex(pokemons[2]);
}

export default async function seed() {
  await genUsers(seedData);
  await genPokemons(pokemonSeedData);
  await assignPokedexEntry();
}

export { seed };
