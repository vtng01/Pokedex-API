import { db, Users, Pokedex } from "./db/index.js";
import bcrypt from "bcryptjs";
const SALT_COUNT = 10;

async function createUser(userObj) {
  const { name, email, password, occupation } = userObj;
  const hashPw = await bcrypt.hash(password, SALT_COUNT);
  console.log("userobject at creation:", userObj);
  try {
    return await Users.create({
      name,
      email,
      password: hashPw,
      occupation,
      isAdmin: false,
    });
  } catch (err) {
    console.log("error got caught here", err);
    throw new Error(err.message);
  }
}

async function updateUser(userObj) {
  try {
    let user = await Users.findOne({
      where: {
        email: userObj.email,
      },
    });
    return await user.update({ userObj });
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createPokedexEntry(pokeObj, userObj) {
    try {
        const poke =  await Pokedex.create({pokeObj});
        await poke.setUser(userObj);
        return poke;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updatePokedexEntry(pokeObj, userObj) {
    try {
        let pokedex_entry = await Pokedex.findOne({where : {
            name : pokeObj.name,
        }});
        await pokedex_entry.setUser(userObj);
        await pokedex_entry.update({pokeObj});
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deletePokedexEntry(name) {
  try {
    await Pokedex.destroy({
      where: {
        name: name,
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

export {
  createUser,
  updateUser,
  createPokedexEntry,
  updatePokedexEntry,
  deletePokedexEntry,
};