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

            const companyExists = await this.service.getCompanyByUsername(requestBody.username)
            if(companyExists){
                res.status(409).json({ message: "Company name already exists" })
            }

            const hashedPassword = await bcrypt.hash(requestBody.password, 10)
            requestBody.password = hashedPassword

            const createdUser = await this.service.createCompany(requestBody)
            if(createdUser){
                res.status(201).json(createdUser)
            }
        }catch(err){
            if(err instanceof ZodError){
                res.status(422).json({ message: "One or more fields are incorrect "})
            }
        }
    }

    async loginCompany(req: request, res: response){
        try{
            
        }catch(err){

        }
    }
}