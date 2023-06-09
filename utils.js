const { db, Users, Pokedex, Logs } = require("./db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SALT_COUNT = 10;

const { JWT_SECRET } = process.env;

async function createUser(userObj) {
  const { name, email, password, occupation } = userObj;
  //   early return if email is already registered
  const user = await Users.findOne({ where: { email } });
  if (user) {
    throw new Error("This email has already been registered!");
  } else {
    const hashPw = await bcrypt.hash(password, SALT_COUNT);
    try {
      const user = await Users.create({
        name,
        email,
        password: hashPw,
        occupation,
        isAdmin: false,
      });

      await Logs.create({
        user: user.getDataValue("name"),
        event: user.getDataValue("name") + " registered successfully",
        UserId: user.getDataValue("id"),
      });

      return user;
    } catch (err) {
      console.log("Error: Failed to create user or log event - ", err);
      throw new Error(err.message);
    }
  }
}

async function updateUser(userObj, token) {
  try {
    const userDetail = jwt.verify(token, JWT_SECRET);
    // find user
    let user = await Users.findByPk(userDetail.id);
    // const originalName = user.getDataValue('name')
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

    // do not allow user the ability to update their occupation, they be lying
    // if (occupation) {
    //   await user.update({ occupation });
    //   logEvent += " occupation ";
    // }

    const log = Logs.create({
      user: user.getDataValue("name"),
      event:
        "User " + user.getDataValue("name") + " updated user fields" + logEvent,
      UserId: userDetail.id,
    });
    // await Logs.setUser(user);
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
    UserId: 1,
  });

  return targetUser;
  // await Logs.setUser(user);
}

async function createPokedexEntry(pokeObj, userObj) {
  try {
    const { name, type, description } = pokeObj;
    const poke = await Pokedex.create({
      name,
      type,
      description,
      UserId: userObj.getDataValue("id"),
    });
    const userName = userObj.getDataValue("name");
    await Logs.create({
      user: userName,
      event:
        "User " +
        userName +
        " created pokdex entry for: " +
        poke.getDataValue("name"),
      UserId: userObj.getDataValue("id"),
    });
    console.log("hiiiii");

    return poke;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updatePokedexEntry(pokeObj, userObj) {
  try {
    const { name, type, description } = pokeObj;
    let pokedex_entry = await Pokedex.findOne({
      where: {
        name: name,
      },
    });
    if (type) {
      await pokedex_entry.update({ type });
    }

    if (description) {
      await pokedex_entry.update({ description });
    }

    await pokedex_entry.setUser(userObj);
    // await pokedex_entry.update({ pokeObj });

    const userName = userObj.getDataValue("name");
    const log = await Logs.create({
      user: userName,
      event: "User " + userName + " updated pokedex entry for: " + pokeObj.name,
      UserId: userObj.getDataValue("id"),
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
    const userName = userObj.getDataValue("name");

    console.log("user name for deletion", userName);
    await Logs.create({
      user: userName,
      event:
        "User successfully" + userName + " deleted pokedex entry for:" + name,
      UserId: userObj.getDataValue("id"),
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  createUser,
  updateUser,
  createPokedexEntry,
  updatePokedexEntry,
  deletePokedexEntry,
  adminUpdateUser,
};
