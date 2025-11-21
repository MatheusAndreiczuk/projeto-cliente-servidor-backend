import { Application } from "../models/Application.js"
import { Job } from "../models/Job.js"
import Company from "../models/Company.js"
import { ApplicationSchema } from "../schemas/applicationSchema.js"

export class ApplicationRepository {

    constructor(){}

    async createApplication(applicationData: ApplicationSchema & { userId: number; jobId: number }){
        const application = await Application.create(applicationData)
        return application ? application.toJSON() : null
    }

    async findByUserAndJob(userId: number, jobId: number){
        const application = await Application.findOne({
            where: { userId, jobId }
        })
        return application ? application.toJSON() : null
    }

    async findByUser(userId: number){
        const applications = await Application.findAll({
            where: { userId },
            include: [
                {
                    model: Job,
                    include: [Company]
                }
            ]
        })
        return applications.map(app => app.toJSON())
    }

    async findByJob(jobId: number){
        const applications = await Application.findAll({
            where: { jobId }
        })
        return applications.map(app => app.toJSON())
    }
}
