import { companySchema, CompanySchemaUpdate, companySchemaUpdate } from "../schemas/companySchema.js";
import { CompanyService } from "../services/CompanyService.js";
import { UserService } from "../services/UserService.js";
import { Request, Response } from "express";
import { ZodError } from "zod";

export class CompanyController {
    constructor (private service: CompanyService, private userService: UserService){}

    async createCompany(req: Request, res: Response){
        try{
            const body = req.body
            console.log("Received request body for creating company:", body);
            const requestBody = companySchema.parse(body)

            const createdUser = await this.service.createCompany(requestBody, this.userService)
            if(createdUser){
                return res.status(201).json({ message: "Created" })
            }
        }catch(error){
            if(error instanceof ZodError){
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), error: i.message })) || []
                });
            }
            if(error instanceof Error){
                if(error.message === "Username already exists"){
                    return res.status(409).json({ message: `${error.message}` })
                }
                if(error.message === "Company name already exists"){
                    return res.status(409).json({ message: `${error.message}` })
                }
            }
            return res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" })
        }
    }

    async getCompanyById(req: Request, res: Response){
        try{
            const companyId = (req as any).userID

            const company = await this.service.getCompanyById(companyId)

            if(!company){
                return res.status(404).json({ message: "Company not found" })
            }

            delete company.id
            delete company.password
            return res.status(200).json(company)
        }catch(error){
            return res.status(500).json({message: "Internal Server Error"})
        }
    }

    async updateCompany (req: Request, res: Response){
        try {
            const body = req.body
            const companyId = (req as any).userID
            const requestBody = companySchemaUpdate.parse(body)

            const result = await this.service.updateCompany(requestBody, companyId)

            if(!result){
                return res.status(500).json({ message: "Internal Server Error" })
            }

            return res.status(200).json({ message: "Updated" })
        } catch(error){
           if (error instanceof ZodError) {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), error: i.message })) || []
                });
            }
            if(error instanceof Error){
                if(error.message === "Company not found"){
                    return res.status(404).json({ message: `${error.message}` })
                }
                if(error.message === "Company name already exists"){
                    return res.status(409).json({ message: `${error.message}` })
                }
            }
            return res.status(500).json({ message: (error as Error).message })
        }
    }

    async deleteCompany(req: Request, res: Response){
        const deleteMessage = await this.service.getCompanyById((req as any).userID)
        if(!deleteMessage){
            return res.status(404).json({ message: "Company not found" })
        }
        await this.service.deleteCompany((req as any).userID)
        return res.status(200).json({ message: "Deleted successfully" })
    }
}