import { companySchema } from "../schemas/companySchema.ts";
import { CompanyService } from "../services/CompanyService.ts";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { request, response } from "express";
import { ZodError } from "zod";

export class CompanyController {
    constructor (private service: CompanyService){}

    async createCompany(req: request, res: response){
        try{
            const body = req.body
            const requestBody = companySchema.parse(body)

            const { name, username } = await this.service.getCompanyByUsername(requestBody.username)
            if(name){
                res.status(409).json({ message: "Company name already exists" })
            } else if(username == requestBody.username){
                res.status(409).json({ message: "Username already exists" })
            }

            const hashedPassword = await bcrypt.hash(requestBody.password, 10)
            requestBody.password = hashedPassword

            const createdUser = await this.service.createCompany(requestBody)
            if(createdUser){
                res.status(201).json({ message: "Created" })
            }
        }catch(err){
            if(err instanceof ZodError){
                res.status(422).json({ message: "One or more fields are incorrect "})
            }
        }
    }

    async loginCompany(req: request, res: response) {
        try {
            const body = req.body
            const company = await this.service.getCompanyByUsername(body.username)

            if (!company) {
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const isMatch = await bcrypt.compare(company.password, body.password)
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" })
            }

            const jwtSecret = process.env.JWT_SECRET;
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '3600';

            const token = jwt.sign({ sub: company.id }, { jwtSecret }, { expiresIn: parseInt(jwtExpiresIn) })
            res.status(200).json( {token, expires_in: parseInt(jwtExpiresIn)} )
        } catch (err) {
            res.status(500).json({message: "Ocorreu um erro inesperado"})
        }
    }

    async getCompanyById(req: request, res: response){
        try{
            const body = req.body
            const companyId = req.userID

            const company = await this.service.getCompanyById(companyId)

            if(!company){
                return res.status(404).json({ message: "Company not found" })
            }

            delete company.id
            res.status(200).json(company)
        }catch(err){

        }
    }
}