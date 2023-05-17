import {db, Users, Pokedex, Logs} from "./index.js";
//import {seedData} from "./seedData.js";

async function genUsers(name, password, email, occupation, isAdmin) {
    await Users.create({
        'name': name,
        'password': password,
        'email': email,
        'occupation': occupation,
        'isAdmin': isAdmin
    });
}

export default async function seed() {
    for await (const seedObj of seedData) {
        await genUsers(seedObj.name, seedObj.password, seedObj.email, seedObj.occupation, seedObj.isAdmin);
    }
}

export {seed};
