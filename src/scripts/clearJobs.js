import sequelize from '../database/db.js';
import Job from '../models/Job.js';

async function initializeDatabaseSchema() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados');

        await sequelize.sync();
        console.log('Schema sincronizado com sucesso');

        const count = await Job.count();
        console.log(`Tabela Jobs inicializada (${count} registros)`);

        process.exit(0);
    } catch (error) {
        console.error('✗ Erro:', error.message);
        process.exit(1);
    }
}

initializeDatabaseSchema();
