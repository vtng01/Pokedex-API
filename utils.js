import { db, Users, Pokedex } from "./db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SALT_COUNT = 10;

const { JWT_SECRET } = process.env;

async function createUser(userObj) {
  const { name, email, password, occupation } = userObj;
  //   early return if email is already registered
  const user = await Users.findOne({ where: { email } });
  if (user) {
    throw new Error("This email has already been registered!");
  }
  const hashPw = await bcrypt.hash(password, SALT_COUNT);
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

async function updateUser(userObj, token) {
  try {
    console.log("im here at update user");
    console.log(token);
    console.log(JWT_SECRET);
    const userDetail = jwt.verify(token, JWT_SECRET);
    console.log(userDetail);
    // find user
    let user = await Users.findByPk(userDetail.id);
    const { name, email, password, occupation } = userObj;

    if (name) await user.update({ name });

    if (email) await user.update({ email });

    if (password) {
      const hashPw = await bcrypt.hash(password, SALT_COUNT);
      await user.update({ password: hashPw });
    }

    if (occupation) await user.update({ occupation });

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createPokedexEntry(pokeObj, userObj) {
  try {
    const poke = await Pokedex.create({ pokeObj });
    await poke.setUser(userObj);
    return poke;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updatePokedexEntry(pokeObj, userObj) {
  try {
    let pokedex_entry = await Pokedex.findOne({
      where: {
        name: pokeObj.name,
      },
    });
    await pokedex_entry.setUser(userObj);
    await pokedex_entry.update({ pokeObj });
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
