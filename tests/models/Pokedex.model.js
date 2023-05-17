import {db} from '../testDB.js';
import { Sequelize, DataTypes} from 'sequelize';

const Pokedex = db.define('Pokedex', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
});

export {Pokedex}
