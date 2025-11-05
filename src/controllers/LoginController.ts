import { Request, Response } from 'express';
import { UserService } from "../services/UserService.js";
import { CompanyService } from "../services/CompanyService.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class LoginController{
    constructor(private userService: UserService, private companyService: CompanyService){}

    async login(req: Request, res: Response){
        try{
            const { username, password } = req.body

            const existsUser = await this.userService.loginUser(username)
            const existsCompany = await this.companyService.getCompanyByUsername(username)

            const jwtSecret = process.env.JWT_SECRET;
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '3600';

            if(!jwtSecret){
                throw new Error("JWT_SECRET not configured");
            }

            if(!existsUser && !existsCompany){
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const entity = existsUser || existsCompany;
            if (!entity) {
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const isMatch = await bcrypt.compare(password, entity.password)
            if(!isMatch){
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const token = jwt.sign({ sub: entity.id }, jwtSecret, { expiresIn: parseInt(jwtExpiresIn) });
            return res.status(200).json({ token, expires_in: parseInt(jwtExpiresIn) });
            
        }catch(error){
            if(error instanceof Error){
                return res.status(500).json({ message: error.message })
            }
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }

    async logout(req: Request, res: Response) {
        return res.status(200).json({ message: "OK" })
    }
}
