import app from "./index.js";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`The PokeDex API is running on http://localhost:${PORT}`);
});
