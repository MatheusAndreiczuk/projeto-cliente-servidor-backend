import Company from "../models/Company.ts";
import database from '../database/db.js'
import { email, number, z } from 'zod'
import { CompanySchema } from "../schemas/companySchema.ts";

export class CompanyRepository {

    constructor(){
        database.sync().catch((err) => {
            console.log("Erro ao conectar database: ", err)
        })
    }

    async createCompany(companyData: CompanySchema){
        const company = await Company.create(companyData)
        return company.toJSON()
    }

    async getCompanyById(id: number){
        const company = await Company.findByPk(id)
        return company ? company.toJSON() : null
    }

    async updateCompany(companyData: CompanySchema, id: number){
        const [affectedRows, [dataAffected]] = await
            Company.update({
                name: companyData.name,
                business: companyData.business,
                password: companyData.password,
                street: companyData.street,
                city: companyData.city,
                number: companyData.number,
                phone: companyData.phone,
                email: companyData.email,
                state: companyData.state
            }, {
                where: { id },
                returning: true
            })

        const updatedCompany = dataAffected
        return updatedCompany
    }

    async deleteCompany(id: number){
        await Company.destroy({
            where: {id}
        })
        const message = "Company deleted successfully"
        return {message}
    }

    async getCompanyByUsername(username: string){
        const company = await Company.findOne({
            where: { username }
        })
        return company ? company.toJSON() : null
    }
}