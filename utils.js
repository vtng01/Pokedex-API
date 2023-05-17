import {db, Users, PokeDex} from "./db/index.js";

async function createUser(userObj) {
    if (!userObj.hasOwnProperty('isAdmin')) {
        userObj['isAdmin'] = false
    }
    try {
        await Users.create({userObj});
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateUser(userObj) {
    try {
        let user = await Users.findOne({where : {
            email : userObj.email,
        }});
        await user.update({userObj});
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createPokedexEntry(pokeObj) {
    try {
        await PokeDex.create({pokeObj});
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updatePokedexEntry(pokeObj) {
    try {
        pokedex_entry = await Pokedex.findOne({where : {
            name : pokeObj.name,
        }});
        await pokedex_entry.update({pokeObj});
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deletePokedexEntry(name) {
    try {
        await Pokedex.destroy({where : {
            name : name,
        }});
    } catch (err) {
        throw new Error(err.message);
    }
}
