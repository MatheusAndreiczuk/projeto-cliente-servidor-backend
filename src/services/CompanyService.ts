import { CompanyRepository } from './../repository/CompanyRepository.js';
import { CompanySchema, CompanySchemaUpdate } from '../schemas/companySchema.js';
import bcrypt from 'bcrypt'

export class CompanyService {

    constructor(private repository: CompanyRepository){}

    async createCompany(companyData: CompanySchema, userService?: any){
        const company = await this.repository.getCompanyByUsername(companyData.username)
        const user = userService ? await userService.getUserByUsername(companyData.username) : null
        if(company || user){
            throw new Error("Username already exists")
        }

        const companyByName = await this.repository.getCompanyByName(companyData.name)
        if (companyByName) {
            throw new Error("Company name already exists")
        }

        const hashedPassword = await bcrypt.hash(companyData.password, 10)
        companyData.password = hashedPassword

        const createdCompany = await this.repository.createCompany(companyData)
        return createdCompany
    }

    async getCompanyById(id: number){
        const company = await this.repository.getCompanyById(id)
        return company
    }

    async getCompanyByUsername(username: string){
        const company = await this.repository.getCompanyByUsername(username);
        return company;
    }

    async getCompanyByName(name: string){
        const company = await this.repository.getCompanyByName(name);
        return company;
    }

    async updateCompany(companyData: CompanySchemaUpdate, id: number){
        const companyExists = await this.repository.getCompanyById(id)

        if(!companyExists){
            throw new Error("Company not found")
        }

        if(companyData.name && companyData.name !== companyExists.name){
            const companyByName = await this.repository.getCompanyByName(companyData.name)
            if(companyByName){
                throw new Error("Company name already exists")
            }
        }

        const hashedPassword = await bcrypt.hash(companyData.password, 10)
        companyData.password = hashedPassword

        const updatedCompany = await this.repository.updateCompany(companyData, id)
        return updatedCompany
    }

    async deleteCompany(id: number){
        const message = await this.repository.deleteCompany(id)
        return message
    }
}