import express, { json } from "express";
const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

// middleware section

// routes
app.get("/", async (req, res, next) => {
  res.send(`You just called ${req.method} method`);
});

app.post("/", async (req, res, next) => {
  res.send(`You just called ${req.method} method`);
});

app.patch("/", async (req, res, next) => {
  res.send(`You just called ${req.method} method`);
});

app.put("/", async (req, res, next) => {
  res.send(`You just called ${req.method} method`);
});

app.delete("/", async (req, res, next) => {
  res.send(`You just called ${req.method} method`);
});

export default app;
