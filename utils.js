import { db, Users, Pokedex, Logs } from "./db/index.js";
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
    const user = await Users.create({
      name,
      email,
      password: hashPw,
      occupation,
      isAdmin: false,
    });
    const log = await Logs.create({
      user: user.UserId,
      event: user.name + " registered successfully",
    });
    await log.setUser(user);
    return user;
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
    let logEvent = "";

    if (name) {
      await user.update({ name });
      logEvent += " name ";
    }

    if (email) {
      await user.update({ email });
      logEvent += " email ";
    }

    if (password) {
      const hashPw = await bcrypt.hash(password, SALT_COUNT);
      await user.update({ password: hashPw });
      logEvent += " password ";
    }

    if (occupation) {
      await user.update({ occupation });
      logEvent += " occupation ";
    }

    const log = Logs.create({
      user: user.name,
      event: "User " + user.name + " updated user fields;" + logEvent,
    });
    await Logs.setUser(user);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function adminUpdateUser(id, userObj) {
  let logEvent = "";
  const targetUser = await Users.findByPk(id);
  const { name, email, occupation, password } = userObj;
  if (name) {
    await targetUser.update({ name });
    logEvent += " name ";
  }
  if (email) {
    await targetUser.update({ email });
    logEvent += " email ";
  }
  if (occupation) {
    await targetUser.update({ occupation });
    logEvent += " occupation ";
  }
  if (password) {
    await targetUser.update();
    logEvent += " password ";
  }

  const log = Logs.create({
    user: "Prof. Oak",
    event:
      "The admin (Prof. Oak) has updated user fields;" +
      logEvent +
      "for user with id: " +
      id,
  });
  await Logs.setUser(user);
}

async function createPokedexEntry(pokeObj, userObj) {
  try {
    const poke = await Pokedex.create({ pokeObj });
    await poke.setUser(userObj);
    const log = await Logs.create({
      name: userObj.name,
      event: "User " + userObj.name + " created pokdex entry for: " + poke.name,
    });
    await log.setUser(userObj);
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
    const log = await Logs.create({
      name: userObj.name,
      event:
        "User " + userObj.name + " updated pokedex entry for: " + poke.name,
    });
    await log.setUser(userObj);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deletePokedexEntry(name, userObj) {
  try {
    await Pokedex.destroy({
      where: {
        name: name,
      },
    });
    const log = await Logs.create({
      name: userObj.name,
      event:
        "User successfully" +
        userObj.name +
        " deleted pokdex entry for:" +
        name,
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
  adminUpdateUser,
};
