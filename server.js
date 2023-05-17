import { Sequelize } from "sequelize";
import app from "./index.js";
import { db } from "./db/db.js";

const PORT = 4000;

app.listen(PORT, async () => {
  console.log(`The PokeDex API is running on http://localhost:${PORT}`);
  await db.sync({ force: true });
});
