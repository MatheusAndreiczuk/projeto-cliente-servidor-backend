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

      const items = await this.applicationService.getUserApplicationsWithDetails(userId, this.feedbackService)

      return res.status(200).json({ items })
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

      const items = await this.applicationService.getJobApplicationsWithValidation(
        jobId,
        companyId,
        loggedCompanyId,
        this.jobService
      )

      return res.status(200).json({ items })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Job not found") {
          return res.status(404).json({ message: "Job not found" })
        }
        if (error.message === "Forbidden") {
          return res.status(403).json({ message: "Forbidden" })
        }
      }
      console.error("Error fetching job applications:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}
