import { ApplicationRepository } from "../repository/ApplicationRepository.js"
import { ApplicationSchema } from "../schemas/applicationSchema.js"

export class ApplicationService {

    constructor(private repository: ApplicationRepository){}

    async createApplication(applicationData: ApplicationSchema & { userId: number; jobId: number }){
        const createdApplication = await this.repository.createApplication(applicationData)
        return createdApplication
    }

    async checkExistingApplication(userId: number, jobId: number){
        const application = await this.repository.findByUserAndJob(userId, jobId)
        return application
    }

    async getApplicationsByUser(userId: number){
        const applications = await this.repository.findByUser(userId)
        return applications
    }

    async getApplicationsByJob(jobId: number){
        const applications = await this.repository.findByJob(jobId)
        return applications
    }
}
