import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
import express from "express";
import router from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})