import express, { json } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
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
    res.send("Authorization was found in header");
    next();
  }
});

// authorization
app.use(async (req, res, next) => {
  const user = req.user;
  if (user) {
    next();
  } else {
    res.send("Could not find user");
  }
});

// routes
app.get("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});

// app.post("/", async (req, res, next) => {
//   res.send(`You just got ${req.method} methoded`);
// });
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  //   find user
  const isAMatch = await bcrypt.compare(password, user.password);
  if (isAMatch) {
    const token = jwt.sign(user, JWT_SECRET);
    res.send({ message: "You're logged in!", token });
  } else {
    res.sendStatus(401);
  }
});

app.post("/register", async (req, res, next) => {
  const { name, email, password, occupation } = req.body;
  const hashPw = await bcrypt.hash(password, SALT_COUNT);
  // create user
  const token = jwt.sign({ id, email }, JWT_SECRET);
  res.send({ message: "You're logged in", token });
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
