import { db, Users, Pokedex, Logs } from "./index.js";
import { seedData, pokemonSeedData, logsSeedData } from "./seedData.js";
import bcrypt from "bcryptjs";
const SALT_COUNT = 10;

async function genUsers(usersObject) {
  await usersObject.forEach(async (user) => {
    const hashPw = await bcrypt.hash(user.password, SALT_COUNT);
    await Users.create({
      name: user.name,
      email: user.email,
      password: hashPw,
      occupation: user.occupation,
      isAdmin: user.isAdmin,
    });
  });
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

async function genInitialLogs(logsObject) {
  await Logs.bulkCreate(logsObject);
}

export default async function seed() {
  await genUsers(seedData);
  await genPokemons(pokemonSeedData);
  await assignPokedexEntry();
  await genInitialLogs(logsSeedData);
}

export { seed };
