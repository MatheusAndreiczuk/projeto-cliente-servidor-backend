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
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'id'
        }
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: 'id'
        }
    }
}, {
    createdAt: true,
    updatedAt: false
});

Feedback.belongsTo(User, { foreignKey: 'userId' })
Feedback.belongsTo(Job, { foreignKey: 'jobId' })
Feedback.belongsTo(Company, { foreignKey: 'companyId' })

export default Feedback
