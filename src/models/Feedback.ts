import { DataTypes } from "sequelize";
import database from '../database/db.js'
import User from "./User.js";
import { Job } from "./Job.js";
import Company from "./Company.js";

export const Feedback = database.define("Feedback", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
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
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id'
        },
        onDelete: "CASCADE"
    }
}, {
    createdAt: true,
    updatedAt: false
});

Feedback.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })
Feedback.belongsTo(Job, { foreignKey: 'jobId', onDelete: 'CASCADE' })
Feedback.belongsTo(Company, { foreignKey: 'companyId', onDelete: 'CASCADE' })
User.hasMany(Feedback, { foreignKey: 'userId', onDelete: 'CASCADE' })
Job.hasMany(Feedback, { foreignKey: 'jobId', onDelete: 'CASCADE' })
Company.hasMany(Feedback, { foreignKey: 'companyId', onDelete: 'CASCADE' })

export default Feedback
