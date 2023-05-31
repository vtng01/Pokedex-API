import express, { json } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Users, Pokedex, Logs } from "./db/index.js";

import {
  createUser,
  updateUser,
  createPokedexEntry,
  updatePokedexEntry,
  deletePokedexEntry,
  adminUpdateUser,
} from "./utils.js";

import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const { JWT_SECRET } = process.env;

app.use(json());
app.use(express.urlencoded({ extended: true }));

// middleware section
// authentication
app.use(async (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else {
    try {
      const [, token] = auth.split(" ");
      const userObj = jwt.verify(token, JWT_SECRET);
      // find user
      const user = await Users.findByPk(userObj.id);
      req.user = user;
      next();
    } catch (err) {
      res.status(400).send(err.mesage);
    }
  }
});

// app.post("/", async (req, res, next) => {
//   res.send(`You just got ${req.method} methoded`);
// });
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  //   find user
  try {
    const user = await Users.findOne({ where: { email } });
    const userPassword = user.getDataValue("password");
    const isAMatch = await bcrypt.compare(password, userPassword);
    const id = user.getDataValue("id");
    const name = user.getDataValue("name");
    const userEmail = user.getDataValue("email");
    const occupation = user.getDataValue("occupation");
    if (isAMatch) {
      const token = jwt.sign({ id, name, userEmail, occupation }, JWT_SECRET);
      await Logs.create({ user: name, event: `${name} logged in`, UserId: id });
      res.send({ message: "You're logged in!", token });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res
      .status(400)
      .send("Could not login. Your email or password maybe incorrect!");
  }
});

app.post("/register", async (req, res, next) => {
  // create user
  try {
    const user = await createUser(req.body);
    const id = user.getDataValue("id");
    const name = user.getDataValue("name");
    const email = user.getDataValue("email");
    const occupation = user.get("occupation");
    const token = jwt.sign({ id, name, email, occupation }, JWT_SECRET);
    res.send({ message: "You're logged in", token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
// authorization
app.use(async (req, res, next) => {
  const user = req.user;
  if (user) {
    next();
  } else {
    res
      .status(401)
      .send(
        "User could not be validated. Please Login or Register for an account."
      );
  }
});

// routes

// list of all users
app.get("/allUsers", async (req, res, next) => {
  const user = req.user;
  const name = user.getDataValue("name");
  const id = user.getDataValue("id");
  if (!user.getDataValue("isAdmin")) {
    await Logs.create({
      user: name,
      event: `${name} attempted to view all users but they do not have permission`,
      UserId: id,
    });
    res
      .status(403)
      .send("You do not have sufficient permisssion to view this content.");
  }
  try {
    const allUsers = await Users.findAll({
      attributes: ["name", "email", "occupation"],
    });
    await Logs.create({
      user: name,
      event: `${name} viewed list of all users`,
      UserId: id,
    });
    res.send(allUsers);
  } catch (err) {
    next();
  }
});

// update user info
app.put("/profile", async (req, res, next) => {
  // obtain token from user
  const auth = req.header("Authorization");
  if (!auth) {
    res.status(400).send("You are not authorized to make an update");
  }
  const [, token] = auth.split(" ");

  try {
    const user = await updateUser(req.body, token);
    res.send(
      `Updated profile information successfully. Please sign in using ${user.getDataValue(
        "email"
      )} next time.`
    );
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// admin update user info
app.put("/profile/:id", async (req, res, next) => {
  const user = req.user;

  if (!user.getDataValue("isAdmin")) {
    res
      .status(403)
      .send(
        "You do not have sufficient permission to update user information."
      );
  }

  try {
    console.log("hi there admin!!!!");
    const adminId = req.user.getDataValue("id");
    console.log("what is your id?", adminId);
    const user = await adminUpdateUser(req.params.id, req.body);

    // const targetUser = await Users.findByPk(id)
    // const {name, email, occupation, password} = req.body;
    // if (name) await targetUser.update({name})
    // if(email) await targetUser.update({email})
    // if (occupation) await targetUser.update({occupation})
    // if (password) await targetUser.update()
    res.send(
      `Updated profile information successfully. Please sign in using ${user.getDataValue(
        "email"
      )} next time if you are ${user.getDataValue("name")}.`
    );
  } catch (err) {
    next();
  }
});

// get profile info
app.get("/profile", async (req, res, next) => {
  try {
    // find user
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/pokedex", async (req, res, next) => {
  try {
    let pokedex = await Pokedex.findAll();
    for (let i = 0; i < pokedex.length; i++) {
      let professor = await Users.findByPk(pokedex[i].UserId);
      pokedex[i].dataValues["lastUpdatedBy"] = professor.name;
    }
    res.send(pokedex);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/pokedex/:name", async (req, res, next) => {
  try {
    let pokedex_entry = await Pokedex.findOne({
      where: {
        name: req.params.name,
      },
    });
    let user = await Users.findByPk(pokedex_entry["UserId"]);
    const name = user.getDataValue("name");
    const id = user.getDataValue("id");
    pokedex_entry.dataValues["lastUpdatedBy"] = user.name;
    await Logs.create({
      user: name,
      event: `${name} viewed Pokedex details for ${req.params.name}`,
      UserID: id,
    });
    res.send(pokedex_entry);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/pokedex", async (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    const [, token] = auth.split(" ");
    const userObj = jwt.verify(token, JWT_SECRET);
    const user = await Users.findByPk(userObj.id);
    console.log("attempting to create pokemon entry");
    if (user.getDataValue("occupation") == "Researcher") {
      await createPokedexEntry(req.body, user);
      res.sendStatus(201);
    } else {
      res
        .status(401)
        .send("You do you not have permission to add new Pokedex entries");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/pokedex", async (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    const [, token] = auth.split(" ");
    const userObj = jwt.verify(token, JWT_SECRET);
    const user = await Users.findByPk(userObj.id);
    await updatePokedexEntry(req.body, User);
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/pokedex", async (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    const [, token] = auth.split(" ");
    const userObj = jwt.verify(token, JWT_SECRET);
    const user = await Users.findByPk(userObj.id);
    await deletePokedexEntry(req.user, userObj);
  } catch (err) {
    res.status(400).send(err.mesage);
  }
  res.status(200).send(`You just got ${req.method} methoded`);
});

app.get("/logs", async (req, res, next) => {
  const user = req.user;
  const name = user.getDataValue("name");
  let logs = "";
  try {
    await Logs.create({
      user: name,
      event: `${name} viewed the logs`,
      UserId: user.getDataValue("id"),
    });
    if (user.getDataValue("isAdmin")) {
      logs = await Logs.findAll();
    } else {
      logs = await Logs.findAll({
        where: {
          UserId: user.getDataValue("id"),
        },
      });
    }

    res.send(logs);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// viewing other people's logs
app.get("/logs/:id", async (req, res, next) => {
  const user = req.user;
  const name = user.getDataValue("name");
  try {
    if (user.getDataValue("isAdmin")) {
      await Logs.create({
        user: name,
        event: `${name} is viewing the logs entry of user with id ${req.params.id}`,
        UserId: user.getDataValue("id"),
      });
      const logs = await Logs.findAll({
        where: {
          UserId: req.params.id,
        },
      });

      res.send(logs);
    } else {
      await Logs.create({
        user: name,
        event: `${name} is attempted to view the logs entry of user with id ${req.params.id} but they do not have permission!`,
        UserId: user.getDataValue("id"),
      });
      res.status(400).send("You do not have permission to use this feature");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
export default app;
