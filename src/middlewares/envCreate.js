import fs from 'node:fs'
import crypto from 'node:crypto'

const ENV_FILE_PATH = new URL('../../.env', import.meta.url)
const jwtSecret = crypto.randomBytes(32).toString('hex');

const ENV_CONTENT =`
${`JWT_SECRET=${jwtSecret}`}
JWT_EXPIRES_IN=3600
`

export const createEnvFile = (req, res, next) => {
    try{
        if(!fs.existsSync(ENV_FILE_PATH)){
            fs.writeFileSync(ENV_FILE_PATH, ENV_CONTENT.trim())
        }
        next();
    }catch (error) {
        res.status(500).json({ error: 'Deu ruim criando o .env' });
    } 
}