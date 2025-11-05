import dotenv from 'dotenv'
dotenv.config() 

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Carregado' : 'Não encontrado');

import express from "express";
import router from "./routes/index.ts";
import cors from "cors";
import { dbReady } from './database/db.js';

await dbReady;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})