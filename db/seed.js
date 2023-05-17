import {db, Users, Pokedex, Logs} from "./index.js";
import {seedData} from "./seedData.js";

async function genUsers(name, password, email, occupation, isAdmin) {
    await Users.create({
        'name': name,
        'password': password,
        'email': email,
        'occupation': occupation,
        'isAdmin': isAdmin
    });
}

async function seed() {
    array.forEach(seedObj => {
        await genUsers(seedObj.name, seedObj.password, seedObj.email, seedObj.occupation, seedObj.isAdmin);
    });
}

export {seed};
