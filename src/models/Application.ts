import { DataTypes } from "sequelize";
import database from '../database/db.js'
import User from "./User.js";
import { Job } from "./Job.js";

export const Application = database.define("Application", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    education: {
        type: DataTypes.STRING(600),
        allowNull: false
    },
    experience: {
        type: DataTypes.STRING(600),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'id'
        },
        onDelete: "CASCADE"
    }
}, {
    createdAt: true,
    updatedAt: false
});

Application.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })
Application.belongsTo(Job, { foreignKey: 'jobId', onDelete: 'CASCADE' })
User.hasMany(Application, { foreignKey: 'userId', onDelete: 'CASCADE' })
Job.hasMany(Application, { foreignKey: 'jobId', onDelete: 'CASCADE' })

export default Application
