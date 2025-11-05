import { CompanyRepository } from './../repository/CompanyRepository.ts';
import { CompanySchema } from '../schemas/companySchema.ts';

export class CompanyService {

    constructor(private repository: CompanyRepository){}

    async createCompany(companyData: CompanySchema){
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

    async updateCompany(companyData: CompanySchema, id: number){
        const updatedCompany = await this.repository.updateCompany(companyData, id)
        return updatedCompany
    }

    async deleteCompany(id: number){
        const message = await this.repository.deleteCompany(id)
        return message
    }
}