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

    async getUserApplicationsWithDetails(userId: number, feedbackService: any){
        const applications = await this.repository.findByUser(userId)

        const items = await Promise.all(
            applications.map(async (app: any) => {
                const job = app.Job
                if (!job) return null

                const companyName = job.Company?.name ?? null
                const contact = job.contact ?? job.Company?.email ?? null

                const feedbacks = await feedbackService.getFeedbacksByJobAndUser(job.id, userId)
                const latestFeedback = feedbacks.length > 0 ? feedbacks[0].message : null

                return {
                    job_id: job.id,
                    title: job.title,
                    area: job.area,
                    company: companyName,
                    description: job.description,
                    state: job.state,
                    city: job.city,
                    salary: job.salary,
                    contact: contact,
                    feedback: latestFeedback,
                }
            })
        )

        return items.filter((item) => item !== null)
    }

    async getJobApplicationsWithValidation(jobId: number, companyId: number, loggedCompanyId: number, jobService: any){
        const job = await jobService.getJobById(jobId)
        if (!job) {
            throw new Error("Job not found")
        }

        if (job.companyId !== loggedCompanyId || companyId !== loggedCompanyId) {
            throw new Error("Forbidden")
        }

        const applications = await this.repository.findByJob(jobId)

        return applications.map((app: any) => ({
            user_id: app.userId,
            name: app.name,
            email: app.email || null,
            phone: app.phone || null,
            education: app.education,
            experience: app.experience,
        }))
    }
}
