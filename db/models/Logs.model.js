import {db} from '../db.js';
import { Sequelize, DataTypes} from 'sequelize';

const Logs = db.define('Log', {
    pokemonName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

export {Logs}
