import express, { json } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Users } from "./db/index.js";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const { JWT_SECRET } = process.env;
const SALT_COUNT = 10;

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
});

app.post("/register", async (req, res, next) => {
  const { name, email, password, occupation } = req.body;
  const hashPw = await bcrypt.hash(password, SALT_COUNT);
  // create user
  const user = await Users.create({
    name: "ash",
    email: email,
    password: hashPw,
    occupation: occupation,
    isAdmin: false,
  });
  const id = user.getDataValue("id");
  const token = jwt.sign({ id, name, email, occupation }, JWT_SECRET);
  res.send({ message: "You're logged in", token });
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
app.get("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});
app.patch("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});

app.put("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});

app.delete("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});

export default app;
