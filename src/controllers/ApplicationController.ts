import { Request, Response } from "express"
import { ApplicationService } from "../services/ApplicationService.js"
import { JobService } from "../services/JobService.js"
import { FeedbackService } from "../services/FeedbackService.js"
import { applicationSchema } from "../schemas/applicationSchema.js"
import { ZodError } from "zod"

export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private feedbackService: FeedbackService
  ) {}

  async applyToJob(req: Request, res: Response): Promise<Response> {
    try {
      const jobId = parseInt(req.params.id)
      const userId = (req as any).userID

      const job = await this.jobService.getJobById(jobId)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      const validatedData = applicationSchema.parse(req.body)

      const existingApplication = await this.applicationService.checkExistingApplication(userId, jobId)
      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied to this job" })
      }

      await this.applicationService.createApplication({
        ...validatedData,
        userId,
        jobId,
      })

      return res.status(200).json({ message: "Applied successfully" })
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err) => ({
          field: err.path.join("."),
          error: err.message,
        }))

        return res.status(422).json({
          message: "Validation error",
          code: "UNPROCESSABLE",
          details,
        })
      }

      console.error("Error applying to job:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getUserApplications(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.user_id)

      const applications = await this.applicationService.getApplicationsByUser(userId)

      const items = await Promise.all(
        applications.map(async (app: any) => {
          const job = app.Job
          if (!job) return null

          const companyName = job.Company?.name ?? null
          const contact = job.contact ?? job.Company?.email ?? null

          const feedbacks = await this.feedbackService.getFeedbacksByJobAndUser(job.id, userId)
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

      const validItems = items.filter((item) => item !== null)

      return res.status(200).json({ items: validItems })
    } catch (error) {
      console.error("Error fetching user applications:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getJobApplications(req: Request, res: Response): Promise<Response> {
    try {
      const companyId = parseInt(req.params.company_id)
      const jobId = parseInt(req.params.job_id)
      const loggedCompanyId = (req as any).userID

      const job = await this.jobService.getJobById(jobId)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.companyId !== loggedCompanyId || companyId !== loggedCompanyId) {
        return res.status(403).json({ message: "Forbidden" })
      }

      const applications = await this.applicationService.getApplicationsByJob(jobId)

      const items = applications.map((app: any) => ({
        user_id: app.userId,
        name: app.name,
        email: app.email || null,
        phone: app.phone || null,
        education: app.education,
        experience: app.experience,
      }))

      return res.status(200).json({ items })
    } catch (error) {
      console.error("Error fetching job applications:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}
