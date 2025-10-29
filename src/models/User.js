import { Sequelize } from 'sequelize';
import database from '../database/db.js';

const User = database.define("User", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    experience: {
        type: Sequelize.STRING,
        allowNull: true
    },
    education: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, 
{
    createdAt: false, 
    updatedAt: false
})

export default User;