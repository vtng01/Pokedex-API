const request = require("supertest");
const app = require("../index.js");

// db setup
const { Users, Pokedex, Logs, db } = require("../db/index.js");
const seed = require("../db/seed.js");

describe("POST /login", () => {
  beforeAll(async () => {
    // rebuild db before the test suite runs
    await db.sync({
      force: true,
    });
    await seed();
  });
  test("should return a message that email or password is incorrect when failed to login", async () => {
    const invalidLogin = {
      email: "doesNotExist@email.com",
      password: "incorrectPassword",
    };
    const response = await request(app)
      .post("/login")
      .send(invalidLogin)
      .expect(400);

    expect(response.text).toBe(
      "Could not login. Your email or password maybe incorrect!"
    );
  });

  test("should pass", async () => {
    expect(1).toBe(1);
  });
});
