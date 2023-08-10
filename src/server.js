const { Sequelize } = require("sequelize");
const app = require("./index.js");
const { db } = require("./db/db.js");
const seed = require("./db/seed.js");
const PORT = 4000;

app.listen(PORT, async () => {
  console.log(`The PokeDex API is running on http://localhost:${PORT}`);
  await db.sync({ force: true });
  await seed();
});
