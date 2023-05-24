import express, { json } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Users, Pokedex } from "./db/index.js";

import {
  createUser,
  updateUser,
  createPokedexEntry,
  updatePokedexEntry,
  deletePokedexEntry,
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
    const [, token] = auth.split(" ");
    const userObj = jwt.verify(token, JWT_SECRET);
    // find user
    const user = await Users.findByPk(userObj.id);
    req.user = user;
    next();
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
    const occupation = user.get("occupation");
    if (isAMatch) {
      const token = jwt.sign({ id, name, userEmail, occupation }, JWT_SECRET);
      res.send({ message: "You're logged in!", token });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(400).send(err.message);
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
app.put("/", async (req, res, next) => {
  try {
    await updateUser(req.body);
    res.send(201);
  } catch (err) {
    res.status(400).send(err.message);
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
  let pokedex = PokeDex.findAll();
  try {
    res.send(pokedex);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("pokedex/:name", async (req, res, next) => {
  try {
    let pokedex_entry = await Pokedex.findOne({ where: {
      name: req.params.name,
    }});
    res.send(pokedex_entry);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.post("/pokedex", async (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    const [, token] = auth.split(" ");
    const userObj = jwt.verify(token, JWT_SECRET);
    const user = await Users.findByPk(userObj.id);
    await createPokedexEntry(req.body, user);
    res.sendStatus(201);
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
    await deletePokedexEntry(req.user);
  } catch (err) {
    res.status(400).send(err.mesage);
  }
  res.status(200).send(`You just got ${req.method} methoded`);
});

export default app;
