import { Sequelize } from 'sequelize';

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false 
})

async function initDatabase() {
    await import('../models/User.js');
    await import('../models/Company.js');

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        await sequelize.sync();
        console.log('Database synchronized successfully.');
        console.log('Models registered:', Object.keys(sequelize.models));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const dbReady = initDatabase();

export default sequelize;