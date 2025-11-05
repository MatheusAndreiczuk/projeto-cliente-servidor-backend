import Company from "../models/Company.js";
import { CompanySchema } from "../schemas/companySchema.js";

export class CompanyRepository {

    constructor(){}

    async createCompany(companyData: CompanySchema){
        const company = await Company.create(companyData);
        return company ? company.toJSON() : null;
    }

    async getCompanyById(id: number){
        const company = await Company.findByPk(id)
        return company ? company.toJSON() : null
    }

    async updateCompany(companyData: CompanySchema, id: number){
        await Company.update({
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
            where: { id }
        })

        const updatedCompany = await Company.findByPk(id)
        return updatedCompany ? updatedCompany.toJSON() : null
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
            where: { username: username }
        })
        return company ? company.toJSON() : null
    }

    async getCompanyByName(name: string){
        const company = await Company.findOne({
            where: { name: name }
        })
        return company ? company.toJSON() : null
    }
}