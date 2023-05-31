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
  it("should return a message that email or password is incorrect when failed to login", async () => {
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

  it("should return a token when email and password is correct with successful login message", async () => {
    const validLogin = {
      email: "smith@pallet.edu",
      password: "iFoundCharmanderFirst",
    };

    const response = await request(app)
      .post("/login")
      .send(validLogin)
      .expect(200);

    expect(response.body.message).toEqual("You're logged in!");
    expect(response.body).toHaveProperty("token");
  });

  it("should pass", async () => {
    expect(1).toBe(1);
  });
});

describe("POST /register", () => {
  beforeAll(async () => {
    // rebuild db before the test suite runs
    await db.sync({
      force: true,
    });
    await seed();
  });

  it("should return with error message if email is already registered", async () => {
    const sameEmailRegister = {
      name: "smith",
      email: "smith@pallet.edu",
      password: "iLikePokemonALot",
      occupation: "trainer",
    };

    const response = await request(app)
      .post("/register")
      .send(sameEmailRegister)
      .expect(400);

    expect(response.text).toBe("This email has already been registered!");
  });

  it("should return success message with token when successfully registered", async () => {
    const validRegisterDetails = {
      name: "name",
      email: "legitEmail@email.com",
      password: "password",
      occupation: "trainer",
    };

    const response = await request(app)
      .post("/register")
      .send(validRegisterDetails)
      .expect(200);

    expect(response.body.message).toBe("You're registered sucessfully!");
    expect(response.body).toHaveProperty("token");
  });
});

describe("GET /allUsers", () => {
  beforeAll(async () => {
    // rebuild db before the test suite runs
    await db.sync({
      force: true,
    });
    await seed();
  });

  it("should return with error message when user is not admin", async () => {
    const validRegisterDetails = {
      name: "name",
      email: "legitEmail@email.com",
      password: "password",
      occupation: "trainer",
    };

    const registerResponse = await request(app)
      .post("/register")
      .send(validRegisterDetails)
      .expect(200);

    const token = registerResponse.body.token;

    const response = await request(app)
      .get("/allUsers")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(response.text).toBe(
      "You do not have sufficient permisssion to view this content."
    );
  });

  it("should return success status and correct list of users when requester is admin", async () => {
    const oakLogin = {
      email: "oak@palletreseach.com",
      password: "oakLovesPokemon",
    };

    const loginResponse = await request(app)
      .post("/login")
      .send(oakLogin)
      .expect(200);

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/allUsers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const actual = await Users.findAll({
      attributes: ["name", "email", "occupation"],
      raw: true,
    });

    expect(response.body).toEqual(actual);
  });
});
