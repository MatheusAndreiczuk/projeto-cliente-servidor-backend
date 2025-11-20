import { DataTypes } from "sequelize";
import database from '../database/db.js'
import Company from "./Company.js";

export const Job = database.define("Job", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.DOUBLE,
        allowNull: true
    }
}, {
    createdAt: true,
    updatedAt: false
})

Job.belongsTo(Company, {
    foreignKey: 'companyId'
})
Company.hasMany(Job, {
    foreignKey: 'companyId'
})

export default Job