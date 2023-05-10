import express, { json } from "express";
const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

// middleware section

// routes
app.get("/", async (req, res, next) => {
  res.send(`You just got ${req.method} methoded`);
});

app.post("/", async (req, res, next) => {
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
